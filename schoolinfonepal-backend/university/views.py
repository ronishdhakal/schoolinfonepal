from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from .models import University
from .serializers import UniversitySerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def university_list(request):
    universities = University.objects.all().order_by('priority', 'name')
    serializer = UniversitySerializer(universities, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def university_detail(request, slug):
    university = get_object_or_404(University, slug=slug)
    serializer = UniversitySerializer(university)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def university_create(request):
    data = request.data.dict()
    files = request.FILES

    # Add file fields if present
    if "logo" in files:
        data["logo"] = files["logo"]
    if "cover_photo" in files:
        data["cover_photo"] = files["cover_photo"]
    if "og_image" in files:
        data["og_image"] = files["og_image"]

    serializer = UniversitySerializer(data=data)
    if serializer.is_valid():
        university = serializer.save()
        return Response(UniversitySerializer(university).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def university_update(request, slug):
    university = get_object_or_404(University, slug=slug)
    data = request.data.dict()
    files = request.FILES

    if "logo" in files:
        data["logo"] = files["logo"]
    if "cover_photo" in files:
        data["cover_photo"] = files["cover_photo"]
    if "og_image" in files:
        data["og_image"] = files["og_image"]

    serializer = UniversitySerializer(university, data=data, partial=True)
    if serializer.is_valid():
        university = serializer.save()
        return Response(UniversitySerializer(university).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def university_delete(request, slug):
    university = get_object_or_404(University, slug=slug)
    university.delete()
    return Response({"message": "University deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def university_dropdown(request):
    universities = University.objects.all().values('id', 'name')
    return Response(universities)
