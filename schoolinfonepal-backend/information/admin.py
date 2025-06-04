from django.contrib import admin
from .models import Information, InformationCategory

@admin.register(InformationCategory)
class InformationCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Information)
class InformationAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'category', 'published_date', 'featured',
    )
    list_filter = (
        'category', 'published_date', 'featured',
    )
    search_fields = ('title', 'top_description', 'below_description')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('universities', 'levels', 'courses', 'schools')  # ✅ fixed
    ordering = ('-published_date', '-created_at')
