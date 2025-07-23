from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationListCreateView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
