from django.urls import path
from .views import (
    LevelListView,
    LevelCreateView,
    LevelDetailView,
    LevelUpdateView,
    LevelDeleteView,
)

urlpatterns = [
    path('', LevelListView.as_view(), name='level-list'),                          # /api/levels/
    path('create/', LevelCreateView.as_view(), name='level-create'),               # /api/levels/create/
    path('<slug:slug>/', LevelDetailView.as_view(), name='level-detail'),          # /api/levels/<slug>/
    path('<slug:slug>/update/', LevelUpdateView.as_view(), name='level-update'),   # /api/levels/<slug>/update/
    path('<slug:slug>/delete/', LevelDeleteView.as_view(), name='level-delete'),   # /api/levels/<slug>/delete/
]
