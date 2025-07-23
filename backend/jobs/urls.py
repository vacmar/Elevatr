from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobPostViewSet, StudentApplicationViewSet, RecruiterApplicationViewSet

router = DefaultRouter()
router.register(r'posts', JobPostViewSet, basename='jobpost')
router.register(r'student/applications', StudentApplicationViewSet, basename='student-applications')
router.register(r'recruiter/applications', RecruiterApplicationViewSet, basename='recruiter-applications')

urlpatterns = [
    path('', include(router.urls)),
]
