from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import Facility
from .serializers import FacilitySerializer

# ✅ Public or Protected List View
class FacilityListView(ListAPIView):
    queryset = Facility.objects.all().order_by("name")
    serializer_class = FacilitySerializer
    permission_classes = [IsAuthenticated]  # Or AllowAny if you want public access

# ✅ Detail View
class FacilityDetailView(RetrieveAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

# ✅ Admin: Create Facility
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_facility(request):
    data = request.data.dict()
    serializer = FacilitySerializer(data=data)
    if serializer.is_valid():
        facility = serializer.save()

        if "icon" in request.FILES:
            facility.icon = request.FILES["icon"]
            facility.save()

        return Response(FacilitySerializer(facility).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Update Facility
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_facility(request, slug):
    facility = get_object_or_404(Facility, slug=slug)
    data = request.data.dict()
    serializer = FacilitySerializer(facility, data=data, partial=True)
    if serializer.is_valid():
        facility = serializer.save()

        if "icon" in request.FILES:
            if facility.icon:
                facility.icon.delete(save=False)
            facility.icon = request.FILES["icon"]
            facility.save()

        return Response(FacilitySerializer(facility).data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin: Delete Facility
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_facility(request, slug):
    facility = get_object_or_404(Facility, slug=slug)
    if facility.icon:
        facility.icon.delete(save=False)
    facility.delete()
    return Response({"message": "Facility deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def facility_dropdown(request):
    facilities = Facility.objects.all().values('id', 'name')
    return Response(facilities)
