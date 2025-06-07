from django.contrib import admin
from django.urls import path, include
from django.conf import settings               # <-- Add this
from django.conf.urls.static import static     # <-- And this
from district.views import district_dropdown

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/districts/dropdown/', district_dropdown),
    path('api/facilities/', include('facility.urls')),
    path('api/districts/', include('district.urls')),
    path('api/types/', include('type.urls')),
    path('api/levels/', include('level.urls')),
    path('api/universities/', include('university.urls')),
    path('api/disciplines/', include('discipline.urls')),
    path('api/courses/', include('course.urls')),
    path('api/schools/', include('school.urls')),
    path('api/events/', include('event.urls')),
    path('api/admissions/', include('admission.urls')),
    path('api/information/', include('information.urls')),
    path('api/scholarships/', include('scholarship.urls')),
    path('api/ads/', include('advertisement.urls')),
    path('api/inquiries/', include('inquiry.urls')),
    path('api/core/', include('core.urls')),
]

# ✅ This will serve media files in development (never in production)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
