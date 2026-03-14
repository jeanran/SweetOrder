import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from base.models import User

user = User(
    name='Admin',
    email='admin@example.com',
    password='password123',  
    role='admin'
)
user.save()

print('Admin user created successfully!')
print('Email: admin@example.com')
print('Password: password123')