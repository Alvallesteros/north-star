from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MajorSerializer, CareerSerializer
from django.conf import settings
from django.views.generic import TemplateView
from bson import ObjectId

MAJORS = settings.MONGO_DB.majors
CAREERS = settings.MONGO_DB.careers
USERS= settings.MONGO_DB.users
     

class careerList(TemplateView):
    template_name = 'career_list.html'

class careerDetail(TemplateView):
    template_name = 'career_detail.html'

class majorList(TemplateView):
    template_name = 'major_list.html'

class majorDetail(TemplateView):
    template_name = 'major_detail.html'

class MajorList(APIView):
        # GET all majors
        def get(self, request):
            majors = list(MAJORS.find())
            for major in majors:
                major['_id'] = str(major['_id'])
            return Response(majors)

        # POST a new major
        def post(self, request):
                serializer = MajorSerializer(data=request.data)
                if serializer.is_valid():
                        major = serializer.data
                        pipeline = [
                               { '$addFields': { 'temp_id': { '$toInt': "$_id" } } },
                               { '$sort': { 'temp_id': -1 } },
                               { '$limit': 1 }
                        ]
                        max_id = list(MAJORS.aggregate(pipeline))[0]
                        major['_id'] = str(int(max_id['_id']) + 1)
                        MAJORS.insert_one(major)
                        return Response(major, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class MajorDetail(APIView):
    # GET, PUT, DELETE a major
    def get(self, request, pk):
        major = MAJORS.find_one({"_id": pk})
        if major:
            major['_id'] = str(major['_id'])
            pipeline = [
                {'$match': {'_id': pk}},
                {'$lookup': {
                    'from': 'careers',
                    'localField': 'related_careers',
                    'foreignField': '_id',
                    'as': 'career'
                }},
                {'$unwind': '$career'},
                {'$project': {'_id': 0, 'career_id': '$career._id', 'career': '$career.title'}}
            ]
            major['related_careers'] = list(MAJORS.aggregate(pipeline))
            return Response(major)
        return Response(status=status.HTTP_404_NOT_FOUND)

    # PUT a major
    def put(self, request, pk):
        serializer = MajorSerializer(data=request.data)
        if serializer.is_valid():
            MAJORS.update_one(
                {"_id": pk},
                {"$set": serializer.data}
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE a major
    def delete(self, request, pk):
        MAJORS.delete_one({"_id": pk})
        return Response(status=status.HTTP_204_NO_CONTENT)

class CareerList(APIView):
        # GET all careers
        def get(self, request):
            careers = list(CAREERS.find())
            for career in careers:
                career['_id'] = str(career['_id'])
            return Response(careers)

        # POST a new career
        def post(self, request):
                serializer = CareerSerializer(data=request.data)
                if serializer.is_valid():
                        career = serializer.data
                        pipeline = [
                               { '$addFields': { 'temp_id': { '$toInt': "$_id" } } },
                               { '$sort': { 'temp_id': -1 } },
                               { '$limit': 1 }
                        ]
                        max_id = list(CAREERS.aggregate(pipeline))[0]
                        career['_id'] = str(int(max_id['_id']) + 1)
                        CAREERS.insert_one(career)
                        return Response(career, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class CareerDetail(APIView):
    # GET, PUT, DELETE a career
    def get(self, request, pk):
        career = CAREERS.find_one({"_id": pk})
        if career:
            career['_id'] = str(career['_id'])
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
            career['skill_id'] = list(CAREERS.aggregate(pipeline))
            pipeline = [
                {'$match': {'_id': pk}},
                {'$lookup': {
                    'from': 'courses',
                    'localField': 'course_id',
                    'foreignField': '_id',
                    'as': 'course'
                }},
                {'$unwind': '$course'},
                {'$project': {'_id': 0, 'course_id': '$course._id', 'course': '$course.title'}}
            ]
            career['course_id'] = list(CAREERS.aggregate(pipeline))
            return Response(career)
        return Response(status=status.HTTP_404_NOT_FOUND)

    # PUT a career
    def put(self, request, pk):
        serializer = CareerSerializer(data=request.data)
        if serializer.is_valid():
            CAREERS.update_one(
                {"_id": pk},
                {"$set": serializer.data}
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE a career
    def delete(self, request, pk):
        CAREERS.delete_one({"_id": pk})
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class Top5CareersPerMajor(APIView):
     def get(self, request, pk):
        pipeline = [
            {'$match': {'_id': pk}},
            {'$unwind': '$related_careers'},
            {'$lookup': {
            'from': 'careers',
            'localField': 'related_careers',
            'foreignField': '_id',
            'as': 'career'
            }},
            {'$unwind': '$career'},
            {'$project': {'_id': 0, 'career_id': '$career._id', 'salary': '$career.salary', 'title': '$career.title'}},
            {'$unionWith': {
            'coll': 'users',
            'pipeline': [
                {'$lookup': {'from': 'majors', 'localField': 'profile.major', 'foreignField': '_id', 'as': 'major'}},
                {'$match': {'major._id': pk}},
                {'$unwind': '$recommendations'},
                {'$lookup': {'from': 'careers', 'localField': 'recommendations.career_id', 'foreignField': '_id', 'as': 'career'}},
                {'$unwind': '$career'},
                {'$project': {'_id': 0, 'career_id': '$career._id', 'salary': '$career.salary', 'title': '$career.title'}}
            ]
            }},
            {'$group': {'_id': '$career_id', 'title': {'$first': '$title'}, 'salary': {'$first': '$salary'}}},
            {'$sort': {'salary': -1}},
            {'$limit': 5}
        ]
        careers = list(MAJORS.aggregate(pipeline))
        return Response(careers)