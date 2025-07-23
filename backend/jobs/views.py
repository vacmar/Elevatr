from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import JobPost, Application
from .serializers import JobPostSerializer, ApplicationSerializer
from .permissions import IsStudent, IsRecruiter

# ---------- JobPost list / create ----------
class JobPostViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostSerializer   # you'll define this
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """All users see all jobs."""
        return JobPost.objects.all().order_by("-posted_at")

    def perform_create(self, serializer):
        """Only recruiters may create."""
        if not hasattr(self.request.user, "recruiter"):
            raise PermissionDenied("Only recruiters can post jobs.")
        serializer.save(recruiter=self.request.user.recruiter)


# ---------- Application (student side) ----------
class StudentApplicationViewSet(viewsets.ModelViewSet):
    """
    /api/student/applications/
    list → student's own
    create → auto‑assign student
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsStudent]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        return Application.objects.filter(student=self.request.user.student)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student)


# ---------- Application (recruiter side) ----------
class RecruiterApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    /api/recruiter/applications/?job=<job_id>
    list → all apps to recruiter’s jobs
    partial_update → update status (accept/reject)
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsRecruiter]
    http_method_names = ["get", "patch", "head", "options"]
    lookup_field = "pk"

    def get_queryset(self):
        qs = Application.objects.filter(job__recruiter=self.request.user.recruiter)
        job_id = self.request.query_params.get("job")
        if job_id:
            qs = qs.filter(job_id=job_id)
        return qs.order_by("-applied_at")

    def partial_update(self, request, *args, **kwargs):
        """Recruiter can change status."""
        app = self.get_object()
        if "status" in request.data:
            app.status = request.data["status"]
            app.save()
            serializer = self.get_serializer(app)
            return Response(serializer.data)
        return Response({"detail": "status field required"}, status=400)
