from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'event_date', 'event_end_date',
        'organizer_school', 'organizer_university', 'organizer_custom',
        'event_type', 'registration_type', 'featured'
    )
    list_filter = ('event_type', 'registration_type', 'featured', 'event_date')
    search_fields = ('title', 'organizer_custom', 'venue')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-event_date', '-created_at')
