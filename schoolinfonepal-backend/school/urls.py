from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('', views.SchoolListView.as_view(), name='school-list'),
    path('dropdown/', views.school_dropdown, name='school-dropdown'),
    
    # School dashboard endpoints
    path('me/', views.school_own_detail, name='school-own-detail'),
    path('me/update/', views.school_own_update, name='school-own-update'),
    path('me/inquiries/', views.school_inquiries, name='school-inquiries'),
    path('me/inquiries/<int:inquiry_id>/contact-status/', views.update_inquiry_contact_status, name='update-inquiry-contact-status'),
    path('me/inquiries/analytics/', views.school_inquiries_analytics, name='school-inquiries-analytics'),
    path('me/inquiries/export/', views.export_school_inquiries, name='school-inquiries-export'),
    
    # Admin endpoints
    path('create/', views.create_school, name='create-school'),
    path('<slug:slug>/update/', views.update_school, name='update-school'),
    path('<slug:slug>/delete/', views.delete_school, name='delete-school'),
    path('<slug:slug>/', views.SchoolDetailView.as_view(), name='school-detail'),
]
