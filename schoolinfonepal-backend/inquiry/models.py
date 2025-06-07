from django.db import models

# Create your models here.
from django.db import models
from school.models import School
from course.models import Course

class Inquiry(models.Model):
    school = models.ForeignKey(School, null=True, blank=True, on_delete=models.SET_NULL, related_name="inquiries")
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.SET_NULL, related_name="inquiries")
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry by {self.full_name} ({self.phone})"

class PreRegistrationInquiry(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="pre_registrations")
    student_full_name = models.CharField(max_length=100)
    parent_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    grade_or_class = models.CharField(max_length=30)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pre-Registration: {self.student_full_name} ({self.phone})"
