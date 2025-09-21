"""
Production settings for PathFinder AI Career Advisor
Optimized for Railway deployment with PostgreSQL
"""

from .settings import *
import os
import dj_database_url

# SECURITY WARNING: Use environment variable for secret key in production
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-&#5)&+hxwb*@6-*4%@pkj-mhn2y-7cp_=!3qzp^!08mz@mw&^i')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# Production hosts
ALLOWED_HOSTS = [
    '.railway.app',  # Railway domains
    '.up.railway.app',  # Railway preview deployments
    'localhost',
    '127.0.0.1',
]

# Add your custom domain when you have one
if os.getenv('CUSTOM_DOMAIN'):
    ALLOWED_HOSTS.append(os.getenv('CUSTOM_DOMAIN'))

# Database - Support both MySQL and PostgreSQL for production
if os.getenv('DATABASE_URL'):
    # Parse DATABASE_URL (works for both MySQL and PostgreSQL)
    DATABASES = {
        'default': dj_database_url.parse(os.getenv('DATABASE_URL'))
    }
else:
    # Use MySQL by default (your current setup)
    db_engine = os.getenv('DB_ENGINE', 'django.db.backends.mysql')
    DATABASES = {
        'default': {
            'ENGINE': db_engine,
            'NAME': os.getenv('DB_NAME', 'career_pathfinder'),
            'USER': os.getenv('DB_USER', 'root'),
            'PASSWORD': os.getenv('DB_PASSWORD'),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '3306' if 'mysql' in db_engine else '5432'),
            'OPTIONS': {
                'charset': 'utf8mb4',
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            } if 'mysql' in db_engine else {},
        }
    }

# Static files configuration for production
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# CORS settings for production
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    os.getenv('FRONTEND_URL', 'http://localhost:3000'),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

# Add your frontend domain when deployed
if os.getenv('FRONTEND_DOMAIN'):
    CORS_ALLOWED_ORIGINS.append(f"https://{os.getenv('FRONTEND_DOMAIN')}")

CORS_ALLOW_CREDENTIALS = True

# Update redirect URLs for production
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
LOGIN_REDIRECT_URL = f'{FRONTEND_URL}/dashboard'
ACCOUNT_LOGOUT_REDIRECT_URL = f'{FRONTEND_URL}/'

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}

# Email configuration (optional)
if os.getenv('EMAIL_HOST'):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
    EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
    DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@pathfinder.ai')

# Cache configuration (optional)
if os.getenv('REDIS_URL'):
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': os.getenv('REDIS_URL'),
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            }
        }
    }

# AI Service Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
GOOGLE_AI_API_KEY = os.getenv('GOOGLE_AI_API_KEY')