from django.urls import path
from .views import (
    FacilityListView,
    FacilityDetailView,
    create_facility,
    update_facility,
    delete_facility,
)

urlpatterns = [
    path('', FacilityListView.as_view(), name='facility-list'),
    path('<slug:slug>/', FacilityDetailView.as_view(), name='facility-detail'),
    path('create/', create_facility, name='facility-create'),
    path('<slug:slug>/update/', update_facility, name='facility-update'),
    path('<slug:slug>/delete/', delete_facility, name='facility-delete'),
]
