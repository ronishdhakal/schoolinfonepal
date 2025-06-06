from django.db import models
from django.utils.text import slugify
from django.core.validators import RegexValidator
from django.utils import timezone


class InformationCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    color = models.CharField(
        max_length=7,
        default='#3B82F6',
        validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$', 'Enter a valid hex color code')]
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)    
    updated_at = models.DateTimeField(auto_now=True)

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
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.ForeignKey(InformationCategory, on_delete=models.CASCADE, related_name='information_set')
    published_date = models.DateField()
    summary = models.CharField(max_length=500, blank=True, help_text="Brief summary for listings")
    
    # Content sections
    top_description = models.TextField(blank=True)
    content = models.TextField(blank=True, help_text="Main content body")
    below_description = models.TextField(blank=True)
    
    # Media
    featured_image = models.ImageField(upload_to='information/featured/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='information/banners/', blank=True, null=True)
    
    # SEO Meta
    meta_title = models.CharField(max_length=60, blank=True, help_text="SEO title (max 60 chars)")
    meta_description = models.CharField(max_length=160, blank=True, help_text="SEO description (max 160 chars)")
    meta_keywords = models.CharField(max_length=255, blank=True, help_text="SEO keywords, comma separated")
    
    # Status
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Relationships
    universities = models.ManyToManyField('university.University', blank=True, related_name='information')
    levels = models.ManyToManyField('level.Level', blank=True, related_name='information')
    courses = models.ManyToManyField('course.Course', blank=True, related_name='information')
    schools = models.ManyToManyField('school.School', blank=True, related_name='information')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']
        verbose_name = "Information"
        verbose_name_plural = "Information"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Auto-generate meta fields if not provided
        if not self.meta_title:
            self.meta_title = self.title[:60]
        if not self.meta_description and self.summary:
            self.meta_description = self.summary[:160]
            
        super().save(*args, **kwargs)
