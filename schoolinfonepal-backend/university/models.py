from django.db import models
from django.utils.text import slugify
from type.models import Type

class University(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=210, unique=True, blank=True)
    address = models.CharField(max_length=255, blank=True)
    cover_photo = models.ImageField(upload_to='university/covers/', blank=True, null=True)
    logo = models.ImageField(upload_to='university/logos/', blank=True, null=True)
    established_date = models.DateField(blank=True, null=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True, blank=True, related_name='universities')
    website = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True)
    salient_features = models.TextField(blank=True)
    about = models.TextField(blank=True)
    priority = models.PositiveIntegerField(default=999)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    og_image = models.ImageField(upload_to='university/og/', blank=True, null=True)
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    foreign_affiliated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=True)

    class Meta:
        ordering = ['priority', 'name']
        verbose_name = 'University'
        verbose_name_plural = 'Universities'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def verification(self):
        """Alias for is_verified to match frontend expectations"""
        return self.is_verified

class UniversityPhone(models.Model):
    university = models.ForeignKey(University, related_name='phones', on_delete=models.CASCADE)
    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.university.name} - {self.phone}"

class UniversityEmail(models.Model):
    university = models.ForeignKey(University, related_name='emails', on_delete=models.CASCADE)
    email = models.EmailField()

    def __str__(self):
        return f"{self.university.name} - {self.email}"

class UniversityGallery(models.Model):
    university = models.ForeignKey(University, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='university/gallery/')
    caption = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = 'University Gallery'
        verbose_name_plural = 'University Galleries'

    def __str__(self):
        return f"{self.university.name} Gallery"