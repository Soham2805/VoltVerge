from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Station
from .serializers import StationSerializer, StationDetailSerializer, StationCreateUpdateSerializer
from .permissions import IsAdminOrReadOnly

class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'status']
    search_fields = ['name', 'address', 'location']
    permission_classes = [IsAdminOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StationCreateUpdateSerializer
        elif self.action in ['retrieve']:
            return StationDetailSerializer
        return StationSerializer
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Get stations near a specific location"""
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        
        if not lat or not lng:
            return Response({"error": "Latitude and longitude are required"}, status=400)
        
        # In a real app, you would use GeoDjango for proper distance calculations
        # This is a simplified version
        stations = self.get_queryset()
        serializer = self.get_serializer(stations, many=True)
        
        # Add a mock distance field for demonstration
        for station in serializer.data:
            # Calculate a mock distance (would be replaced with actual calculation)
            station['distance'] = round(abs(float(station['lat']) - float(lat)) + 
                                       abs(float(station['lng']) - float(lng)), 1)
        
        # Sort by the mock distance
        sorted_stations = sorted(serializer.data, key=lambda x: x['distance'])
        
        return Response(sorted_stations)
