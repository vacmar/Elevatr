from rest_framework.permissions import BasePermission

class IsRecruiter(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "recruiter")

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, "student")
