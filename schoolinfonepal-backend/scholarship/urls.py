from django.urls import path
from .views import (
    ScholarshipListView,
    ScholarshipDetailView,
    create_scholarship,
    update_scholarship,
    delete_scholarship,
    scholarship_dropdown,
)

urlpatterns = [
    path('', ScholarshipListView.as_view(), name='scholarship-list'),                         # GET /api/scholarships/
    path('dropdown/', scholarship_dropdown, name='scholarship-dropdown'),                    # GET /api/scholarships/dropdown/
    path('create/', create_scholarship, name='scholarship-create'),                           # POST /api/scholarships/create/
    path('<slug:slug>/', ScholarshipDetailView.as_view(), name='scholarship-detail'),         # GET /api/scholarships/<slug>/
    path('<slug:slug>/update/', update_scholarship, name='scholarship-update'),               # PATCH /api/scholarships/<slug>/update/
    path('<slug:slug>/delete/', delete_scholarship, name='scholarship-delete'),               # DELETE /api/scholarships/<slug>/delete/
]
