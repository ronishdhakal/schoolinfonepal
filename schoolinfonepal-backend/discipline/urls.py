from django.urls import path
from .views import (
    DisciplineListView,
    DisciplineDetailView,
    create_discipline,
    update_discipline,
    delete_discipline,
)

urlpatterns = [
    path('', DisciplineListView.as_view(), name='discipline-list'),                         # /api/disciplines/
    path('create/', create_discipline, name='discipline-create'),                           # /api/disciplines/create/
    path('<slug:slug>/', DisciplineDetailView.as_view(), name='discipline-detail'),         # /api/disciplines/<slug>/
    path('<slug:slug>/update/', update_discipline, name='discipline-update'),               # /api/disciplines/<slug>/update/
    path('<slug:slug>/delete/', delete_discipline, name='discipline-delete'),               # /api/disciplines/<slug>/delete/
]
