from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404
import os

from .models import Advertisement
from .serializers import AdvertisementSerializer

def safe_file_delete(file_field):
    """Safely delete a file, handling invalid paths gracefully"""
    if not file_field:
        return
    try:
        if file_field and hasattr(file_field, 'delete'):
            file_field.delete(save=False)
    except (OSError, ValueError) as e:
        print(f"Warning: Could not delete file {file_field}: {e}")

# ✅ Public List - Only Active Ads
class AdvertisementListView(ListAPIView):
    queryset = Advertisement.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = AdvertisementSerializer
    permission_classes = [AllowAny]

# ✅ Admin List - All Ads (for admin panel)
class AdvertisementAdminListView(ListAPIView):
    queryset = Advertisement.objects.all().order_by('-created_at')
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdminUser]

# ✅ Admin Create with file + FormData support
@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def create_advertisement(request):
    print("=== CREATE ADVERTISEMENT DEBUG ===")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    
    # Log all request data
    for key, value in request.data.items():
        if key not in ['image_mobile', 'image_desktop']:
            print(f"{key}: {value}")
        else:
            print(f"{key}: {type(value)} - {getattr(value, 'name', 'No name')}")
    
    try:
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data
        
        # Handle boolean field
        if "is_active" in data:
            data["is_active"] = str(data["is_active"]).lower() == "true"
        
        # Handle file uploads separately
        files = {}
        if "image_mobile" in request.FILES:
            files["image_mobile"] = request.FILES["image_mobile"]
            print(f"Mobile image: {files['image_mobile'].name}")
        if "image_desktop" in request.FILES:
            files["image_desktop"] = request.FILES["image_desktop"]
            print(f"Desktop image: {files['image_desktop'].name}")
        
        # Merge data and files
        combined_data = {**data, **files}
        print(f"Combined data: {combined_data}")
        
        serializer = AdvertisementSerializer(data=combined_data, context={'request': request})
        if serializer.is_valid():
            advertisement = serializer.save()
            print(f"Created advertisement: {advertisement.id}")
            return Response(AdvertisementSerializer(advertisement, context={'request': request}).data, status=status.HTTP_201_CREATED)
        
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print(f"Exception in create_advertisement: {e}")
        return Response(
            {"error": f"Failed to create advertisement: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ✅ Admin Update (PATCH)
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_advertisement(request, id):
    print("=== UPDATE ADVERTISEMENT DEBUG ===")
    print(f"Request method: {request.method}")
    print(f"Content type: {request.content_type}")
    print(f"Advertisement ID: {id}")
    
    # Log all request data
    for key, value in request.data.items():
        if key not in ['image_mobile', 'image_desktop']:
            print(f"{key}: {value}")
        else:
            print(f"{key}: {type(value)} - {getattr(value, 'name', 'No name')}")
    
    try:
        ad = get_object_or_404(Advertisement, id=id)
        print(f"Found advertisement: {ad.title}")
        
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data
        
        # Handle boolean field
        if "is_active" in data:
            data["is_active"] = str(data["is_active"]).lower() == "true"
            print(f"Processed is_active: {data['is_active']}")
        
        # Handle file uploads
        if "image_mobile" in request.FILES:
            print("Updating mobile image")
            # Delete old file if exists
            if ad.image_mobile:
                safe_file_delete(ad.image_mobile)
            data["image_mobile"] = request.FILES["image_mobile"]
            
        if "image_desktop" in request.FILES:
            print("Updating desktop image")
            # Delete old file if exists
            if ad.image_desktop:
                safe_file_delete(ad.image_desktop)
            data["image_desktop"] = request.FILES["image_desktop"]
        
        print(f"Final update data: {data}")
        
        serializer = AdvertisementSerializer(ad, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            ad = serializer.save()
            print(f"Updated advertisement: {ad.id}")
            return Response(AdvertisementSerializer(ad, context={'request': request}).data, status=status.HTTP_200_OK)
        
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print(f"Exception in update_advertisement: {e}")
        return Response(
            {"error": f"Failed to update advertisement: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ✅ Admin Retrieve by ID
class AdvertisementDetailView(RetrieveAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'id'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# ✅ Admin Delete
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_advertisement(request, id):
    print("=== DELETE ADVERTISEMENT DEBUG ===")
    print(f"Advertisement ID: {id}")
    
    try:
        ad = get_object_or_404(Advertisement, id=id)
        print(f"Found advertisement: {ad.title}")

        # Safe file deletion
        if ad.image_mobile:
            print("Deleting mobile image")
            safe_file_delete(ad.image_mobile)
                
        if ad.image_desktop:
            print("Deleting desktop image")
            safe_file_delete(ad.image_desktop)

        ad.delete()
        print("Advertisement deleted successfully")
        return Response({"message": "Advertisement deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    except Exception as e:
        print(f"Exception in delete_advertisement: {e}")
        return Response(
            {"error": f"Failed to delete advertisement: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
