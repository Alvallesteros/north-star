from rest_framework import serializers

class CourseSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=100)
    provider = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=500)
    link = serializers.CharField(max_length=100)
    topics = serializers.ListField(child=serializers.CharField())
    difficulty = serializers.CharField(max_length=100)
    skill_id = serializers.ListField(child=serializers.CharField())
    career_id = serializers.ListField(child=serializers.CharField())