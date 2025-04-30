from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    objects = UserManager()
    
    def __str__(self):
        return self.email

class Vehicle(models.Model):
    CONNECTOR_TYPES = [
        ('CCS', 'CCS'),
        ('CHAdeMO', 'CHAdeMO'),
        ('Type 2', 'Type 2'),
        ('J1772', 'J1772'),
        ('Tesla', 'Tesla'),
    ]
    
    user = models.ForeignKey(User, related_name='vehicles', on_delete=models.CASCADE)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    license_plate = models.CharField(max_length=20)
    connector_type = models.CharField(max_length=20, choices=CONNECTOR_TYPES)
    battery_capacity = models.IntegerField(help_text="Battery capacity in kWh")
    
    def __str__(self):
        return f"{self.user.email} - {self.make} {self.model}"
