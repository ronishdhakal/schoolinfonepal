from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
import json


from .models import University, UniversityGallery
from .serializers import UniversitySerializer
from type.models import Type

def safe_json_loads(val):
    if val in [None, "", [], {}]:
        return []
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return []

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
    
    # Handle type field - convert to ID if it's a string
    if "type" in data and data["type"]:
        try:
            # If it's a number, use it as ID
            type_id = int(data["type"])
            data["type"] = type_id
        except ValueError:
            # If it's a string, try to find by slug or name
            try:
                type_obj = Type.objects.get(slug=data["type"])
                data["type"] = type_obj.id
            except Type.DoesNotExist:
                try:
                    type_obj = Type.objects.get(name__iexact=data["type"])
                    data["type"] = type_obj.id
                except Type.DoesNotExist:
                    data["type"] = None
    
    # Handle boolean fields
    if "is_verified" in data:
        data["is_verified"] = data["is_verified"].lower() == "true"
    if "foreign_affiliated" in data:
        data["foreign_affiliated"] = data["foreign_affiliated"].lower() == "true"
    if "status" in data:
        data["status"] = data["status"].lower() == "true"
    
    # Handle JSON fields
    data["phones"] = safe_json_loads(request.data.get("phones", []))
    data["emails"] = safe_json_loads(request.data.get("emails", []))
    data["gallery"] = safe_json_loads(request.data.get("gallery", []))

    serializer = UniversitySerializer(data=data, context={'request': request})
    if serializer.is_valid():
        university = serializer.save()
        
        # Handle gallery images
        gallery_data = safe_json_loads(request.data.get("gallery", []))
        for i, gallery_item in enumerate(gallery_data):
            image_key = f"gallery_{i}_image"
            if image_key in request.FILES:
                UniversityGallery.objects.create(
                    university=university,
                    image=request.FILES[image_key],
                    caption=gallery_item.get('caption', '')
                )
        
        return Response(UniversitySerializer(university).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def university_update(request, slug):
    university = get_object_or_404(University, slug=slug)
    data = request.data.dict()
    
    # Handle type field - convert to ID if it's a string
    if "type" in data:
        if data["type"]:
            try:
                # If it's a number, use it as ID
                type_id = int(data["type"])
                data["type"] = type_id
            except ValueError:
                # If it's a string, try to find by slug or name
                try:
                    type_obj = Type.objects.get(slug=data["type"])
                    data["type"] = type_obj.id
                except Type.DoesNotExist:
                    try:
                        type_obj = Type.objects.get(name__iexact=data["type"])
                        data["type"] = type_obj.id
                    except Type.DoesNotExist:
                        data["type"] = None
        else:
            data["type"] = None
    
    # Handle boolean fields
    if "is_verified" in data:
        data["is_verified"] = data["is_verified"].lower() == "true"
    if "foreign_affiliated" in data:
        data["foreign_affiliated"] = data["foreign_affiliated"].lower() == "true"
    if "status" in data:
        data["status"] = data["status"].lower() == "true"
    
    # Handle JSON fields only if provided
    if "phones" in request.data:
        data["phones"] = safe_json_loads(request.data.get("phones", []))
    if "emails" in request.data:
        data["emails"] = safe_json_loads(request.data.get("emails", []))
    if "gallery" in request.data:
        data["gallery"] = safe_json_loads(request.data.get("gallery", []))

    serializer = UniversitySerializer(university, data=data, partial=True, context={'request': request})
    if serializer.is_valid():
        university = serializer.save()
        
        # Handle new gallery images
        if "gallery" in request.data:
            gallery_data = safe_json_loads(request.data.get("gallery", []))
            for i, gallery_item in enumerate(gallery_data):
                image_key = f"gallery_{i}_image"
                if image_key in request.FILES:
                    UniversityGallery.objects.create(
                        university=university,
                        image=request.FILES[image_key],
                        caption=gallery_item.get('caption', '')
                    )
        
        return Response(UniversitySerializer(university).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def university_delete(request, slug):
    university = get_object_or_404(University, slug=slug)
    
    # Clean up files
    if university.logo:
        university.logo.delete(save=False)
    if university.cover_photo:
        university.cover_photo.delete(save=False)
    if university.og_image:
        university.og_image.delete(save=False)
    
    # Clean up gallery images
    for gallery_item in university.gallery.all():
        if gallery_item.image:
            gallery_item.image.delete(save=False)
    
    university.delete()
    return Response({"message": "University deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def university_dropdown(request):
    universities = University.objects.all().values('id', 'name', 'slug')
    return Response(universities)
