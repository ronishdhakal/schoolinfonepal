from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save, post_delete, post_save
from django.dispatch import receiver
from district.models import District
from level.models import Level
from type.models import Type
from facility.models import Facility
from university.models import University
from course.models import Course
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

class School(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=210, unique=True, blank=True)
    admin_email = models.EmailField(max_length=255, unique=True, blank=True, null=True)  # <-- Updated name
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
    map_link = models.URLField(max_length=10024, blank=True)
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

    def __str__(self):
        return self.name

    def assign_user(self, email, password="schooldashboard123"):
        """Create and assign a user to this school (not used for auto-creation)"""
        if not self.user:
            base_username = slugify(self.name) or f"school_{self.id}"
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}-{counter}"
                counter += 1

            user = User(
                username=username,
                email=email,
                first_name=self.name,
                role="school"
            )
            user.set_password(password)
            user.save()
            self.user = user
            self.save(update_fields=["user"])
            return user
        return self.user

    def get_primary_email(self):
        """Get the first email from school emails"""
        first_email = self.emails.first()
        return first_email.email if first_email else None

@receiver(pre_save, sender=School)
def create_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.name)
        slug = base_slug
        counter = 1
        while School.objects.filter(slug=slug).exclude(id=instance.id).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug

@receiver(post_save, sender=School)
def create_user_for_school(sender, instance, created, **kwargs):
    if created and not instance.user and instance.admin_email:
        base_username = slugify(instance.name) or f"school_{instance.id}"
        username = base_username
        counter = 1
        User = get_user_model()
        while User.objects.filter(username=username).exists():
            username = f"{base_username}-{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=instance.admin_email,
            first_name=instance.name,  # or full_name if that's your User field
            role='school',
            password='schooldashboard123'  # Default password
        )
        instance.user = user
        instance.save(update_fields=["user"])

@receiver(post_delete, sender=School)
def delete_user_on_school_delete(sender, instance, **kwargs):
    if instance.user:
        instance.user.delete()

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
