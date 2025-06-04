from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import District
from .serializers import DistrictSerializer

# ✅ Public: List all districts
class DistrictListView(ListAPIView):
    queryset = District.objects.all().order_by("name")
    serializer_class = DistrictSerializer
    permission_classes = [AllowAny]

# ✅ Detail view (e.g., admin view)
class DistrictDetailView(RetrieveAPIView):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

# ✅ Admin: Create
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_district(request):
    data = request.data.dict()
    serializer = DistrictSerializer(data=data)
    if serializer.is_valid():
        district = serializer.save()
        return Response(DistrictSerializer(district).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_district(request, slug):
    district = get_object_or_404(District, slug=slug)
    data = request.data.dict()
    serializer = DistrictSerializer(district, data=data, partial=True)
    if serializer.is_valid():
        district = serializer.save()
        return Response(DistrictSerializer(district).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_district(request, slug):
    district = get_object_or_404(District, slug=slug)
    district.delete()
    return Response({"message": "District deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
