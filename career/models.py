from django.db import models
from bson import ObjectId

# Create your models here.
class Major:
    def __init__(self, title, description, related_careers):
        _id = ObjectId()
        self.title = title
        self.description = description
        self.related_careers = related_careers

class Career:
    def __init__(self, title, description, skills, qualifications, fields, salary, courses):
        _id = ObjectId()
        self.title = title
        self.description = description
        self.skill_id = skills
        self.qualifications = qualifications
        self.fields = fields
        self.salary = salary
        self.course_id = courses
