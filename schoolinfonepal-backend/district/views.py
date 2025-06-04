from rest_framework import generics, permissions
from .models import District
from .serializers import DistrictSerializer

class DistrictListView(generics.ListAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer

class DistrictCreateView(generics.CreateAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [permissions.IsAdminUser]

class DistrictDetailView(generics.RetrieveAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

class DistrictUpdateView(generics.UpdateAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

class DistrictDeleteView(generics.DestroyAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'
