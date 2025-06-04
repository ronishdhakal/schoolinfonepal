from rest_framework import generics, permissions
from .models import Type
from .serializers import TypeSerializer

class TypeListView(generics.ListAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [permissions.AllowAny]

class TypeCreateView(generics.CreateAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [permissions.IsAdminUser]

class TypeDetailView(generics.RetrieveAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class TypeUpdateView(generics.UpdateAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

class TypeDeleteView(generics.DestroyAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'
