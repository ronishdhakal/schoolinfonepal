from django.db import models
from django.utils.text import slugify
from university.models import University
from level.models import Level
from course.models import Course
from school.models import School

class InformationCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name = "Information Category"
        verbose_name_plural = "Information Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Information(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    category = models.ForeignKey(InformationCategory, on_delete=models.CASCADE, related_name='contents')
    published_date = models.DateField()
    featured_image = models.ImageField(upload_to='information/images/', blank=True, null=True)

    universities = models.ManyToManyField(University, blank=True, related_name='information_posts')
    levels = models.ManyToManyField(Level, blank=True, related_name='information_posts')
    courses = models.ManyToManyField(Course, blank=True, related_name='information_posts')
    schools = models.ManyToManyField(School, blank=True, related_name='information_posts')

    top_description = models.TextField(blank=True)
    below_description = models.TextField(blank=True)

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
