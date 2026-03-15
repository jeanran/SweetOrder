from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ProductViewSet, CartViewSet, checkout

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'cart',     CartViewSet,    basename='cart')

urlpatterns = [

    # ── AUTH ──────────────────────────────────────────────
    path('auth/register/', views.register,   name='register'),
    path('auth/login/',    views.login,       name='login'),
    path('auth/logout/',   views.logout,      name='logout'),
    path('auth/profile/',  views.profile,     name='profile'),

    # ── CUSTOMER ──────────────────────────────────────────
    path('orders/',        views.user_orders, name='user-orders'),
    path('checkout/',      views.checkout,    name='checkout'),

    # ── ADMIN ─────────────────────────────────────────────
    path('admin/orders/',                    views.admin_orders,       name='admin-orders'),
    path('admin/orders/<int:order_id>/',     views.admin_order_update, name='admin-order-update'),
    path('admin/users/',                     views.admin_users,        name='admin-users'),
    path('admin/users/<int:target_id>/',     views.admin_user_detail,  name='admin-user-detail'),
    path('admin/products/',                  views.admin_products,     name='admin-products'),
    path('admin/products/<int:product_id>/', views.admin_product_detail, name='admin-product-detail'),

    # ── ROUTER (products + cart ViewSets) ─────────────────
    path('', include(router.urls)),

]