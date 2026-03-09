from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CakeViewSet, CustomerViewSet, OrderViewSet

router = DefaultRouter()
router.register('cakes', CakeViewSet)
router.register('customers', CustomerViewSet)
router.register('orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

