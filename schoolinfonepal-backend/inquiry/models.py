from django.db import models
from school.models import School
from course.models import Course

class Inquiry(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='inquiries', null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    full_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.school.name}"

class PreRegistrationInquiry(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='pre_registrations')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='pre_registrations')
    full_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255, blank=True)
    level = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.school.name} (Pre-registration)"