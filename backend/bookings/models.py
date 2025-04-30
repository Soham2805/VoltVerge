from django.db import models
from django.contrib.auth import get_user_model
from stations.models import Station

User = get_user_model()

class Booking(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, related_name='bookings', on_delete=models.CASCADE)
    station = models.ForeignKey(Station, related_name='bookings', on_delete=models.CASCADE)
    booking_date = models.DateField()
    start_time = models.TimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    connector_type = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.station.name} - {self.booking_date}"
    
    class Meta:
        ordering = ['-booking_date', '-start_time']
