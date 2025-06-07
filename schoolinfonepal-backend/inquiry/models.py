from django.db import models
from django.utils import timezone

class Inquiry(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255, blank=True)
    message = models.TextField(blank=True)
    school = models.ForeignKey('school.School', on_delete=models.CASCADE, related_name='inquiries')
    course = models.ForeignKey('course.Course', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Contact status fields
    contacted = models.BooleanField(default=False)
    contacted_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.full_name} - {self.school.name}"

class PreRegistrationInquiry(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255, blank=True)
    level = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    school = models.ForeignKey('school.School', on_delete=models.CASCADE, related_name='pre_registrations')
    course = models.ForeignKey('course.Course', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Contact status fields
    contacted = models.BooleanField(default=False)
    contacted_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.full_name} - {self.school.name}"
