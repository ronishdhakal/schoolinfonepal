from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from .models import Information, InformationCategory
from .serializers import InformationSerializer, InformationCategorySerializer
from core.filters import InformationFilter
from core.pagination import StandardResultsSetPagination  # <-- ADD THIS LINE

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

# ========================
# 📰 Information Views
# ========================

class InformationListView(ListAPIView):
    queryset = Information.objects.all().order_by('-published_date', '-created_at')
    serializer_class = InformationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = InformationFilter
    search_fields = ['title', 'top_description', 'below_description']
    pagination_class = StandardResultsSetPagination   # <-- ADD THIS LINE


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

# ========================
# 📂 Information Category Views
# ========================

# ✅ Public Category List
class InformationCategoryListView(ListAPIView):
    queryset = InformationCategory.objects.all().order_by('name')
    serializer_class = InformationCategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']

# ✅ Public Category Detail
class InformationCategoryDetailView(RetrieveAPIView):
    queryset = InformationCategory.objects.all()
    serializer_class = InformationCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin Create Category
@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_information_category(request):
    data = request.data.copy()
    
    # Auto-generate slug if not provided
    if not data.get("slug") and data.get("name"):
        data["slug"] = slugify(data["name"])

    serializer = InformationCategorySerializer(data=data)
    if serializer.is_valid():
        category = serializer.save()
        return Response(InformationCategorySerializer(category).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin Update Category
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def update_information_category(request, slug):
    category = get_object_or_404(InformationCategory, slug=slug)
    data = request.data.copy()
    
    # Auto-generate slug if name is updated but slug is not provided
    if data.get("name") and not data.get("slug"):
        data["slug"] = slugify(data["name"])

    serializer = InformationCategorySerializer(category, data=data, partial=True)
    if serializer.is_valid():
        category = serializer.save()
        return Response(InformationCategorySerializer(category).data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Admin Delete Category
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_information_category(request, slug):
    category = get_object_or_404(InformationCategory, slug=slug)
    
    # Check if category has associated information
    if category.contents.exists():
        return Response(
            {"error": "Cannot delete category with associated information. Please reassign or delete the information first."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    category.delete()
    return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# ✅ Dropdown API for Categories
@api_view(['GET'])
@permission_classes([AllowAny])
def information_category_dropdown(request):
    categories = InformationCategory.objects.all().values('id', 'name')
    return Response(categories)
