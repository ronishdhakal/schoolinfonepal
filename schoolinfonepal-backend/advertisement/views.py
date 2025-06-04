from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import Advertisement
from .serializers import AdvertisementSerializer

# ✅ Public List - Only Active Ads
class AdvertisementListView(ListAPIView):
    queryset = Advertisement.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = AdvertisementSerializer
    permission_classes = [AllowAny]

# ✅ Admin Create with file + FormData support
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_advertisement(request):
    data = request.data.dict()
    serializer = AdvertisementSerializer(data=data)
    if serializer.is_valid():
        advertisement = serializer.save()

        if "image_mobile" in request.FILES:
            advertisement.image_mobile = request.FILES["image_mobile"]
        if "image_desktop" in request.FILES:
            advertisement.image_desktop = request.FILES["image_desktop"]
        advertisement.save()

        return Response(AdvertisementSerializer(advertisement).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin Update (PATCH)
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_advertisement(request, id):
    ad = get_object_or_404(Advertisement, id=id)
    data = request.data.dict()
    serializer = AdvertisementSerializer(ad, data=data, partial=True)

    if serializer.is_valid():
        ad = serializer.save()

        if "image_mobile" in request.FILES:
            ad.image_mobile = request.FILES["image_mobile"]
        if "image_desktop" in request.FILES:
            ad.image_desktop = request.FILES["image_desktop"]
        ad.save()

        return Response(AdvertisementSerializer(ad).data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin Retrieve by ID
class AdvertisementDetailView(RetrieveAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'

# ✅ Admin Delete
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_advertisement(request, id):
    ad = get_object_or_404(Advertisement, id=id)

    if ad.image_mobile:
        ad.image_mobile.delete(save=False)
    if ad.image_desktop:
        ad.image_desktop.delete(save=False)

    ad.delete()
    return Response({"message": "Advertisement deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
