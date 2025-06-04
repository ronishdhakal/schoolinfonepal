from django.urls import path
from .views import (
    TypeListView,
    TypeCreateView,
    TypeDetailView,
    TypeUpdateView,
    TypeDeleteView,
)

urlpatterns = [
    path('', TypeListView.as_view(), name='type-list'),                          # /api/types/
    path('create/', TypeCreateView.as_view(), name='type-create'),               # /api/types/create/
    path('<slug:slug>/', TypeDetailView.as_view(), name='type-detail'),          # /api/types/<slug>/
    path('<slug:slug>/update/', TypeUpdateView.as_view(), name='type-update'),   # /api/types/<slug>/update/
    path('<slug:slug>/delete/', TypeDeleteView.as_view(), name='type-delete'),   # /api/types/<slug>/delete/
]
