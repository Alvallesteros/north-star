from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CourseSerializer
from django.conf import settings
from django.views.generic import TemplateView
from bson import ObjectId

COURSES = settings.MONGO_DB.courses

class index(TemplateView):
    template_name = 'index.html'

class course(TemplateView):
    template_name = 'list.html'

class course_detail(TemplateView):
    template_name = 'detail.html'


# Create your views here.

class CourseList(APIView):
    # GET all courses
    def get(self, request):
        courses = list(COURSES.find())
        for course in courses:
            course['_id'] = str(course['_id'])
        return Response(courses)

    # POST a new course
    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            course = serializer.data
            pipeline = [
                   { '$addFields': { 'temp_id': { '$toInt': "$_id" } } },
                   { '$sort': { 'temp_id': -1 } },
                   { '$limit': 1 }
            ]
            max_id = list(COURSES.aggregate(pipeline))[0]
            course['_id'] = str(int(max_id['_id']) + 1)
            COURSES.insert_one(course)
            return Response(course, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CourseDetail(APIView):
    # GET, PUT, DELETE a course
    def get(self, request, pk):
        course = COURSES.find_one({"_id": pk})
        if course:
            course['_id'] = str(course['_id'])
            pipeline = [
                {'$match': {'_id': pk}},
                {'$lookup': {
                    'from': 'skills',
                    'localField': 'skill_id',
                    'foreignField': '_id',
                    'as': 'skill'
                }},
                {'$unwind': '$skill'},
                {'$project': {'_id': 0, 'skill_id': '$skill._id', 'skill': '$skill.name'}}
            ]
            course['skill_id'] = list(COURSES.aggregate(pipeline))
            pipeline = [
                {'$match': {'_id': pk}},
                {'$lookup': {
                    'from': 'careers',
                    'localField': 'career_id',
                    'foreignField': '_id',
                    'as': 'career'
                }},
                {'$unwind': '$career'},
                {'$project': {'_id': 0, 'career_id': '$career._id', 'career': '$career.title'}}
            ]
            course['career_id'] = list(COURSES.aggregate(pipeline))
            return Response(course)
        return Response(status=status.HTTP_404_NOT_FOUND)

    # PUT a course
    def put(self, request, pk):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            COURSES.update_one(
                {"_id": pk},
                {"$set": serializer.data}
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE a course
    def delete(self, request, pk):
        COURSES.delete_one({"_id": pk})
        return Response(status=status.HTTP_204_NO_CONTENT)
