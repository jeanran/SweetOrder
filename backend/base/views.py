from django.shortcuts import render

from rest_framework import viewsets
from .models import Cake, Customer, Order
from .serializers import CakeSerializer, CustomerSerializer, OrderSerializer


class CakeViewSet(viewsets.ModelViewSet):
    queryset = Cake.objects.all()
    serializer_class = CakeSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


# Create your views here.
