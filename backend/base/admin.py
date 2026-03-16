from django.contrib import admin
from .models import User, Product, Cart, Order, OrderDetail


# ─── USER ─────────────────────────────────────────────────────

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display    = ['user_id', 'name', 'email', 'role', 'created_at']
    list_filter     = ['role']
    search_fields   = ['name', 'email']
    ordering        = ['-created_at']
    readonly_fields = ['user_id', 'created_at']

    fieldsets = (
        ('Account Info', {
            'fields': ('user_id', 'name', 'email', 'role', 'created_at')
        }),
        ('Security', {
            'fields': ('password',),
            'classes': ('collapse',),
        }),
    )


# ─── PRODUCT ──────────────────────────────────────────────────

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ['product_id', 'product_name', 'category',
                      'price', 'stock', 'is_available', 'image_preview']
    list_filter    = ['category', 'is_available']
    search_fields  = ['product_name', 'description']
    ordering       = ['-product_id']
    list_editable  = ['price', 'stock', 'is_available']

   
    readonly_fields = ['image_preview']

    def get_fields(self, request, obj=None):
       
        base = [
            'product_name', 'description', 'category',
            'price', 'stock', 'is_available', 'image',
        ]
        if obj and obj.image:
            base.insert(base.index('image'), 'image_preview')
        return base

    def image_preview(self, obj):
        from django.utils.html import format_html
        if obj and obj.image:
            return format_html(
                '<img src="{}" style="max-height:200px; border-radius:8px;"/>',
                obj.image.url
            )
        return 'No image yet'
    image_preview.short_description = 'Current Image'


# ─── ORDER DETAIL INLINE ──────────────────────────────────────

class OrderDetailInline(admin.TabularInline):
    model           = OrderDetail
    extra           = 0
    readonly_fields = ['product', 'quantity', 'price', 'subtotal_display']
    can_delete      = False

    def subtotal_display(self, obj):
        return f'₱{obj.subtotal:.2f}'
    subtotal_display.short_description = 'Subtotal'


# ─── ORDER ────────────────────────────────────────────────────

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display    = ['order_id', 'user', 'status', 'total_amount', 'order_date']
    list_filter     = ['status', 'order_date']
    search_fields   = ['user__name', 'user__email', 'delivery_address']
    ordering        = ['-order_date']
    readonly_fields = ['order_id', 'order_date', 'user', 'total_amount']
    list_editable   = ['status']
    inlines         = [OrderDetailInline]

    fieldsets = (
        ('Order Info', {
            'fields': ('order_id', 'user', 'order_date', 'status')
        }),
        ('Delivery & Payment', {
            'fields': ('delivery_address', 'total_amount')
        }),
    )


# ─── CART ─────────────────────────────────────────────────────

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display    = ['cart_id', 'user', 'product', 'quantity',
                       'subtotal_display', 'added_at']
    list_filter     = ['added_at']
    search_fields   = ['user__name', 'user__email', 'product__product_name']
    ordering        = ['-added_at']
    readonly_fields = ['cart_id', 'added_at', 'subtotal_display']

    def subtotal_display(self, obj):
        return f'₱{obj.subtotal:.2f}'
    subtotal_display.short_description = 'Subtotal'


# ─── ORDER DETAIL ─────────────────────────────────────────────

@admin.register(OrderDetail)
class OrderDetailAdmin(admin.ModelAdmin):
    list_display    = ['order_detail_id', 'order', 'product',
                       'quantity', 'price', 'subtotal_display']
    search_fields   = ['order__order_id', 'product__product_name']
    ordering        = ['order']
    readonly_fields = ['order_detail_id', 'subtotal_display']

    def subtotal_display(self, obj):
        return f'₱{obj.subtotal:.2f}'
    subtotal_display.short_description = 'Subtotal'