from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, VehicleViewSet

router = DefaultRouter()
router.register(r'', UserViewSet)
router.register(r'vehicles', VehicleViewSet, basename='vehicle')

urlpatterns = [
    path('', include(router.urls)),
]
