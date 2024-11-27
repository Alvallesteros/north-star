from django.db import models
from bson import ObjectId
# Create your models here.
class Course:
    def __init__(self, title, provider, description, link, topics, difficulty, skills, careers):
        _id = ObjectId()
        self.title = title
        self.provider = provider
        self.description = description
        self.link = link
        self.topics = topics
        self.difficulty = difficulty
        self.skill_id = skills
        self.career_id = careers