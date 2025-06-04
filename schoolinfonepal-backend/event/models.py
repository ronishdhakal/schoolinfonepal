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
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, max_length=220)
    event_date = models.DateField()
    event_end_date = models.DateField(blank=True, null=True)  # For range
    time = models.CharField(max_length=40, help_text="e.g. 10:00 AM - 5:00 PM")
    organizer_school = models.ForeignKey('school.School', blank=True, null=True, on_delete=models.SET_NULL, related_name="events")
    organizer_university = models.ForeignKey('university.University', blank=True, null=True, on_delete=models.SET_NULL, related_name="events")
    organizer_custom = models.CharField(max_length=120, blank=True, help_text="If organizer is not a listed school/university")
    venue = models.CharField(max_length=250)
    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)
    seat_limit = models.PositiveIntegerField(blank=True, null=True)
    registration_type = models.CharField(max_length=10, choices=REGISTRATION_TYPE_CHOICES, default='free')
    registration_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    registration_link = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False)
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
