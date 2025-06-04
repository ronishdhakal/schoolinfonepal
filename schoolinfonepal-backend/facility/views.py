from rest_framework import generics, permissions, viewsets
from .models import Facility
from .serializers import FacilitySerializer

# List all facilities (for public or admin as you decide)
class FacilityListView(generics.ListAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [permissions.IsAuthenticated]  # You can make it AllowAny for public

# Create new facility (admin only)
class FacilityCreateView(generics.CreateAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [permissions.IsAdminUser]

# Retrieve a facility by slug (for detail view/edit in frontend)
class FacilityDetailView(generics.RetrieveAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [permissions.IsAuthenticated]  # or AllowAny if public
    lookup_field = 'slug'

# Update a facility (admin only, by slug)
class FacilityUpdateView(generics.UpdateAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

# Delete a facility (admin only, by slug)
class FacilityDeleteView(generics.DestroyAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'
