from django.urls import path
from .views import (
    DisciplineListView,
    DisciplineCreateView,
    DisciplineDetailView,
    DisciplineUpdateView,
    DisciplineDeleteView,
)

urlpatterns = [
    path('', DisciplineListView.as_view(), name='discipline-list'),                         # /api/disciplines/
    path('create/', DisciplineCreateView.as_view(), name='discipline-create'),              # /api/disciplines/create/
    path('<slug:slug>/', DisciplineDetailView.as_view(), name='discipline-detail'),         # /api/disciplines/<slug>/
    path('<slug:slug>/update/', DisciplineUpdateView.as_view(), name='discipline-update'),  # /api/disciplines/<slug>/update/
    path('<slug:slug>/delete/', DisciplineDeleteView.as_view(), name='discipline-delete'),  # /api/disciplines/<slug>/delete/
]
