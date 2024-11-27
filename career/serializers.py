from rest_framework import serializers

class MajorSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=500)
    related_careers = serializers.ListField(child=serializers.CharField())

class CareerSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=500)
    skill_id = serializers.ListField(child=serializers.CharField())
    qualifications = serializers.ListField(child=serializers.CharField())
    field = serializers.CharField(max_length=100)
    salary = serializers.IntegerField()
    course_id = serializers.ListField(child=serializers.CharField())