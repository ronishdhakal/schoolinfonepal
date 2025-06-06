from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from .models import Facility
from .serializers import FacilitySerializer, FacilityDropdownSerializer

# ✅ Public List - All Facilities
class FacilityListView(ListAPIView):
    queryset = Facility.objects.all().order_by('name')
    serializer_class = FacilitySerializer
    permission_classes = [AllowAny]

# ✅ Public Dropdown - For forms
class FacilityDropdownView(ListAPIView):
    queryset = Facility.objects.all().order_by('name')
    serializer_class = FacilityDropdownSerializer
    permission_classes = [AllowAny]

# ✅ Public Detail by Slug
class FacilityDetailView(RetrieveAPIView):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

# ✅ Admin Create with file + FormData support
@api_view(['POST'])  # Make sure it's a list, not string
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_facility(request):
    """Create a new facility"""
    try:
        print(f"Received POST request to create facility")
        print(f"Request data: {request.data}")
        print(f"Request files: {request.FILES}")
        
        # Get data from request
        data = {}
        for key, value in request.data.items():
            if key != 'icon':  # Handle icon separately
                data[key] = value
        
        # Auto-generate slug if not provided
        if 'name' in data and not data.get('slug'):
            data['slug'] = slugify(data['name'])
        
        # Handle icon file
        if 'icon' in request.FILES:
            data['icon'] = request.FILES['icon']
        
        print(f"Processed data: {data}")
        
        serializer = FacilitySerializer(data=data)
        if serializer.is_valid():
            facility = serializer.save()
            print(f"Facility created successfully: {facility.name}")
            return Response(
                FacilitySerializer(facility).data, 
                status=status.HTTP_201_CREATED
            )
        else:
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print(f"Error creating facility: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            {"error": f"Failed to create facility: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ✅ Admin Update (PATCH)
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_facility(request, slug):
    """Update an existing facility"""
    try:
        facility = get_object_or_404(Facility, slug=slug)
        
        # Get data from request
        data = {}
        for key, value in request.data.items():
            if key != 'icon':  # Handle icon separately
                data[key] = value
        
        # Handle icon file
        if 'icon' in request.FILES:
            # Delete old icon if exists
            if facility.icon:
                try:
                    facility.icon.delete(save=False)
                except:
                    pass
            data['icon'] = request.FILES['icon']
        
        serializer = FacilitySerializer(facility, data=data, partial=True)
        if serializer.is_valid():
            facility = serializer.save()
            return Response(
                FacilitySerializer(facility).data, 
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response(
            {"error": f"Failed to update facility: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ✅ Admin Delete
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_facility(request, slug):
    """Delete a facility"""
    try:
        facility = get_object_or_404(Facility, slug=slug)

        # Safe file deletion
        if facility.icon:
            try:
                facility.icon.delete(save=False)
            except:
                pass

        facility_name = facility.name
        facility.delete()
        
        return Response(
            {"message": f"Facility '{facility_name}' deleted successfully"}, 
            status=status.HTTP_204_NO_CONTENT
        )
    
    except Exception as e:
        return Response(
            {"error": f"Failed to delete facility: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
