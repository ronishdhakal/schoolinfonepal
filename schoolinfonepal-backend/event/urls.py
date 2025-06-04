from django.urls import path
from .views import (
    EventListView, EventDetailView,
    EventCreateView, EventUpdateView, EventDeleteView,
)

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),                  # GET /api/events/
    path('create/', EventCreateView.as_view(), name='event-create'),       # POST /api/events/create/
    path('<slug:slug>/', EventDetailView.as_view(), name='event-detail'),  # GET /api/events/<slug>/
    path('<slug:slug>/update/', EventUpdateView.as_view(), name='event-update'),   # PUT/PATCH /api/events/<slug>/update/
    path('<slug:slug>/delete/', EventDeleteView.as_view(), name='event-delete'),   # DELETE /api/events/<slug>/delete/
]
