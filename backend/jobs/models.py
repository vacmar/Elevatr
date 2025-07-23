from django.db import models
from users.models import Student
from users.models import Recruiter

class JobPost(models.Model):
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, related_name='job_posts', null=True, blank=True )  # ✅ Add this line
    title = models.CharField(max_length=255)
    description = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Application(models.Model):
    PENDING  = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (ACCEPTED, "Accepted"),
        (REJECTED, "Rejected"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='applications')
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    cover_letter = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=PENDING,
    )

    class Meta:
        unique_together = ('student', 'job')

    def __str__(self):
        return f"{self.student.user.username} applied to {self.job.title}"
