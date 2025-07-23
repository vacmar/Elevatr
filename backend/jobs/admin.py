from django.contrib import admin
from django.utils.html import format_html
from .models import JobPost, Application

@admin.register(JobPost)
class JobPostAdmin(admin.ModelAdmin):
    list_display = ("id", "recruiter_username", "title", "posted_at")
    list_filter  = ("recruiter",)
    search_fields = ("title", "recruiter__user__username")

    def recruiter_username(self, obj):
        return obj.recruiter.user.username if obj.recruiter else "-"
    recruiter_username.short_description = "Recruiter"


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    # ←–– put the lines here
    list_display = ("student_username", "job_title", "status", "applied_at", "resume_link")
    list_filter  = ("status", "job")
    search_fields = ("student__user__username", "job__title")

    def student_username(self, obj):
        return obj.student.user.username
    student_username.short_description = "Student"

    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = "Job"

    def resume_link(self, obj):
        if obj.resume:
            return format_html("<a href='{}' target='_blank'>Download</a>", obj.resume.url)
        return "-"
    resume_link.short_description = "Resume"
