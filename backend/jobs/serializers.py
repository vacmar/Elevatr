from rest_framework.serializers import ModelSerializer
from .models import JobPost, Application
from users.serializers import StudentProfileSerializer  # create this if not exists
from . import serializers

class JobPostSerializer(ModelSerializer):
    class Meta:
        model  = JobPost
        fields = "__all__"

class ApplicationSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'