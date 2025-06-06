from django.db import models
from django.utils.text import slugify

class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ('online', 'Online'),
        ('physical', 'Physical'),
        ('hybrid', 'Hybrid'),
    ]
    REGISTRATION_TYPE_CHOICES = [
        ('free', 'Free'),
        ('paid', 'Paid'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, max_length=220)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)
    
    # Event Details
    event_date = models.DateField()
    event_end_date = models.DateField(blank=True, null=True)
    time = models.CharField(max_length=40, help_text="e.g. 10:00 AM - 5:00 PM")
    venue = models.CharField(max_length=250)
    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)
    seat_limit = models.PositiveIntegerField(blank=True, null=True)
    
    # Organizer Information
    organizer_school = models.ForeignKey('school.School', blank=True, null=True, on_delete=models.SET_NULL, related_name="events")
    organizer_university = models.ForeignKey('university.University', blank=True, null=True, on_delete=models.SET_NULL, related_name="events")
    organizer_custom = models.CharField(max_length=120, blank=True, help_text="If organizer is not a listed school/university")
    
    # Registration Details
    registration_type = models.CharField(max_length=10, choices=REGISTRATION_TYPE_CHOICES, default='free')
    registration_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    registration_link = models.URLField(blank=True, null=True)
    registration_deadline = models.DateField(blank=True, null=True)
    
    # Media
    featured_image = models.ImageField(upload_to='events/images/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='events/banners/', blank=True, null=True)
    
    # Meta Information
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(max_length=500, blank=True)
    meta_keywords = models.CharField(max_length=500, blank=True)
    
    # Status
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-event_date', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
