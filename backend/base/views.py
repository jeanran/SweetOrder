from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import User, Product, Cart, Order, OrderDetail
from .serializers import (
    RegisterSerializer, ProductSerializer,
    CartSerializer, OrderSerializer
)


# ─── REGISTER ─────────────────────────────────────────────────

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Registration successful.',
            'user': {
                'user_id': user.user_id,
                'name':    user.name,
                'email':   user.email,
                'role':    user.role,
            }
        }, status=status.HTTP_201_CREATED)

    errors      = serializer.errors
    first_error = next(iter(errors.values()))[0]
    return Response({'error': str(first_error)}, status=status.HTTP_400_BAD_REQUEST)


# ─── LOGIN ────────────────────────────────────────────────────

@api_view(['POST'])
def login(request):
    email    = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.check_password(password):
        return Response(
            {'error': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    request.session['user_id']   = user.user_id
    request.session['user_name'] = user.name
    request.session['user_role'] = user.role

    return Response({
        'message': 'Login successful.',
        'user': {
            'user_id': user.user_id,
            'name':    user.name,
            'email':   user.email,
            'role':    user.role,
        }
    }, status=status.HTTP_200_OK)


# ─── LOGOUT ───────────────────────────────────────────────────

@api_view(['POST'])
def logout(request):
    request.session.flush()
    return Response({'message': 'Logged out successfully.'})


# ─── PROFILE ──────────────────────────────────────────────────

@api_view(['PATCH', 'DELETE'])
def profile(request):
    user_id = request.session.get('user_id') or request.data.get('user_id')

    if not user_id:
        return Response(
            {'error': 'Login required.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'PATCH':
        if 'name'     in request.data: user.name     = request.data['name']
        if 'email'    in request.data: user.email    = request.data['email']
        if 'password' in request.data: user.password = request.data['password']
        user.save()
        return Response({
            'message': 'Profile updated.',
            'user': {
                'user_id': user.user_id,
                'name':    user.name,
                'email':   user.email,
                'role':    user.role,
            }
        })

    if request.method == 'DELETE':
        user.delete()
        request.session.flush()
        return Response({'message': 'Account deleted.'})


# ─── PRODUCTS (public) ────────────────────────────────────────

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class   = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_available=True)
        search   = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        if search:
            queryset = queryset.filter(product_name__icontains=search)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


# ─── CART ─────────────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class CartViewSet(viewsets.ModelViewSet):
    serializer_class   = CartSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = (
            self.request.session.get('user_id') or
            self.request.query_params.get('user_id')
        )
        if not user_id:
            return Cart.objects.none()
        return Cart.objects.filter(user_id=user_id).select_related('product')

    def create(self, request, *args, **kwargs):
        user_id    = request.session.get('user_id') or request.data.get('user_id')
        product_id = request.data.get('product_id')
        quantity   = int(request.data.get('quantity', 1))

        if not user_id:
            return Response(
                {'error': 'Login required.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            product = Product.objects.get(product_id=product_id, is_available=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if product.stock < quantity:
            return Response(
                {'error': 'Not enough stock.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item, created = Cart.objects.get_or_create(
            user_id=user_id,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response({
            'message':  'Item added to cart.',
            'cart_id':  cart_item.cart_id,
            'quantity': cart_item.quantity,
            'subtotal': str(cart_item.subtotal),
        }, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        user_id = request.session.get('user_id') or request.data.get('user_id')

        if not user_id:
            return Response(
                {'error': 'Login required.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            cart_item = Cart.objects.get(cart_id=kwargs['pk'], user_id=user_id)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart item not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        new_quantity = request.data.get('quantity')
        if new_quantity is not None:
            cart_item.quantity = int(new_quantity)
            cart_item.save()

        return Response({
            'message':  'Quantity updated.',
            'cart_id':  cart_item.cart_id,
            'quantity': cart_item.quantity,
            'subtotal': str(cart_item.subtotal),
        })

    def destroy(self, request, *args, **kwargs):
        user_id = (
            request.session.get('user_id') or
            request.data.get('user_id') or
            request.query_params.get('user_id')
        )

        if not user_id:
            return Response(
                {'error': 'Login required.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            cart_item = Cart.objects.get(cart_id=kwargs['pk'], user_id=user_id)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart item not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.delete()
        return Response({'message': 'Item removed from cart.'})


# ─── CHECKOUT ─────────────────────────────────────────────────

@api_view(['POST'])
def checkout(request):
    user_id = request.session.get('user_id') or request.data.get('user_id')

    if not user_id:
        return Response(
            {'error': 'Login required.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    address = request.data.get('delivery_address', '').strip()
    if not address:
        return Response(
            {'error': 'Delivery address is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    cart_items = Cart.objects.filter(user_id=user_id).select_related('product')
    if not cart_items.exists():
        return Response(
            {'error': 'Your cart is empty.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    order = Order.objects.create(
        user_id=user_id,
        total_amount=0,
        status='pending',
        delivery_address=address
    )

    total = 0
    for item in cart_items:
        price = item.product.price
        OrderDetail.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=price
        )
        total += price * item.quantity

    order.total_amount = total
    order.save()
    Cart.clear_cart(user_id)

    return Response({
        'message':  'Order placed successfully.',
        'order_id': order.order_id,
        'total':    str(total),
    }, status=status.HTTP_201_CREATED)


# ─── USER ORDERS ──────────────────────────────────────────────

@api_view(['GET'])
def user_orders(request):
    user_id = request.session.get('user_id') or request.query_params.get('user_id')

    if not user_id:
        return Response(
            {'error': 'Login required.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    orders = Order.objects.filter(
        user_id=user_id
    ).prefetch_related(
        'order_details__product'
    ).order_by('-order_date')

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# ─── ADMIN ORDERS ─────────────────────────────────────────────

@api_view(['GET'])
def admin_orders(request):
    user_id = (
        request.session.get('user_id') or
        request.query_params.get('user_id')
    )

    try:
        admin = User.objects.get(user_id=user_id)
        if admin.role != 'admin':
            return Response({'error': 'Admin only.'}, status=403)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized.'}, status=401)

    orders = Order.objects.all().select_related('user').prefetch_related(
        'order_details__product'
    ).order_by('-order_date')

    data = [{
        'order_id':         o.order_id,
        'user_id':          o.user_id,
        'user_name':        o.user.name,
        'order_date':       o.order_date,
        'total_amount':     str(o.total_amount),
        'status':           o.status,
        'delivery_address': o.delivery_address,
        'order_details': [{
            'order_detail_id': d.order_detail_id,
            'product_name':    d.product.product_name,
            'quantity':        d.quantity,
            'price':           str(d.price),
            'subtotal':        str(d.subtotal),
        } for d in o.order_details.all()]
    } for o in orders]

    return Response(data)


@api_view(['PATCH'])
def admin_order_update(request, order_id):
    user_id = (
        request.session.get('user_id') or
        request.data.get('user_id') or
        request.query_params.get('user_id')
    )

    try:
        admin = User.objects.get(user_id=user_id)
        if admin.role != 'admin':
            return Response({'error': 'Admin only.'}, status=403)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized.'}, status=401)

    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=404)

    new_status = request.data.get('status')
    valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if new_status not in valid:
        return Response({'error': 'Invalid status.'}, status=400)

    order.status = new_status
    order.save()

    return Response({
        'message':  'Status updated.',
        'order_id': order.order_id,
        'status':   order.status,
    })


# ─── ADMIN USERS ──────────────────────────────────────────────

@api_view(['GET'])
def admin_users(request):
    user_id = (
        request.session.get('user_id') or
        request.query_params.get('user_id')
    )

    try:
        admin = User.objects.get(user_id=user_id)
        if admin.role != 'admin':
            return Response({'error': 'Admin only.'}, status=403)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized.'}, status=401)

    users = User.objects.filter(role='customer').order_by('-created_at')
    data  = [{
        'user_id':    u.user_id,
        'name':       u.name,
        'email':      u.email,
        'role':       u.role,
        'created_at': u.created_at,
    } for u in users]

    return Response(data)


@api_view(['DELETE'])
def admin_user_detail(request, target_id):
    user_id = (
        request.session.get('user_id') or
        request.data.get('user_id')
    )

    try:
        admin = User.objects.get(user_id=user_id)
        if admin.role != 'admin':
            return Response({'error': 'Admin only.'}, status=403)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized.'}, status=401)

    try:
        user = User.objects.get(user_id=target_id)
        user.delete()
        return Response({'message': 'User deleted.'})
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)


# ─── ADMIN PRODUCTS ───────────────────────────────────────────
@api_view(['GET', 'POST'])
def admin_products(request):
    user_id = (
        request.session.get('user_id') or
        request.data.get('user_id') or
        request.query_params.get('user_id')
    )
    try:
        user_id = int(str(user_id).strip())
    except (ValueError, TypeError):
        return Response({'error': 'Invalid user_id.'}, status=400)

    try:
        admin = User.objects.get(user_id=user_id)
        if admin.role != 'admin':
            return Response({'error': 'Admin only.'}, status=403)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized.'}, status=401)

    if request.method == 'GET':
        products   = Product.objects.all().order_by('-product_id')
        serializer = ProductSerializer(
            products, many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    if request.method == 'POST':
        
        try:
            product = Product.objects.create(
                product_name = request.data.get('product_name'),
                description  = request.data.get('description', ''),
                category     = request.data.get('category', 'birthday'),
                price        = request.data.get('price'),
                stock        = int(request.data.get('stock', 10)),
                is_available = request.data.get('is_available') in
                               [True, 'true', 'True', '1', 1],
            )
            # ✅ save image separately from FILES
            if 'image' in request.FILES:
                product.image = request.FILES['image']
                product.save()

            image_url = None
            if product.image:
                image_url = request.build_absolute_uri(product.image.url)

            return Response({
                'product_id':   product.product_id,
                'product_name': product.product_name,
                'description':  product.description,
                'category':     product.category,
                'price':        str(product.price),
                'stock':        product.stock,
                'is_available': product.is_available,
                'image_url':    image_url,
            }, status=201)

        except Exception as e:
            return Response({'error': str(e)}, status=400)
        
@api_view(['PATCH', 'DELETE'])
def admin_product_detail(request, product_id):
    user_id = (
        request.session.get('user_id') or
        request.data.get('user_id') or
        request.query_params.get('user_id')
    )
    try:
        user_id = int(str(user_id).strip())
    except (ValueError, TypeError):
        return Response({'error': 'Invalid user_id.'}, status=400)

    try:
        admin = User.objects.get(user_id=user_id)
        if admin.role != 'admin':
            return Response({'error': 'Admin only.'}, status=403)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized.'}, status=401)

    try:
        product = Product.objects.get(product_id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=404)

    if request.method == 'PATCH':
        if 'product_name' in request.data:
            product.product_name = request.data['product_name']
        if 'description' in request.data:
            product.description  = request.data['description']
        if 'category' in request.data:
            product.category     = request.data['category']
        if 'price' in request.data:
            product.price        = request.data['price']
        if 'stock' in request.data:
            product.stock        = int(request.data['stock'])
        if 'is_available' in request.data:
            val = request.data['is_available']
            product.is_available = val in [True, 'true', 'True', '1', 1]

        
        if 'image' in request.FILES:
            product.image = request.FILES['image']

        product.save()

        image_url = None
        if product.image:
            image_url = request.build_absolute_uri(product.image.url)

        return Response({
            'product_id':   product.product_id,
            'product_name': product.product_name,
            'description':  product.description,
            'category':     product.category,
            'price':        str(product.price),
            'stock':        product.stock,
            'is_available': product.is_available,
            'image_url':    image_url,   
        })

    if request.method == 'DELETE':
        product.delete()
        return Response({'message': 'Product deleted.'})

