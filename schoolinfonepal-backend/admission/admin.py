from django.contrib import admin
from .models import Admission

@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'school', 'level', 'university',
        'published_date', 'active_from', 'active_until', 'featured'
    )
    list_filter = (
        'published_date', 'active_from', 'active_until', 'featured', 'school', 'university', 'level'
    )
    search_fields = ('title', 'school__name', 'university__name', 'description')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-published_date', '-created_at')
    filter_horizontal = ('courses',)
