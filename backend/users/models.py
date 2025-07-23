from django.contrib.auth.models import User
from django.db import models

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True)
    description = models.TextField(blank=True)
    studied_at = models.CharField(max_length=255, blank=True)
    resume = models.URLField(blank=True, null=True)
    bookmarked_jobs = models.ManyToManyField('jobs.JobPost', blank=True)

    def __str__(self):
        return self.user.username


class Recruiter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, blank=True)
    company_name = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True)
    studied_at = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.company_name})"
