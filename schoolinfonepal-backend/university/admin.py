from django.contrib import admin
from .models import University, UniversityPhone, UniversityEmail, UniversityGallery

class UniversityPhoneInline(admin.TabularInline):
    model = UniversityPhone
    extra = 1

class UniversityEmailInline(admin.TabularInline):
    model = UniversityEmail
    extra = 1

class UniversityGalleryInline(admin.TabularInline):
    model = UniversityGallery
    extra = 1

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'type', 'established_date', 'priority', 'is_verified', 'status')
    search_fields = ('name', 'slug', 'address', 'meta_title')
    list_filter = ('type', 'is_verified', 'status')
    prepopulated_fields = {"slug": ("name",)}
    inlines = [UniversityPhoneInline, UniversityEmailInline, UniversityGalleryInline]

@admin.register(UniversityPhone)
class UniversityPhoneAdmin(admin.ModelAdmin):
    list_display = ('university', 'phone')
    search_fields = ('university__name', 'phone')

@admin.register(UniversityEmail)
class UniversityEmailAdmin(admin.ModelAdmin):
    list_display = ('university', 'email')
    search_fields = ('university__name', 'email')

@admin.register(UniversityGallery)
class UniversityGalleryAdmin(admin.ModelAdmin):
    list_display = ('university', 'image', 'caption')
    search_fields = ('university__name', 'caption')
