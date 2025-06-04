from django.db import models

class Advertisement(models.Model):
    PLACEMENT_CHOICES = [
        ('home-1', 'Home 1'),
        ('home-2', 'Home 2'),
        ('home-3', 'Home 3'),
        ('home-4', 'Home 4'),
        ('home-5', 'Home 5'),
        ('home-6', 'Home 6'),
        ('home-7', 'Home 7'),
        ('home-8', 'Home 8'),
        ('home-9', 'Home 9'),
        ('home-10', 'Home 10'),
        ('home-11', 'Home 11'),
        ('home-12', 'Home 12'),
    ]

    title = models.CharField(max_length=255)
    link = models.URLField()
    placement = models.CharField(max_length=20, choices=PLACEMENT_CHOICES)
    image_mobile = models.ImageField(upload_to='ads/mobile/')
    image_desktop = models.ImageField(upload_to='ads/desktop/')
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.placement})"
