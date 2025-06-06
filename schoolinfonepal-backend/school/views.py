from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
from .models import School, SchoolGallery, SchoolBrochure, SchoolMessage
from .serializers import SchoolSerializer
from core.filters import SchoolFilter
import json
import os

def safe_json_loads(val):
    """Utility: safely decode JSON or pass through lists/dicts."""
    if val in [None, "", [], {}]:
        return []
    if isinstance(val, (list, dict)):
        return val
    try:
        return json.loads(val)
    except Exception:
        return []

def safe_file_delete(file_field):
    """Safely delete a file, handling invalid paths gracefully"""
    if not file_field:
        return
    
    try:
        # Check if the file path contains invalid characters (like full URLs)
        file_path = str(file_field)
        if 'http:' in file_path or 'https:' in file_path:
            # This is a corrupted path, just delete the database record
            return
        
        # Try to delete the actual file
        if file_field and hasattr(file_field, 'delete'):
            file_field.delete(save=False)
    except (OSError, ValueError) as e:
        # Log the error but don't crash
        print(f"Warning: Could not delete file {file_field}: {e}")

class SchoolListView(ListAPIView):
    queryset = School.objects.all().order_by('-priority', 'name')
    serializer_class = SchoolSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = SchoolFilter
    search_fields = [
        'name', 'address', 'district__name',
        'school_courses__course__name', 'universities__name', 'level__name'
    ]

class SchoolDetailView(RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_school(request):
    data = request.data.dict()
    
    # Handle boolean fields
    if "verification" in data:
        data["verification"] = data["verification"].lower() == "true"
    if "featured" in data:
        data["featured"] = data["featured"].lower() == "true"
    
    # Handle JSON fields
    for field in [
        "phones", "emails", "gallery", "brochures", "social_media",
        "faqs", "messages", "school_courses"
    ]:
        data[field] = safe_json_loads(request.data.get(field, []))

    # Handle M2M fields
    facilities = request.data.getlist("facilities")
    universities = request.data.getlist("universities")
    data["facilities"] = facilities
    data["universities"] = universities

    serializer = SchoolSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        school = serializer.save()

        # Handle file uploads
        _handle_file_uploads(school, request)

        return Response(SchoolSerializer(school).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_school(request, slug):
    school = get_object_or_404(School, slug=slug)
    data = request.data.dict()
    
    # Handle boolean fields
    if "verification" in data:
        data["verification"] = data["verification"].lower() == "true"
    if "featured" in data:
        data["featured"] = data["featured"].lower() == "true"
    
    # Handle JSON fields only if provided
    for field in [
        "phones", "emails", "gallery", "brochures", "social_media",
        "faqs", "messages", "school_courses"
    ]:
        if field in request.data:
            data[field] = safe_json_loads(request.data.get(field, []))

    # Handle M2M fields
    if "facilities" in request.data:
        data["facilities"] = request.data.getlist("facilities")
    if "universities" in request.data:
        data["universities"] = request.data.getlist("universities")

    serializer = SchoolSerializer(school, data=data, partial=True, context={'request': request})
    if serializer.is_valid():
        school = serializer.save()

        # Handle file uploads
        _handle_file_uploads(school, request, is_update=True)

        return Response(SchoolSerializer(school).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def _handle_file_uploads(school, request, is_update=False):
    """Handle all file uploads for school"""
    
    # Handle main images
    if "logo" in request.FILES:
        if is_update and school.logo:
            safe_file_delete(school.logo)
        school.logo = request.FILES["logo"]
    
    if "cover_photo" in request.FILES:
        if is_update and school.cover_photo:
            safe_file_delete(school.cover_photo)
        school.cover_photo = request.FILES["cover_photo"]
    
    if "og_image" in request.FILES:
        if is_update and school.og_image:
            safe_file_delete(school.og_image)
        school.og_image = request.FILES["og_image"]
    
    school.save()

    # Handle gallery images
    if "gallery" in request.data:
        if is_update:
            # Clean up existing gallery items
            for gallery_item in school.gallery.all():
                safe_file_delete(gallery_item.image)
                gallery_item.delete()

        gallery_data = safe_json_loads(request.data.get("gallery", []))
        for i, item in enumerate(gallery_data):
            img_key = f"gallery_{i}_image"
            if img_key in request.FILES:
                SchoolGallery.objects.create(
                    school=school,
                    image=request.FILES[img_key],
                    caption=item.get("caption", "")
                )

    # Handle brochure files
    if "brochures" in request.data:
        if is_update:
            # Clean up existing brochures
            for brochure_item in school.brochures.all():
                safe_file_delete(brochure_item.file)
                brochure_item.delete()

        brochures_data = safe_json_loads(request.data.get("brochures", []))
        for i, item in enumerate(brochures_data):
            file_key = f"brochures_{i}_file"
            if file_key in request.FILES:
                SchoolBrochure.objects.create(
                    school=school,
                    file=request.FILES[file_key],
                    description=item.get("description", "")
                )

    # Handle message images
    if "messages" in request.data:
        if is_update:
            # Clean up existing messages
            for message_item in school.messages.all():
                safe_file_delete(message_item.image)
                message_item.delete()

        messages_data = safe_json_loads(request.data.get("messages", []))
        for i, msg in enumerate(messages_data):
            img_key = f"messages_{i}_image"
            msg_image = request.FILES.get(img_key)
            
            # Create message if it has any content
            if any([msg.get("title"), msg.get("message"), msg.get("name"), msg.get("designation")]) or msg_image:
                SchoolMessage.objects.create(
                    school=school,
                    title=msg.get("title", ""),
                    message=msg.get("message", ""),
                    name=msg.get("name", ""),
                    designation=msg.get("designation", ""),
                    image=msg_image
                )

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_school(request, slug):
    school = get_object_or_404(School, slug=slug)
    
    # Clean up files safely
    safe_file_delete(school.logo)
    safe_file_delete(school.cover_photo)
    safe_file_delete(school.og_image)
    
    # Clean up gallery images
    for gallery_item in school.gallery.all():
        safe_file_delete(gallery_item.image)
    
    # Clean up brochure files
    for brochure_item in school.brochures.all():
        safe_file_delete(brochure_item.file)
    
    # Clean up message images
    for message_item in school.messages.all():
        safe_file_delete(message_item.image)
    
    school.delete()
    return Response({"message": "School deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Dashboard-only views
class SchoolOwnDetailView(RetrieveAPIView):
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user.school

class SchoolOwnUpdateView(SchoolOwnDetailView):
    def patch(self, request, *args, **kwargs):
        return update_school(request, self.get_object().slug)

@api_view(['GET'])
def school_dropdown(request):
    schools = School.objects.all().values('id', 'name')
    return Response(schools)
