from django.urls import path
from .views import (
    LevelListView,
    LevelDetailView,
    create_level,
    update_level,
    delete_level,
)

urlpatterns = [
    path('', LevelListView.as_view(), name='level-list'),
    path('create/', create_level, name='level-create'),
    path('<slug:slug>/', LevelDetailView.as_view(), name='level-detail'),
    path('<slug:slug>/update/', update_level, name='level-update'),
    path('<slug:slug>/delete/', delete_level, name='level-delete'),
]
