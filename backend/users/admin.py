from django.contrib import admin
from .models import Student, Recruiter

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user',)

@admin.register(Recruiter)
class RecruiterAdmin(admin.ModelAdmin):
    list_display = ('user',)
