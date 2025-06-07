from django.contrib import admin
from .models import (
    School, SchoolPhone, SchoolEmail, SchoolGallery, SchoolBrochure,
    SchoolSocialMedia, SchoolFAQ, SchoolMessage, SchoolCourse
)

class SchoolPhoneInline(admin.TabularInline):
    model = SchoolPhone
    extra = 1

class SchoolEmailInline(admin.TabularInline):
    model = SchoolEmail
    extra = 1

class SchoolGalleryInline(admin.TabularInline):
    model = SchoolGallery
    extra = 1

class SchoolBrochureInline(admin.TabularInline):
    model = SchoolBrochure
    extra = 1

class SchoolSocialMediaInline(admin.TabularInline):
    model = SchoolSocialMedia
    extra = 1

class SchoolFAQInline(admin.TabularInline):
    model = SchoolFAQ
    extra = 1

class SchoolMessageInline(admin.TabularInline):
    model = SchoolMessage
    extra = 1

class SchoolCourseInline(admin.TabularInline):
    model = SchoolCourse
    extra = 1

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'slug', 'admin_email', 'verification', 'featured', 'district',
        'level', 'type', 'priority'
    )
    search_fields = ('name', 'slug', 'address', 'admin_email')
    list_filter = ('verification', 'featured', 'district', 'level', 'type')
    prepopulated_fields = {"slug": ("name",)}
    inlines = [
        SchoolPhoneInline, SchoolEmailInline, SchoolGalleryInline, SchoolBrochureInline,
        SchoolSocialMediaInline, SchoolFAQInline, SchoolMessageInline, SchoolCourseInline,
    ]
    filter_horizontal = ('facilities', 'universities')
    readonly_fields = ('user',)  # user is auto-created

@admin.register(SchoolPhone)
class SchoolPhoneAdmin(admin.ModelAdmin):
    list_display = ('school', 'phone')
    search_fields = ('school__name', 'phone')

@admin.register(SchoolEmail)
class SchoolEmailAdmin(admin.ModelAdmin):
    list_display = ('school', 'email')
    search_fields = ('school__name', 'email')

@admin.register(SchoolGallery)
class SchoolGalleryAdmin(admin.ModelAdmin):
    list_display = ('school', 'image', 'caption')
    search_fields = ('school__name', 'caption')

@admin.register(SchoolBrochure)
class SchoolBrochureAdmin(admin.ModelAdmin):
    list_display = ('school', 'file', 'description')
    search_fields = ('school__name', 'description')

@admin.register(SchoolSocialMedia)
class SchoolSocialMediaAdmin(admin.ModelAdmin):
    list_display = ('school', 'platform', 'url')
    search_fields = ('school__name', 'platform')

@admin.register(SchoolFAQ)
class SchoolFAQAdmin(admin.ModelAdmin):
    list_display = ('school', 'question')
    search_fields = ('school__name', 'question')

@admin.register(SchoolMessage)
class SchoolMessageAdmin(admin.ModelAdmin):
    list_display = ('school', 'title', 'name', 'designation')
    search_fields = ('school__name', 'title', 'name', 'designation')

@admin.register(SchoolCourse)
class SchoolCourseAdmin(admin.ModelAdmin):
    list_display = ('school', 'course', 'fee', 'status', 'admin_open')
    search_fields = ('school__name', 'course__name', 'status')
    list_filter = ('admin_open',)
