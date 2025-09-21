#!/usr/bin/env python3
"""
Test database connection with the current credentials
"""
import os
import django
from django.conf import settings

# Set environment variables for testing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_free')
os.environ.setdefault('DB_HOST', 'sql12.freesqldatabase.com')
os.environ.setdefault('DB_NAME', 'sql12799492')
os.environ.setdefault('DB_USER', 'sql12799492')
os.environ.setdefault('DB_PASSWORD', 'JKySVMa5nV')
os.environ.setdefault('DB_PORT', '3306')

# Setup Django
django.setup()

from django.db import connection

try:
    print("Testing database connection...")
    print(f"Database settings: {settings.DATABASES['default']}")
    
    # Test the connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print(f"✅ Database connection successful! Result: {result}")
        
    # Test if we can create tables (migrations)
    from django.core.management import execute_from_command_line
    print("Testing migrations...")
    execute_from_command_line(['manage.py', 'showmigrations'])
    
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print(f"Error type: {type(e).__name__}")