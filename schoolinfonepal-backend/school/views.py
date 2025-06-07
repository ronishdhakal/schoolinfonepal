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
from django.db.models import F, Value, BooleanField, ExpressionWrapper

import json
import os
from django.http import HttpResponse
from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import pandas as pd
import io
from datetime import datetime, timedelta
from inquiry.models import Inquiry, PreRegistrationInquiry
from inquiry.serializers import InquirySerializer, PreRegistrationInquirySerializer
from django.utils import timezone
import csv
from core.pagination import StandardResultsSetPagination
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
    serializer_class = SchoolSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = SchoolFilter
    pagination_class = StandardResultsSetPagination
    search_fields = [
        'name', 'address', 'district__name',
        'school_courses__course__name', 'universities__name', 'level__name'
    ]

    def get_queryset(self):
        # Annotate boolean fields as integer for ordering
        return School.objects.annotate(
            is_featured=ExpressionWrapper(F('featured'), output_field=BooleanField()),
            is_verified=ExpressionWrapper(F('verification'), output_field=BooleanField())
        ).order_by(
            'priority',              # lower is higher precedence
            '-is_featured',          # True/1 comes first
            '-is_verified',          # True/1 comes first
            '-updated_at'            # latest updated comes first
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


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
    
    # Get filter parameters
    contacted = request.query_params.get('contacted')
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    search = request.query_params.get('search')
    
    # Base queries
    inquiries = Inquiry.objects.filter(school=school).order_by('-created_at')
    pre_registrations = PreRegistrationInquiry.objects.filter(school=school).order_by('-created_at')
    
    # Apply filters
    if contacted is not None:
        contacted_bool = contacted.lower() == 'true'
        inquiries = inquiries.filter(contacted=contacted_bool)
        pre_registrations = pre_registrations.filter(contacted=contacted_bool)
    
    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            inquiries = inquiries.filter(created_at__date__gte=start_date)
            pre_registrations = pre_registrations.filter(created_at__date__gte=start_date)
        except ValueError:
            pass
    
    if end_date:
        try:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            inquiries = inquiries.filter(created_at__date__lte=end_date)
            pre_registrations = pre_registrations.filter(created_at__date__lte=end_date)
        except ValueError:
            pass
    
    if search:
        inquiries = inquiries.filter(
            Q(full_name__icontains=search) | 
            Q(email__icontains=search) | 
            Q(phone__icontains=search) |
            Q(message__icontains=search) |
            Q(course__name__icontains=search)
        )
        pre_registrations = pre_registrations.filter(
            Q(full_name__icontains=search) | 
            Q(email__icontains=search) | 
            Q(phone__icontains=search) |
            Q(message__icontains=search) |
            Q(course__name__icontains=search)
        )

    return Response({
        'inquiries': InquirySerializer(inquiries, many=True).data,
        'pre_registrations': PreRegistrationInquirySerializer(pre_registrations, many=True).data
    })

@api_view(['PATCH'])
@permission_classes([IsSchoolOwnerOrAdmin])
def update_inquiry_contact_status(request, inquiry_id):
    """Update contact status for an inquiry"""
    if request.user.role != 'school' or not hasattr(request.user, 'school'):
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    school = request.user.school
    
    # Debug request data
    print(f"Request data: {request.data}")
    
    # Get the contacted status from request
    try:
        contacted = request.data.get('contacted', False)
        if isinstance(contacted, str):
            contacted = contacted.lower() == 'true'
        contacted = bool(contacted)
        print(f"Parsed contacted value: {contacted}")
    except Exception as e:
        print(f"Error parsing contacted value: {e}")
        contacted = False
    
    print(f"Updating inquiry {inquiry_id} contacted status to: {contacted}")
    
    try:
        # Try to find regular inquiry first
        inquiry = Inquiry.objects.get(id=inquiry_id, school=school)
        model_type = 'inquiry'
        print(f"Found regular inquiry: {inquiry.id}")
    except Inquiry.DoesNotExist:
        try:
            # Try pre-registration if regular inquiry not found
            inquiry = PreRegistrationInquiry.objects.get(id=inquiry_id, school=school)
            model_type = 'pre_registration'
            print(f"Found pre-registration inquiry: {inquiry.id}")
        except PreRegistrationInquiry.DoesNotExist:
            print(f"Inquiry {inquiry_id} not found for school {school.id}")
            return Response({"error": "Inquiry not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Update contacted status
    inquiry.contacted = contacted
    if contacted:
        inquiry.contacted_at = timezone.now()
    else:
        inquiry.contacted_at = None
    
    inquiry.save()
    
    print(f"Updated inquiry {inquiry.id} - contacted: {inquiry.contacted}, contacted_at: {inquiry.contacted_at}")
    
    # Return appropriate serializer based on model type
    if model_type == 'inquiry':
        serializer = InquirySerializer(inquiry)
    else:
        serializer = PreRegistrationInquirySerializer(inquiry)
    
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsSchoolOwnerOrAdmin])
def school_inquiries_analytics(request):
    """Get analytics for school inquiries"""
    if request.user.role != 'school' or not hasattr(request.user, 'school'):
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    school = request.user.school
    
    # Get date range for trends (last 30 days)
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=29)
    
    # Base queries
    inquiries = Inquiry.objects.filter(school=school)
    pre_registrations = PreRegistrationInquiry.objects.filter(school=school)
    
    # Total counts
    total_inquiries = inquiries.count()
    total_pre_registrations = pre_registrations.count()
    
    # Contact status counts
    contacted_inquiries = inquiries.filter(contacted=True).count()
    not_contacted_inquiries = total_inquiries - contacted_inquiries
    
    contacted_pre_registrations = pre_registrations.filter(contacted=True).count()
    not_contacted_pre_registrations = total_pre_registrations - contacted_pre_registrations
    
    # Course distribution
    course_distribution = inquiries.values('course__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    
    # Daily trends for the last 30 days
    daily_data = []
    current_date = start_date
    
    while current_date <= end_date:
        daily_inquiries = inquiries.filter(created_at__date=current_date).count()
        daily_pre_registrations = pre_registrations.filter(created_at__date=current_date).count()
        
        daily_data.append({
            'date': current_date.strftime('%Y-%m-%d'),
            'inquiries': daily_inquiries,
            'pre_registrations': daily_pre_registrations,
            'total': daily_inquiries + daily_pre_registrations
        })
        
        current_date += timedelta(days=1)
    
    return Response({
        'total_inquiries': total_inquiries,
        'total_pre_registrations': total_pre_registrations,
        'contacted_inquiries': contacted_inquiries,
        'not_contacted_inquiries': not_contacted_inquiries,
        'contacted_pre_registrations': contacted_pre_registrations,
        'not_contacted_pre_registrations': not_contacted_pre_registrations,
        'course_distribution': course_distribution,
        'daily_trends': daily_data
    })

@api_view(['GET'])
@permission_classes([IsSchoolOwnerOrAdmin])
def export_school_inquiries(request):
    """Export school inquiries to CSV (alternative to Excel)"""
    if request.user.role != 'school' or not hasattr(request.user, 'school'):
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    school = request.user.school
    
    # Get parameters
    inquiry_type = request.query_params.get('type', 'all')
    contacted = request.query_params.get('contacted')
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    
    # Base queries
    inquiries_query = Inquiry.objects.filter(school=school)
    pre_reg_query = PreRegistrationInquiry.objects.filter(school=school)
    
    # Apply filters
    if contacted is not None:
        contacted_bool = contacted.lower() == 'true'
        inquiries_query = inquiries_query.filter(contacted=contacted_bool)
        pre_reg_query = pre_reg_query.filter(contacted=contacted_bool)
    
    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            inquiries_query = inquiries_query.filter(created_at__date__gte=start_date)
            pre_reg_query = pre_reg_query.filter(created_at__date__gte=start_date)
        except ValueError:
            pass
    
    if end_date:
        try:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            inquiries_query = inquiries_query.filter(created_at__date__lte=end_date)
            pre_reg_query = pre_reg_query.filter(created_at__date__lte=end_date)
        except ValueError:
            pass
    
    # Create CSV response
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename=school_inquiries_{datetime.now().strftime("%Y%m%d")}.csv'
    
    writer = csv.writer(response)
    
    # Export regular inquiries
    if inquiry_type in ['all', 'inquiries']:
        inquiries = inquiries_query.select_related('course')
        
        if inquiries.exists():
            # Write header for inquiries
            writer.writerow(['=== GENERAL INQUIRIES ==='])
            writer.writerow([
                'ID', 'Full Name', 'Email', 'Phone', 'Address', 'Course', 
                'Message', 'Contacted', 'Contacted At', 'Created At'
            ])
            
            # Write inquiry data
            for inquiry in inquiries:
                writer.writerow([
                    inquiry.id,
                    inquiry.full_name,
                    inquiry.email,
                    inquiry.phone,
                    inquiry.address,
                    inquiry.course.name if inquiry.course else 'N/A',
                    inquiry.message,
                    'Yes' if inquiry.contacted else 'No',
                    inquiry.contacted_at.strftime('%Y-%m-%d %H:%M:%S') if inquiry.contacted_at else 'N/A',
                    inquiry.created_at.strftime('%Y-%m-%d %H:%M:%S')
                ])
            
            writer.writerow([])  # Empty row separator
    
    # Export pre-registration inquiries
    if inquiry_type in ['all', 'pre_registrations']:
        pre_registrations = pre_reg_query.select_related('course')
        
        if pre_registrations.exists():
            # Write header for pre-registrations
            writer.writerow(['=== PRE-REGISTRATIONS ==='])
            writer.writerow([
                'ID', 'Full Name', 'Email', 'Phone', 'Address', 'Level', 'Course',
                'Message', 'Contacted', 'Contacted At', 'Created At'
            ])
            
            # Write pre-registration data
            for pre_reg in pre_registrations:
                writer.writerow([
                    pre_reg.id,
                    pre_reg.full_name,
                    pre_reg.email,
                    pre_reg.phone,
                    pre_reg.address,
                    pre_reg.level,
                    pre_reg.course.name if pre_reg.course else 'N/A',
                    pre_reg.message,
                    'Yes' if pre_reg.contacted else 'No',
                    pre_reg.contacted_at.strftime('%Y-%m-%d %H:%M:%S') if pre_reg.contacted_at else 'N/A',
                    pre_reg.created_at.strftime('%Y-%m-%d %H:%M:%S')
                ])
    
    return response

@api_view(['GET'])
def school_dropdown(request):
    schools = School.objects.all().values('id', 'name')
    return Response(schools)
