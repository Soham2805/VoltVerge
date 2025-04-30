from django.db import models

class Station(models.Model):
    STATION_TYPES = [
        ('Fast Charger', 'Fast Charger'),
        ('Level 2', 'Level 2'),
        ('Supercharger', 'Supercharger'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('offline', 'Offline'),
        ('maintenance', 'Maintenance'),
    ]
    
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    location = models.CharField(max_length=100)
    lat = models.FloatField()
    lng = models.FloatField()
    type = models.CharField(max_length=20, choices=STATION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    power = models.CharField(max_length=20)
    price = models.CharField(max_length=20)
    rating = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def available(self):
        return self.status == 'active'

class Connector(models.Model):
    CONNECTOR_TYPES = [
        ('CCS', 'CCS'),
        ('CHAdeMO', 'CHAdeMO'),
        ('Type 2', 'Type 2'),
        ('J1772', 'J1772'),
        ('Tesla', 'Tesla'),
    ]
    
    station = models.ForeignKey(Station, related_name='connectors', on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=CONNECTOR_TYPES)
    
    def __str__(self):
        return f"{self.station.name} - {self.type}"

class Amenity(models.Model):
    AMENITY_TYPES = [
        ('Restrooms', 'Restrooms'),
        ('WiFi', 'WiFi'),
        ('Coffee Shop', 'Coffee Shop'),
        ('Dining', 'Dining'),
        ('Shopping', 'Shopping'),
        ('Parking', 'Parking'),
        ('Park', 'Park'),
    ]
    
    station = models.ForeignKey(Station, related_name='amenities', on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=AMENITY_TYPES)
    
    def __str__(self):
        return f"{self.station.name} - {self.type}"
