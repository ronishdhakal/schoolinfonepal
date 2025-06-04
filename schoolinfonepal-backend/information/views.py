from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404

from .models import Information
from .serializers import InformationSerializer
from core.filters import InformationFilter
import json

def safe_json_loads(val):
    if val in [None, "", [], {}]:
        return []
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return []

# ✅ Public List
class InformationListView(ListAPIView):
    queryset = Information.objects.all().order_by('-published_date', '-created_at')
    serializer_class = InformationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = InformationFilter
    search_fields = ['title', 'top_description', 'below_description']

# ✅ Public Detail
class InformationDetailView(RetrieveAPIView):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin Create
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_information(request):
    data = request.data.dict()
    data["universities"] = safe_json_loads(request.data.get("universities", []))
    data["levels"] = safe_json_loads(request.data.get("levels", []))
    data["courses"] = safe_json_loads(request.data.get("courses", []))
    data["schools"] = safe_json_loads(request.data.get("schools", []))

    serializer = InformationSerializer(data=data)
    if serializer.is_valid():
        info = serializer.save()

        if "featured_image" in request.FILES:
            info.featured_image = request.FILES["featured_image"]
            info.save()

        return Response(InformationSerializer(info).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin Update
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_information(request, slug):
    info = get_object_or_404(Information, slug=slug)
    data = request.data.dict()
    data["universities"] = safe_json_loads(request.data.get("universities", [])) if "universities" in request.data else None
    data["levels"] = safe_json_loads(request.data.get("levels", [])) if "levels" in request.data else None
    data["courses"] = safe_json_loads(request.data.get("courses", [])) if "courses" in request.data else None
    data["schools"] = safe_json_loads(request.data.get("schools", [])) if "schools" in request.data else None

    serializer = InformationSerializer(info, data=data, partial=True)
    if serializer.is_valid():
        info = serializer.save()

        if "featured_image" in request.FILES:
            if info.featured_image:
                info.featured_image.delete(save=False)
            info.featured_image = request.FILES["featured_image"]
            info.save()

        return Response(InformationSerializer(info).data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin Delete
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_information(request, slug):
    info = get_object_or_404(Information, slug=slug)
    if info.featured_image:
        info.featured_image.delete(save=False)
    info.delete()
    return Response({"message": "Information deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
