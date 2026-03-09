from rest_framework import serializers
from .models import Cake, Customer, Order

class CakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cake
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

