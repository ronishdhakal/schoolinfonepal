from django.contrib import admin
from .models import Scholarship

@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'published_date', 'active_from', 'active_until',
        'organizer_school', 'organizer_university', 'organizer_custom',
        'level', 'university', 'featured',
    )
    list_filter = (
        'published_date', 'active_from', 'active_until',
        'level', 'university', 'featured',
    )
    search_fields = ('title', 'organizer_custom')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('courses',)
    ordering = ('-published_date', '-created_at')
