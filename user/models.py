from django.db import models
from bson import ObjectId

class Skill:
    def __init__(self, name, description, careers, difficulty, courses):
        self._id = ObjectId()
        self.name = name
        self.description = description
        self.career_id = careers
        self.difficulty = difficulty
        self.course_id = courses

class User:
    def __init__(self, username, email, profile, recommendation):
        self._id = ObjectId()
        self.username = username
        self.email = email
        self.profile = profile
        self.recommendation = recommendation

#Embedded document to User
class Profile:
    def __init__(self, name, age, major, skills, fields, aspirations):
        self.name = name
        self.age = age
        self.major = major
        self.skill_id = skills
        self.fields = fields
        self.aspirations = aspirations

#Embedded document to User
class Recommendation:
    def __init__(self, career_id, status):
        self.career_id = career_id
        self.status = status
