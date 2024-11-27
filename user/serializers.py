from rest_framework import serializers

class SkillSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=500)
    career_id = serializers.ListField(child=serializers.CharField())
    difficulty = serializers.CharField(max_length=50)
    course_id = serializers.ListField(child=serializers.CharField())

class ProfileSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    age = serializers.IntegerField()
    major = serializers.ListField(child=serializers.CharField())
    skill_id = serializers.ListField(child=serializers.CharField())
    fields = serializers.ListField(child=serializers.CharField())
    courses_taken = serializers.ListField(child=serializers.CharField())
    aspirations = serializers.CharField()

class RecommendationSerializer(serializers.Serializer):
    recommendations = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )

class UserSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    profile = ProfileSerializer()
    recommendation = serializers.DictField(read_only=True)