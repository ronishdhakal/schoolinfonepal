from django.db import models
from django.utils.text import slugify
from university.models import University
from level.models import Level
from discipline.models import Discipline

class Course(models.Model):
    name = models.CharField(max_length=200)
    abbreviation = models.CharField(max_length=50, blank=True)
    # ✅ FIXED: University is required, but we'll handle this properly in serializer
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='courses')
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True, related_name='courses')
    disciplines = models.ManyToManyField(Discipline, blank=True, related_name='courses')
    short_description = models.TextField(blank=True)
    long_description = models.TextField(blank=True)
    outcome = models.TextField(blank=True)
    eligibility = models.TextField(blank=True)
    curriculum = models.TextField(blank=True)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    og_image = models.ImageField(upload_to='course/og/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # ✅ FIXED: Only generate slug if university exists
            if self.university:
                self.slug = slugify(f"{self.name}-{self.university.name}")
            else:
                self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.university.name if self.university else 'No University'})"

class CourseAttachment(models.Model):
    course = models.ForeignKey(Course, related_name='attachments', on_delete=models.CASCADE)
    file = models.FileField(upload_to='course/attachments/')
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.course.name} Attachment"
