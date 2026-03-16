from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class User(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('customer', 'Customer'),
    ]

    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith('pbkdf2_sha256'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.name} ({self.email})"

    class Meta:
        db_table = 'users'


class Product(models.Model):
    CATEGORY_CHOICES = [                            
        ('birthday', 'Birthday'),
        ('wedding', 'Wedding'),
        ('anniversary', 'Anniversary'),
        ('cupcake', 'Cupcake'),
        ('custom', 'Custom'),
    ]

    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)    

    def __str__(self):
        return self.product_name

    class Meta:
        db_table = 'products'


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_address = models.TextField()

    def recalculate_total(self):                        
        self.total_amount = sum(
            d.price * d.quantity for d in self.order_details.all()
        )
        self.save()

    def __str__(self):
        return f"Order #{self.order_id} by {self.user.name}"

    class Meta:
        db_table = 'orders'


class OrderDetail(models.Model):
    order_detail_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):                                
        return self.price * self.quantity

    def __str__(self):
        return f"Detail for Order #{self.order.order_id} — {self.product.product_name}"

    class Meta:
        db_table = 'order_details'


class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='in_carts')
    quantity = models.IntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True, null=True)
    @property
    def subtotal(self):                                 
        return self.product.price * self.quantity

    @classmethod
    def get_cart_total(cls, user):                     
        items = cls.objects.filter(user=user).select_related('product')
        return sum(item.subtotal for item in items)

    @classmethod
    def clear_cart(cls, user):                          
        cls.objects.filter(user=user).delete()

    def __str__(self):
        return f"Cart: {self.user.name} — {self.product.product_name} x{self.quantity}"

    class Meta:
        db_table = 'cart'
        unique_together = ['user', 'product']
        ordering = ['-added_at']                        