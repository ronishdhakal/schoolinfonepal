from rest_framework import generics, permissions
from .models import Discipline
from .serializers import DisciplineSerializer

class DisciplineListView(generics.ListAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.AllowAny]

class DisciplineCreateView(generics.CreateAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.IsAdminUser]

class DisciplineDetailView(generics.RetrieveAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class DisciplineUpdateView(generics.UpdateAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

class DisciplineDeleteView(generics.DestroyAPIView):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'
