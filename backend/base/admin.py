from django.contrib import admin
from .models import User, Product, Order, OrderDetail, Cart

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'name', 'email', 'role', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['role']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['product_id', 'product_name', 'price', 'category', 'stock']
    search_fields = ['product_name', 'category']
    list_filter = ['category']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'user', 'order_date', 'total_amount', 'status']
    search_fields = ['user__name', 'delivery_address']
    list_filter = ['status', 'order_date']

@admin.register(OrderDetail)
class OrderDetailAdmin(admin.ModelAdmin):
    list_display = ['order_detail_id', 'order', 'product', 'quantity', 'price']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['cart_id', 'user', 'product', 'quantity']