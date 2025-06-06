from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404

from .models import Advertisement
from .serializers import AdvertisementSerializer

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
    try:
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data
        
        # Handle file uploads separately
        files = {}
        if "image_mobile" in request.FILES:
            files["image_mobile"] = request.FILES["image_mobile"]
        if "image_desktop" in request.FILES:
            files["image_desktop"] = request.FILES["image_desktop"]
        
        # Merge data and files
        combined_data = {**data, **files}
        
        serializer = AdvertisementSerializer(data=combined_data)
        if serializer.is_valid():
            advertisement = serializer.save()
            return Response(AdvertisementSerializer(advertisement).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response(
            {"error": f"Failed to create advertisement: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ✅ Admin Update (PATCH)
@api_view(["PATCH"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_advertisement(request, id):
    try:
        ad = get_object_or_404(Advertisement, id=id)
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data
        
        # Handle file uploads
        if "image_mobile" in request.FILES:
            # Delete old file if exists
            if ad.image_mobile:
                try:
                    ad.image_mobile.delete(save=False)
                except:
                    pass  # Ignore deletion errors
            data["image_mobile"] = request.FILES["image_mobile"]
            
        if "image_desktop" in request.FILES:
            # Delete old file if exists
            if ad.image_desktop:
                try:
                    ad.image_desktop.delete(save=False)
                except:
                    pass  # Ignore deletion errors
            data["image_desktop"] = request.FILES["image_desktop"]
        
        serializer = AdvertisementSerializer(ad, data=data, partial=True)
        if serializer.is_valid():
            ad = serializer.save()
            return Response(AdvertisementSerializer(ad).data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
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

# ✅ Admin Delete
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_advertisement(request, id):
    try:
        ad = get_object_or_404(Advertisement, id=id)

        # Safe file deletion
        if ad.image_mobile:
            try:
                ad.image_mobile.delete(save=False)
            except:
                pass  # Ignore deletion errors
                
        if ad.image_desktop:
            try:
                ad.image_desktop.delete(save=False)
            except:
                pass  # Ignore deletion errors

        ad.delete()
        return Response({"message": "Advertisement deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    except Exception as e:
        return Response(
            {"error": f"Failed to delete advertisement: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
