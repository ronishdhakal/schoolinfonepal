from django.urls import path
from . import views

app_name = 'facilities'

urlpatterns = [
    # Public endpoints
    path('', views.FacilityListView.as_view(), name='facility-list'),
    path('dropdown/', views.FacilityDropdownView.as_view(), name='facility-dropdown'),
    path('<slug:slug>/', views.FacilityDetailView.as_view(), name='facility-detail'),
    
    # Admin endpoints (make sure these come BEFORE the slug pattern)
    path('create/', views.create_facility, name='facility-create'),
    path('<slug:slug>/update/', views.update_facility, name='facility-update'),
    path('<slug:slug>/delete/', views.delete_facility, name='facility-delete'),
]
