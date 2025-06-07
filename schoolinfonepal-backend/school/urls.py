from django.urls import path
from .views import (
    SchoolListView,
    SchoolDetailView,
    create_school,
    update_school,
    delete_school,
    SchoolOwnDetailView,
    school_own_update,
    school_inquiries,
    school_dropdown,
)

urlpatterns = [
    path('', SchoolListView.as_view(), name='school-list'),                         # /api/schools/
    path('create/', create_school, name='school-create'),                           # /api/schools/create/
    path("dropdown/", school_dropdown),

    path('<slug:slug>/', SchoolDetailView.as_view(), name='school-detail'),         # /api/schools/<slug>/
    path('<slug:slug>/update/', update_school, name='school-update'),               # /api/schools/<slug>/update/
    path('<slug:slug>/delete/', delete_school, name='school-delete'),               # /api/schools/<slug>/delete/
    
    # Dashboard-only views for schools
    path('me/', SchoolOwnDetailView.as_view(), name='school-own-detail'),           # /api/schools/me/
    path('me/update/', school_own_update, name='school-own-update'),                # /api/schools/me/update/
    path('me/inquiries/', school_inquiries, name='school-inquiries'),               # /api/schools/me/inquiries/
]
