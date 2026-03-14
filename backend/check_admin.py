import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import User

# Check admin user
try:
    user = User.objects.get(email='admin@example.com')
    print(f'User found: {user.name}, email: {user.email}, role: {user.role}')
    print(f'Password check: {user.check_password("password123")}')
except User.DoesNotExist:
    print('Admin user not found')