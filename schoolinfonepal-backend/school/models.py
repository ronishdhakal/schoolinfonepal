from django.db import models
from django.utils.text import slugify
from district.models import District
from level.models import Level
from type.models import Type
from facility.models import Facility
from university.models import University
from course.models import Course
from authentication.models import User
from django.utils import timezone

class School(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='school'
    )
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=210, unique=True, blank=True)
    logo = models.ImageField(upload_to='school/logos/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='school/covers/', blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)
    established_date = models.DateField(blank=True, null=True)
    verification = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True)
    level_text = models.CharField(max_length=150, blank=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True, blank=True)
    facilities = models.ManyToManyField(Facility, blank=True, related_name='schools')
    universities = models.ManyToManyField(University, blank=True, related_name='schools')
    website = models.URLField(blank=True, null=True)
    priority = models.PositiveIntegerField(default=999)
    map_link = models.URLField(max_length=1024, blank=True)
    salient_feature = models.TextField(blank=True)
    scholarship = models.TextField(blank=True)
    about_college = models.TextField(blank=True)
    
    # Added Meta Information Fields
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    og_image = models.ImageField(upload_to='school/og/', blank=True, null=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class SchoolPhone(models.Model):
    school = models.ForeignKey(School, related_name='phones', on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.school.name} - {self.phone}"

class SchoolEmail(models.Model):
    school = models.ForeignKey(School, related_name='emails', on_delete=models.CASCADE)
    email = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.school.name} - {self.email}"

class SchoolGallery(models.Model):
    school = models.ForeignKey(School, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='school/gallery/', blank=True, null=True)
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.school.name} Gallery"

class SchoolBrochure(models.Model):
    school = models.ForeignKey(School, related_name='brochures', on_delete=models.CASCADE)
    file = models.FileField(upload_to='school/brochures/', blank=True, null=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.school.name} Brochure"

class SchoolSocialMedia(models.Model):
    school = models.ForeignKey(School, related_name='social_media', on_delete=models.CASCADE)
    platform = models.CharField(max_length=50, blank=True)
    url = models.URLField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.school.name} {self.platform}"

class SchoolFAQ(models.Model):
    school = models.ForeignKey(School, related_name='faqs', on_delete=models.CASCADE)
    question = models.CharField(max_length=255, blank=True)
    answer = models.TextField(blank=True)

    def __str__(self):
        return f"{self.school.name} FAQ"

class SchoolMessage(models.Model):
    school = models.ForeignKey(School, related_name='messages', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='school/messages/', blank=True, null=True)
    title = models.CharField(max_length=200, blank=True)
    message = models.TextField(blank=True)
    name = models.CharField(max_length=100, blank=True)
    designation = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.school.name} - {self.title}"

class SchoolCourse(models.Model):
    school = models.ForeignKey(School, related_name='school_courses', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='school_courses', on_delete=models.CASCADE)
    fee = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True)  # e.g. "Open", "Closed"
    admin_open = models.BooleanField(default=True)

    class Meta:
        unique_together = ('school', 'course')

    def __str__(self):
        return f"{self.school.name} - {self.course.name}"

# ManyToMany through above for courses
School.courses = models.ManyToManyField(
    Course,
    through=SchoolCourse,
    related_name='schools',
    blank=True
)
