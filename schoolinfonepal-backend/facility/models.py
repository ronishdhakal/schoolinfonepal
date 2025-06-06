from django.db import models
from django.utils.text import slugify
from django.utils import timezone

class Facility(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=210, unique=True, blank=True)
    icon = models.ImageField(upload_to='facility/icons/', blank=True, null=True)
    description = models.TextField(blank=True)
    
    # Meta Information Fields
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Facilities"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Facility.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
