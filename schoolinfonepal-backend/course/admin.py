from django.contrib import admin
from .models import Course, CourseAttachment

class CourseAttachmentInline(admin.TabularInline):
    model = CourseAttachment
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'abbreviation', 'slug', 'university', 'level', 'created_at', 'updated_at'
    )
    search_fields = ('name', 'abbreviation', 'slug', 'university__name')
    list_filter = ('university', 'level', 'disciplines')
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CourseAttachmentInline]
    filter_horizontal = ('disciplines',)

@admin.register(CourseAttachment)
class CourseAttachmentAdmin(admin.ModelAdmin):
    list_display = ('course', 'file', 'description')
    search_fields = ('course__name', 'description')
