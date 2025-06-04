from django.db import models
from django.utils.text import slugify
from school.models import School
from course.models import Course
from level.models import Level
from university.models import University

class Admission(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    published_date = models.DateField()
    active_from = models.DateField()
    active_until = models.DateField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='admissions')
    courses = models.ManyToManyField(Course, blank=True, related_name='admissions')
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True)
    university = models.ForeignKey(University, on_delete=models.SET_NULL, null=True, blank=True)
    featured = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
