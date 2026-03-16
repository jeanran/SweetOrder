from rest_framework import serializers
from .models import User, Product, Cart, Order, OrderDetail
from django.contrib.auth.hashers import make_password


# ─── USER ─────────────────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'email', 'role', 'created_at']
        extra_kwargs = {
            'user_id':    {'read_only': True},
            'created_at': {'read_only': True},
        }
       


# ─── REGISTER ─────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'confirm_password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'role':     {'required': False},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already registered.')
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError('Passwords do not match.')
        if len(data['password']) < 6:
            raise serializers.ValidationError('Password must be at least 6 characters.')
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        
        return User.objects.create(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],   
            role=validated_data.get('role', 'customer')
        )


# ─── PRODUCT ──────────────────────────────────────────────────

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = Product
        fields = [
            'product_id', 'product_name', 'description',
            'price', 'category', 'image_url',
            'stock', 'is_available'
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        
        return f"http://127.0.0.1:8000{obj.image.url}"


# ─── CART ─────────────────────────────────────────────────────

class CartSerializer(serializers.ModelSerializer):
    
    product_name = serializers.CharField(
        source='product.product_name', read_only=True
    )
    price = serializers.DecimalField(
        source='product.price',
        max_digits=10, decimal_places=2,
        read_only=True
    )
    image_url = serializers.SerializerMethodField()
    subtotal  = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'cart_id', 'product_id', 'product_name',
            'price', 'image_url', 'quantity', 'subtotal'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            return request.build_absolute_uri(obj.product.image.url) if request else obj.product.image.url
        return None

    def get_subtotal(self, obj):
        return str(obj.subtotal)  

# ─── ORDER ────────────────────────────────────────────────────

class OrderDetailSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.product_name', read_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderDetail
        fields = [
            'order_detail_id', 'product_id', 'product_name',
            'quantity', 'price', 'subtotal'
        ]

    def get_subtotal(self, obj):
        return str(obj.subtotal)


class OrderSerializer(serializers.ModelSerializer):
    order_details = OrderDetailSerializer(many=True, read_only=True)  
    class Meta:
        model = Order
        fields = [
            'order_id', 'user_id', 'order_date',
            'total_amount', 'status', 'delivery_address',
            'order_details'                                
        ]