from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404

from .models import Event
from .serializers import EventSerializer
from core.filters import EventFilter
from core.pagination import StandardResultsSetPagination  # <--- make sure this is imported


# ✅ Public List
class EventListView(ListAPIView):
    queryset = Event.objects.all().order_by('-event_date', '-created_at')
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = EventFilter
    search_fields = [
        'title', 'venue', 'organizer_custom',
        'organizer_school__name', 'organizer_university__name'
    ]
    pagination_class = StandardResultsSetPagination  # <--- ADD THIS LINE

# ✅ Public Detail
class EventDetailView(RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin: Create Event
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_event(request):
    data = request.data.dict()
    serializer = EventSerializer(data=data)
    if serializer.is_valid():
        event = serializer.save()
        return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Event
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_event(request, slug):
    event = get_object_or_404(Event, slug=slug)
    data = request.data.dict()
    serializer = EventSerializer(event, data=data, partial=True)
    if serializer.is_valid():
        event = serializer.save()
        return Response(EventSerializer(event).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete Event
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_event(request, slug):
    event = get_object_or_404(Event, slug=slug)
    event.delete()
    return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
