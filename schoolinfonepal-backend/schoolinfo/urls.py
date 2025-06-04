from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')), 
    path('api/facilities/', include('facility.urls')),     # facility endpoints
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
    path('api/core/', include('core.urls')),











]
