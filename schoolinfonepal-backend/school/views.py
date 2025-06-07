from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import School, SchoolGallery, SchoolBrochure, SchoolMessage, SchoolEmail
from .serializers import SchoolSerializer
from inquiry.models import Inquiry, PreRegistrationInquiry
from inquiry.serializers import InquirySerializer, PreRegistrationInquirySerializer
from core.filters import SchoolFilter
from facility.models import Facility
from university.models import University
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
        file_path = str(file_field)
        if 'http:' in file_path or 'https:' in file_path:
            return

        if file_field and hasattr(file_field, 'delete'):
            file_field.delete(save=False)
    except (OSError, ValueError) as e:
        print(f"Warning: Could not delete file {file_field}: {e}")

class IsSchoolOwnerOrAdmin(IsAuthenticated):
    """
    Custom permission to only allow school owners to access their own data
    or admins to access any data.
    """
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if request.user.role == 'admin':
            return True

        if request.user.role == 'school':
            return hasattr(request.user, 'school')

        return False

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        
        if request.user.role == 'school' and hasattr(request.user, 'school'):
            return request.user.school == obj
            
        return False

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
    print("CREATE SCHOOL - Raw request data:")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    
    for key, value in request.data.items():
        if key not in ['logo', 'cover_photo', 'og_image']:
            if key in ['facilities', 'universities']:
                print(f"{key}: {request.data.getlist(key)} (getlist)")
            print(f"{key}: {value}")
    
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
        if field in request.data:
            data[field] = safe_json_loads(request.data.get(field, []))
            print(f"Processed {field}: {data[field]}")

    # Use admin_email as the main email for the School
    data["admin_email"] = request.data.get("admin_email", "")

    print(f"Create school data: {data}")

    # ✅ FIXED: Use transaction to ensure all operations succeed together
    with transaction.atomic():
        serializer = SchoolSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            school = serializer.save()
            print(f"School created with ID: {school.id}")

            # ✅ FIXED: Handle M2M relationships AFTER school creation
            _handle_m2m_relationships(school, request)
            _handle_file_uploads(school, request)

            # Verify the relationships were set
            print(f"Final school facilities: {[f.name for f in school.facilities.all()]}")
            print(f"Final school universities: {[u.name for u in school.universities.all()]}")

            return Response(SchoolSerializer(school, context={'request': request}).data, status=status.HTTP_201_CREATED)
        
        print(f"Create school errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_school(request, slug):
    print("UPDATE SCHOOL - Raw request data:")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    
    for key, value in request.data.items():
        if key not in ['logo', 'cover_photo', 'og_image']:
            if key in ['facilities', 'universities']:
                print(f"{key}: {request.data.getlist(key)} (getlist)")
            print(f"{key}: {value}")
    
    school = get_object_or_404(School, slug=slug)
    print(f"Updating school: {school.name} (ID: {school.id})")
    
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
            print(f"Processed {field}: {data[field]}")

    # Use admin_email as the main email for the School
    if "admin_email" in request.data:
        data["admin_email"] = request.data.get("admin_email")

    print(f"Update school data: {data}")

    # ✅ FIXED: Use transaction to ensure all operations succeed together
    with transaction.atomic():
        serializer = SchoolSerializer(school, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            school = serializer.save()
            print(f"School updated: {school.name}")

            # ✅ FIXED: Handle M2M relationships AFTER school update
            _handle_m2m_relationships(school, request)
            _handle_file_uploads(school, request, is_update=True)

            # Verify the relationships were set
            print(f"Final school facilities: {[f.name for f in school.facilities.all()]}")
            print(f"Final school universities: {[u.name for u in school.universities.all()]}")

            return Response(SchoolSerializer(school, context={'request': request}).data, status=status.HTTP_200_OK)
        
        print(f"Update school errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsSchoolOwnerOrAdmin])
def school_own_detail(request):
    """Get school's own profile"""
    if request.user.role != 'school' or not hasattr(request.user, 'school'):
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    school = request.user.school
    serializer = SchoolSerializer(school, context={'request': request})
    return Response(serializer.data)

@api_view(["PATCH"])
@permission_classes([IsSchoolOwnerOrAdmin])
@parser_classes([MultiPartParser, FormParser])
def school_own_update(request):
    """Allow schools to update their own profile"""
    print("SCHOOL OWN UPDATE - Raw request data:")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    
    for key, value in request.data.items():
        if key not in ['logo', 'cover_photo', 'og_image']:
            if key in ['facilities', 'universities']:
                print(f"{key}: {request.data.getlist(key)} (getlist)")
            print(f"{key}: {value}")
    
    if request.user.role != 'school' or not hasattr(request.user, 'school'):
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    school = request.user.school
    print(f"Updating school: {school.name} (ID: {school.id})")
    
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
            print(f"Processed {field}: {data[field]}")

    # Use admin_email as the main email for the School (for dashboard edit)
    if "admin_email" in request.data:
        data["admin_email"] = request.data.get("admin_email")

    print(f"School own update data: {data}")

    # ✅ FIXED: Use transaction to ensure all operations succeed together
    with transaction.atomic():
        serializer = SchoolSerializer(school, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            school = serializer.save()
            print(f"School updated: {school.name}")

            # ✅ FIXED: Handle M2M relationships AFTER school update
            _handle_m2m_relationships(school, request)
            _handle_file_uploads(school, request, is_update=True)

            # Verify the relationships were set
            print(f"Final school facilities: {[f.name for f in school.facilities.all()]}")
            print(f"Final school universities: {[u.name for u in school.universities.all()]}")

            return Response(SchoolSerializer(school, context={'request': request}).data, status=status.HTTP_200_OK)
        
        print(f"School own update errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def _handle_m2m_relationships(school, request):
    """Handle many-to-many relationships for facilities and universities"""
    
    print(f"=== M2M RELATIONSHIPS DEBUG ===")
    print(f"Request data keys: {list(request.data.keys())}")
    print(f"Request POST keys: {list(request.POST.keys())}")
    
    # ✅ CRITICAL FIX: Always process M2M relationships if the keys exist
    # Handle facilities
    if "facilities" in request.data or "facilities" in request.POST:
        # Try both request.data and request.POST
        facility_ids = request.data.getlist("facilities") or request.POST.getlist("facilities")
        print(f"Raw facilities from request: {facility_ids}")
        print(f"Facilities type: {type(facility_ids)}")
        
        # Convert to integers and filter valid IDs
        valid_facility_ids = []
        for fid in facility_ids:
            try:
                # ✅ CRITICAL FIX: Skip empty strings (which indicate "clear all")
                if fid and str(fid).strip() and str(fid).strip() != "":
                    valid_facility_ids.append(int(fid))
                    print(f"Added valid facility ID: {fid}")
            except (ValueError, TypeError) as e:
                print(f"Invalid facility ID: {fid}, error: {e}")
        
        print(f"Valid facility IDs: {valid_facility_ids}")
        
        # ✅ CRITICAL FIX: Always set the relationships, even if empty
        if valid_facility_ids:
            facilities = Facility.objects.filter(id__in=valid_facility_ids)
            print(f"Found facilities in DB: {[f.name for f in facilities]}")
            school.facilities.set(facilities)
            print(f"Set facilities for school: {[f.name for f in school.facilities.all()]}")
        else:
            school.facilities.clear()
            print("Cleared all facilities")
    else:
        print("No facilities data found in request")
    
    # Handle universities
    if "universities" in request.data or "universities" in request.POST:
        # Try both request.data and request.POST
        university_ids = request.data.getlist("universities") or request.POST.getlist("universities")
        print(f"Raw universities from request: {university_ids}")
        print(f"Universities type: {type(university_ids)}")
        
        # Convert to integers and filter valid IDs
        valid_university_ids = []
        for uid in university_ids:
            try:
                # ✅ CRITICAL FIX: Skip empty strings (which indicate "clear all")
                if uid and str(uid).strip() and str(uid).strip() != "":
                    valid_university_ids.append(int(uid))
                    print(f"Added valid university ID: {uid}")
            except (ValueError, TypeError) as e:
                print(f"Invalid university ID: {uid}, error: {e}")
        
        print(f"Valid university IDs: {valid_university_ids}")
        
        # ✅ CRITICAL FIX: Always set the relationships, even if empty
        if valid_university_ids:
            universities = University.objects.filter(id__in=valid_university_ids)
            print(f"Found universities in DB: {[u.name for u in universities]}")
            school.universities.set(universities)
            print(f"Set universities for school: {[u.name for u in school.universities.all()]}")
        else:
            school.universities.clear()
            print("Cleared all universities")
    else:
        print("No universities data found in request")
    
    print(f"=== END M2M DEBUG ===")

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
            for message_item in school.messages.all():
                safe_file_delete(message_item.image)
                message_item.delete()

        messages_data = safe_json_loads(request.data.get("messages", []))
        for i, msg in enumerate(messages_data):
            img_key = f"messages_{i}_image"
            msg_image = request.FILES.get(img_key)

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

    # User will be deleted automatically by the signal
    school.delete()
    return Response({"message": "School deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsSchoolOwnerOrAdmin])
def school_inquiries(request):
    """Get inquiries for the school"""
    if request.user.role != 'school' or not hasattr(request.user, 'school'):
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

    school = request.user.school
    inquiries = Inquiry.objects.filter(school=school).order_by('-created_at')
    pre_registrations = PreRegistrationInquiry.objects.filter(school=school).order_by('-created_at')

    return Response({
        'inquiries': InquirySerializer(inquiries, many=True).data,
        'pre_registrations': PreRegistrationInquirySerializer(pre_registrations, many=True).data
    })

@api_view(['GET'])
def school_dropdown(request):
    schools = School.objects.all().values('id', 'name')
    return Response(schools)
