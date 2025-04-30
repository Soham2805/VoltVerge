from rest_framework import serializers
from .models import Booking
from stations.serializers import StationSerializer
from users.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):
    station_details = StationSerializer(source='station', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'station', 'booking_date', 'start_time', 
            'duration', 'connector_type', 'status', 'created_at', 
            'station_details', 'user_details'
        ]
        read_only_fields = ['user']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
