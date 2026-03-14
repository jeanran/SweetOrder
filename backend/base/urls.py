from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ProductViewSet, CartViewSet, checkout

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    # ✅ FIXED: auth endpoints match what React calls
    path('auth/register/', views.register, name='register'),
    path('auth/login/',    views.login,    name='login'),
    path('auth/logout/',   views.logout,   name='logout'),

    # Checkout
    path('checkout/', checkout, name='checkout'),

    # ✅ FIXED: no extra 'api/' prefix — router URLs go directly here
    path('', include(router.urls)),


    path('auth/profile/', views.profile, name='profile'),
    path('orders/',       views.user_orders, name='orders'),
]