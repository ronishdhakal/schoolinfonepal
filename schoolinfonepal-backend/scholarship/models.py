from django.db import models
from django.utils.text import slugify
from school.models import School
from university.models import University
from course.models import Course
from level.models import Level

class Scholarship(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    published_date = models.DateField()

    active_from = models.DateField()
    active_until = models.DateField()

    organizer_school = models.ForeignKey(
        School, on_delete=models.SET_NULL, null=True, blank=True, related_name='scholarships'
    )
    organizer_university = models.ForeignKey(
        University, on_delete=models.SET_NULL, null=True, blank=True, related_name='scholarships'
    )
    organizer_custom = models.CharField(
        max_length=255, blank=True, help_text="Use this if organizer is not a school/university"
    )

    courses = models.ManyToManyField(Course, blank=True, related_name='scholarships')
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True)
    university = models.ForeignKey(University, on_delete=models.SET_NULL, null=True, blank=True, related_name='linked_scholarships')

    # About section
    description = models.TextField(blank=True, help_text="Detailed description about the scholarship")
    attachment = models.FileField(upload_to='scholarships/attachments/', blank=True, null=True, help_text="Scholarship brochure or related documents")

    featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
