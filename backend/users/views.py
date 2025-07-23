from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserProfileSerializer
from django.contrib.auth.models import User

from .models import Recruiter, Student
from .serializers import RecruiterProfileSerializer, StudentProfileSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class   = RegisterSerializer

class MeView(generics.RetrieveAPIView):
    serializer_class   = UserProfileSerializer

    def get_object(self):
        return self.request.user

class MeView(generics.RetrieveAPIView):
    """
    GET /api/auth/me/
    Returns either Recruiter or Student profile for the
    currently authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        return user.recruiter if hasattr(user, "recruiter") else user.student

    def get_serializer_class(self):
        return (
            RecruiterProfileSerializer
            if hasattr(self.request.user, "recruiter")
            else StudentProfileSerializer
        )