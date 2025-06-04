from django.urls import path
from .views import (
    DistrictListView,
    DistrictDetailView,
    create_district,
    update_district,
    delete_district,
)

urlpatterns = [
    path('', DistrictListView.as_view(), name='district-list'),
    path('create/', create_district, name='district-create'),
    path('<slug:slug>/', DistrictDetailView.as_view(), name='district-detail'),
    path('<slug:slug>/update/', update_district, name='district-update'),
    path('<slug:slug>/delete/', delete_district, name='district-delete'),
]
