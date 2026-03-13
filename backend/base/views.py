from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Product
from .serializers import RegisterSerializer, LoginSerializer, ProductSerializer

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Registration successful',
            'user': {
                'user_id': user.user_id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email)
        
        if user.check_password(password):
            return Response({
                'message': 'Login successful',
                'user': {
                    'user_id': user.user_id,
                    'name': user.name,
                    'email': user.email,
                    'role': user.role
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid password'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def logout(request):
    return Response({
        'message': 'Logged out successfully'
    })

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer