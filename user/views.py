from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SkillSerializer, UserSerializer
from django.conf import settings
from django.views.generic import TemplateView
from bson import ObjectId

SKILLS = settings.MONGO_SKILLS
USERS = settings.MONGO_USERS
MAJOR = settings.MONGO_MAJOR
CAREER = settings.MONGO_CAREER
COURSE = settings.MONGO_COURSE


class skillList(TemplateView):
        template_name = 'skill_list.html'

class skillDetail(TemplateView):
        template_name = 'skill_detail.html'

class userList(TemplateView):
        template_name = 'user_list.html'

class userDetail(TemplateView):
        template_name = 'user_detail.html'

# Create your views here.
class SkillList(APIView):
        # GET all skills
        def get(self, request):
            skills = list(SKILLS.find())
            for skill in skills:
                skill['_id'] = str(skill['_id'])
            return Response(skills)

        # POST a new skill
        def post(self, request):
                serializer = SkillSerializer(data=request.data)
                if serializer.is_valid():
                        skill = serializer.data
                        pipeline = [
                               { '$addFields': { 'temp_id': { '$toInt': "$_id" } } },
                               { '$sort': { 'temp_id': -1 } },
                               { '$limit': 1 }
                        ]
                        max_id = list(SKILLS.aggregate(pipeline))[0]
                        skill['_id'] = str(int(max_id['_id']) + 1)
                        SKILLS.insert_one(skill)
                        return Response(skill, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SkillDetail(APIView):
        # GET, PUT, DELETE a skill
        def get(self, request, pk):
                skill = SKILLS.find_one({"_id": pk})
                if skill:
                        skill['_id'] = str(skill['_id'])
                        pipeline = [
                                {'$match': {'_id': skill['_id']}},
                                {'$lookup': {'from': 'careers', 'localField': 'career_id', 'foreignField': '_id', 'as': 'related_careers'}},
                                {'$unwind': '$related_careers'},
                                {'$project': {'_id': 0, 'career_id': '$related_careers._id', 'career': '$related_careers.title'}}
                        ]
                        skill['career_id'] = list(SKILLS.aggregate(pipeline))
                        pipeline = [
                                {'$match': {'_id': skill['_id']}},
                                {'$lookup': {'from': 'courses', 'localField': 'course_id', 'foreignField': '_id', 'as': 'related_courses'}},
                                {'$unwind': '$related_courses'},
                                {'$project': {'_id': 0, 'course_id': '$related_courses._id', 'course': '$related_courses.title'}}
                        ]
                        skill['course_id'] = list(SKILLS.aggregate(pipeline))
                        return Response(skill)
                return Response(status=status.HTTP_404_NOT_FOUND)

        # PUT a skill
        def put(self, request, pk):
                serializer = SkillSerializer(data=request.data)
                if serializer.is_valid():
                        SKILLS.update_one(
                                {"_id": pk},
                                {"$set": serializer.data}
                        )
                        return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # DELETE a skill
        def delete(self, request, pk):
                SKILLS.delete_one({"_id": pk})
                return Response(status=status.HTTP_204_NO_CONTENT)
        
class UserList(APIView):
        # GET all users
        def get(self, request):
            users = list(USERS.find())
            for user in users:
                user['_id'] = str(user['_id'])
            return Response(users)

        # POST a new user
        def post(self, request):
                serializer = UserSerializer(data=request.data)
                if serializer.is_valid():
                        user = serializer.data
                        pipeline = [
                               { '$addFields': { 'temp_id': { '$toInt': "$_id" } } },
                               { '$sort': { 'temp_id': -1 } },
                               { '$limit': 1 }
                        ]
                        max_id = list(USERS.aggregate(pipeline))[0]
                        user['_id'] = str(int(max_id['_id']) + 1)
                        USERS.insert_one(user)
                        
                        careers = set()
                        user['recommendations'] = []
                        pipeline = [
                                {'$match': {'_id': user['_id']}},
                                {'$lookup': {'from': 'majors', 'localField': 'profile.major', 'foreignField': '_id', 'as': 'related_major'}},
                                {'$unwind': '$related_major'},
                                {'$project': {'related_major.related_careers': 1}}
                        ]
                        related_majors = list(USERS.aggregate(pipeline))
                        for major in related_majors:
                               for career in major['related_major']['related_careers']:
                                      careers.add(career)
                        
                        pipeline = [
                                {'$match': {'_id': user['_id']}},
                                {'$lookup': {'from': 'skills', 'localField': 'profile.skill_id', 'foreignField': '_id', 'as': 'related_skills'}},
                                {'$unwind': '$related_skills'},
                                {'$project': {'related_skills.career_id': 1}}
                        ]
                        related_skills = list(USERS.aggregate(pipeline))
                        for skill in related_skills:
                                for career in skill['related_skills']['career_id']:
                                        careers.add(career)
                        
                        for c in careers:
                               user['recommendations'].append({'career_id': c, 'status': 'Unviewed'})

                        USERS.update_one(
                                {"_id": user['_id']},
                                {"$set": user}
                        )

                        #pipeline = [
                        #        {'$foreignField': '_id', 'from': 'skills', 'localField': 'profile.skill_id', 'as': 'related_skills'},
                        #        {'$unwind': '$related_skills'},
                        #        {'$project': {'related_skills.career_id': 1}}
                        #]
                        #related_careers = list(USERS.aggregate(pipeline))
                        #print(related_careers)                        
                        
                        return Response(user, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserDetail(APIView):
        # GET, PUT, DELETE a user
        def get(self, request, pk):
                user = USERS.find_one({"_id": pk})
                if user:
                        user['_id'] = str(user['_id'])
                        pipeline = [
                                {'$match': {'_id': user['_id']}},
                                {'$lookup': {'from': 'skills', 'localField': 'profile.skill_id', 'foreignField': '_id', 'as': 'related_skills'}},
                                {'$unwind': '$related_skills'},
                                {'$project': {'_id': 0, 'skill_id': '$related_skills._id','skill': '$related_skills.name'}}
                        ]
                        user['profile']['skill_id'] = list(USERS.aggregate(pipeline))
                        pipeline = [
                               {'$match': {'_id': user['_id']}},
                               {'$lookup': {'from': 'majors', 'localField': 'profile.major', 'foreignField': '_id', 'as': 'related_major'}},
                               {'$unwind': '$related_major'},
                               {'$project': {'_id': 0, 'major_id': '$related_major._id', 'major': '$related_major.title'}}
                        ]
                        user['profile']['major'] = list(USERS.aggregate(pipeline))
                        pipeline = [
                                {'$match': {'_id': user['_id']}},
                                {'$lookup': {'from': 'courses', 'localField': 'profile.courses_taken', 'foreignField': '_id', 'as': 'related_course'}},
                                {'$unwind': '$related_course'},
                                {'$project': {'_id': 0, 'course_id': '$related_course._id', 'course': '$related_course.title'}}
                        ]
                        user['profile']['courses_taken'] = list(USERS.aggregate(pipeline))
                        pipeline = [
                                {'$match': {'_id': user['_id']}},
                                {'$unwind': '$recommendations'},
                                {'$lookup': {'from': 'careers', 'localField': 'recommendations.career_id', 'foreignField': '_id', 'as': 'related_careers'}},
                                {'$unwind': '$related_careers'},
                                {'$project': {'_id': 0, 'career_id': '$related_careers._id', 'career': '$related_careers.title', 'status': '$recommendations.status'}}
                        ]
                        user['recommendations'] = list(USERS.aggregate(pipeline))
                        return Response(user)
                return Response(status=status.HTTP_404_NOT_FOUND)

        # PUT a user
        def put(self, request, pk):
                serializer = UserSerializer(data=request.data)
                if serializer.is_valid():
                        user = serializer.data
                        careers = set()
                        user['recommendations'] = []
                        pipeline = [
                                {'$match': {'_id': pk}},
                                {'$lookup': {'from': 'majors', 'localField': 'profile.major', 'foreignField': '_id', 'as': 'related_major'}},
                                {'$unwind': '$related_major'},
                                {'$project': {'related_major.related_careers': 1}}
                        ]
                        related_majors = list(USERS.aggregate(pipeline))
                        for major in related_majors:
                               for career in major['related_major']['related_careers']:
                                      careers.add(career)
                        
                        pipeline = [
                                {'$match': {'_id': pk}},
                                {'$lookup': {'from': 'skills', 'localField': 'profile.skill_id', 'foreignField': '_id', 'as': 'related_skills'}},
                                {'$unwind': '$related_skills'},
                                {'$project': {'related_skills.career_id': 1}}
                        ]
                        related_skills = list(USERS.aggregate(pipeline))
                        for skill in related_skills:
                                for career in skill['related_skills']['career_id']:
                                        careers.add(career)
                        
                        for c in careers:
                               user['recommendations'].append({'career_id': c, 'status': 'Unviewed'})
                        USERS.update_one(
                                {"_id": pk},
                                {"$set": user}
                        )
                        return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # DELETE a user
        def delete(self, request, pk):
                USERS.delete_one({"_id": pk})
                return Response(status=status.HTTP_204_NO_CONTENT)
        

class GetSkillGaps(APIView):
        def get(self, request, pk):
                user = USERS.find_one({"_id": pk})
                if user:
                        user['_id'] = str(user['_id'])
                        pipeline = [
                                {'$match': {'_id': user['_id']}},
                                {'$lookup': {'from': 'careers', 'localField': 'recommendations.career_id', 'foreignField': '_id', 'as': 'related_careers'}},
                                {'$unwind': '$related_careers'},
                                {'$project': {'related_careers.skill_id': 1}},
                                {'$lookup': {'from': 'skills', 'localField': 'related_careers.skill_id', 'foreignField': '_id', 'as': 'recommended_skills'}},
                                {'$unwind': '$recommended_skills'},
                                {'$group': {'_id': None, 'recommended_skills': {'$addToSet': '$recommended_skills._id'}}},
                                {'$lookup': {'from': 'skills', 'localField': 'recommended_skills', 'foreignField': '_id', 'as': 'recommended_skills'}},
                                {'$unwind': '$recommended_skills'},
                                {'$lookup': {'from': 'courses', 'localField': 'recommended_skills.course_id', 'foreignField': '_id', 'as': 'related_courses'}},
                                {'$unwind': '$related_courses'},
                                {'$project': {'_id': '$recommended_skills._id', 'name': '$recommended_skills.name', 'course_id': '$related_courses._id', 'course': '$related_courses.title'}},
                                {'$group': {'_id': '$_id', 'name': {'$first': '$name'}, 'courses': {'$push': {'course_id': '$course_id', 'course': '$course'}}}}
                        ]

                        skill_gaps = list(USERS.aggregate(pipeline))
                        return Response(skill_gaps)
                return Response(status=status.HTTP_404_NOT_FOUND)