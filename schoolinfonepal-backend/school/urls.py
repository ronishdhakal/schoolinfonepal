from django.urls import path
from .views import (
    SchoolListView,
    SchoolCreateView,
    SchoolDetailView,
    SchoolUpdateView,
    SchoolDeleteView,
    SchoolOwnDetailView,
    SchoolOwnUpdateView,
)

urlpatterns = [
    path('', SchoolListView.as_view(), name='school-list'),                               # /api/schools/
    path('create/', SchoolCreateView.as_view(), name='school-create'),                    # /api/schools/create/
    path('<slug:slug>/', SchoolDetailView.as_view(), name='school-detail'),               # /api/schools/<slug>/
    path('<slug:slug>/update/', SchoolUpdateView.as_view(), name='school-update'),        # /api/schools/<slug>/update/
    path('<slug:slug>/delete/', SchoolDeleteView.as_view(), name='school-delete'),        # /api/schools/<slug>/delete/
    # Dashboard endpoints for authenticated school user:
    path('me/', SchoolOwnDetailView.as_view(), name='school-own-detail'),                 # /api/schools/me/
    path('me/update/', SchoolOwnUpdateView.as_view(), name='school-own-update'),          # /api/schools/me/update/
]
