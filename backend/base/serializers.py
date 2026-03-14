from rest_framework import serializers
from .models import User, Product, Order, OrderDetail, Cart
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'email', 'password', 'role', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True},
            'user_id': {'read_only': True},
            'created_at': {'read_only': True}
        }
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'confirm_password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already registered")
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create(
            name=validated_data['name'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            role=validated_data.get('role', 'customer')
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    products = ProductSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'