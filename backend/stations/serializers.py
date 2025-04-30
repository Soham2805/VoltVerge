from rest_framework import serializers
from .models import Station, Connector, Amenity

class ConnectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connector
        fields = ['id', 'type']

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'type']

class StationSerializer(serializers.ModelSerializer):
    connectors = serializers.SerializerMethodField()
    amenities = serializers.SerializerMethodField()
    available = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Station
        fields = [
            'id', 'name', 'address', 'location', 'lat', 'lng', 
            'type', 'status', 'power', 'price', 'rating', 
            'connectors', 'amenities', 'available'
        ]
    
    def get_connectors(self, obj):
        connectors = Connector.objects.filter(station=obj)
        return [connector.type for connector in connectors]
    
    def get_amenities(self, obj):
        amenities = Amenity.objects.filter(station=obj)
        return [amenity.type for amenity in amenities]

class StationDetailSerializer(StationSerializer):
    class Meta(StationSerializer.Meta):
        fields = StationSerializer.Meta.fields + ['created_at', 'updated_at']

class StationCreateUpdateSerializer(serializers.ModelSerializer):
    connectors = serializers.ListField(
        child=serializers.CharField(),
        write_only=True
    )
    amenities = serializers.ListField(
        child=serializers.CharField(),
        write_only=True
    )
    
    class Meta:
        model = Station
        fields = [
            'id', 'name', 'address', 'location', 'lat', 'lng', 
            'type', 'status', 'power', 'price', 'connectors', 'amenities'
        ]
    
    def create(self, validated_data):
        connectors_data = validated_data.pop('connectors', [])
        amenities_data = validated_data.pop('amenities', [])
        
        station = Station.objects.create(**validated_data)
        
        for connector_type in connectors_data:
            Connector.objects.create(station=station, type=connector_type)
        
        for amenity_type in amenities_data:
            Amenity.objects.create(station=station, type=amenity_type)
        
        return station
    
    def update(self, instance, validated_data):
        connectors_data = validated_data.pop('connectors', None)
        amenities_data = validated_data.pop('amenities', None)
        
        # Update station fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update connectors if provided
        if connectors_data is not None:
            Connector.objects.filter(station=instance).delete()
            for connector_type in connectors_data:
                Connector.objects.create(station=instance, type=connector_type)
        
        # Update amenities if provided
        if amenities_data is not None:
            Amenity.objects.filter(station=instance).delete()
            for amenity_type in amenities_data:
                Amenity.objects.create(station=instance, type=amenity_type)
        
        return instance
