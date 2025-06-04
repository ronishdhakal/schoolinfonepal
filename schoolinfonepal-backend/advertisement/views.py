from rest_framework import generics, permissions
from .models import Advertisement
from .serializers import AdvertisementSerializer

# Public: List only active advertisements
class AdvertisementListView(generics.ListAPIView):
    queryset = Advertisement.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.AllowAny]


# Admin: Create advertisement
class AdvertisementCreateView(generics.CreateAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.IsAdminUser]


# Admin: Retrieve advertisement by ID (for edit)
class AdvertisementDetailView(generics.RetrieveAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'


# Admin: Update advertisement by ID
class AdvertisementUpdateView(generics.UpdateAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'


# Admin: Delete advertisement by ID
class AdvertisementDeleteView(generics.DestroyAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'
