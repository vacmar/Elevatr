from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Student, Recruiter


class RegisterSerializer(serializers.Serializer):
    ROLE_CHOICES = (("student", "Student"), ("recruiter", "Recruiter"))

    username      = serializers.CharField(max_length=150)
    email         = serializers.EmailField()
    password      = serializers.CharField(write_only=True, min_length=6)
    role          = serializers.ChoiceField(choices=ROLE_CHOICES, write_only=True)
    first_name    = serializers.CharField(max_length=30)
    last_name     = serializers.CharField(max_length=30)
    phone_number  = serializers.CharField(max_length=15)
    company_name  = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def validate_phone_number(self, value):
        if not value.isdigit() or len(value) not in [10, 11, 12]:
            raise serializers.ValidationError("Enter a valid phone number.")
        return value

    def create(self, validated):
        role         = validated.pop("role")
        company_name = validated.pop("company_name", "")
        password     = validated.pop("password")
        phone_number = validated.pop("phone_number")

        # Extract and create user
        user = User.objects.create_user(password=password, **validated)

        if role == "student":
            Student.objects.create(user=user, phone_number=phone_number)
        else:
            Recruiter.objects.create(user=user, company_name=company_name, phone_number=phone_number)

        return user

    def to_representation(self, instance):
        return {
            "id":       instance.id,
            "username": instance.username,
            "email":    instance.email,
        }

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class StudentProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    name     = serializers.CharField(source="user.get_full_name", read_only=True)
    email    = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Student
        fields = ["id", "username", "name", "email", "phone_number", "description", "studied_at"]

class RecruiterProfileSerializer(serializers.ModelSerializer):
    # pull basic auth‑user info
    username = serializers.CharField(source="user.username", read_only=True)
    name     = serializers.CharField(source="user.get_full_name", read_only=True)
    email    = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model  = Recruiter
        fields = [
            "id",
            "username",
            "name",
            "email",
            "company_name",
            "website",
            "phone_number",
            "description",
            "studied_at",
        ]
