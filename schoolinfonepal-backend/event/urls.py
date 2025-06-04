from django.urls import path
from .views import (
    EventListView,
    EventDetailView,
    create_event,
    update_event,
    delete_event,
)

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),                         # GET /api/events/
    path('create/', create_event, name='event-create'),                           # POST /api/events/create/
    path('<slug:slug>/', EventDetailView.as_view(), name='event-detail'),         # GET /api/events/<slug>/
    path('<slug:slug>/update/', update_event, name='event-update'),              # PATCH /api/events/<slug>/update/
    path('<slug:slug>/delete/', delete_event, name='event-delete'),              # DELETE /api/events/<slug>/delete/
]
