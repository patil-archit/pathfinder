from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
import re

from .models import UserProfile
from .serializers import UserProfileSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """API endpoint for user registration"""
    try:
        data = request.data
        email = data.get('email', '').strip().lower()
        password = data.get('password')
        password_confirm = data.get('password_confirm')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        
        # Validation
        errors = {}
        
        # Email validation
        if not email:
            errors['email'] = 'Email is required'
        elif not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            errors['email'] = 'Invalid email format'
        elif User.objects.filter(username=email).exists():
            errors['email'] = 'User with this email already exists'
        
        # Password validation
        if not password:
            errors['password'] = 'Password is required'
        elif len(password) < 8:
            errors['password'] = 'Password must be at least 8 characters long'
        elif password != password_confirm:
            errors['password_confirm'] = 'Passwords do not match'
        
        if errors:
            return Response({
                'success': False,
                'errors': errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        with transaction.atomic():
            user = User.objects.create_user(
                username=email,  # Use email as username
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Create user profile
            profile = UserProfile.objects.create(user=user)
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            return Response({
                'success': True,
                'message': 'Account created successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                },
                'profile_completion': profile.profile_completion
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """API endpoint for user login"""
    try:
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'success': False,
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate user (using email as username)
        user = authenticate(username=email, password=password)
        
        if user:
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Get or create profile
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                },
                'profile_completion': profile.profile_completion
            })
        else:
            return Response({
                'success': False,
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user profile information"""
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        return Response({
            'success': True,
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
            },
            'profile': {
                'skills': profile.skills,
                'interests': profile.interests,
                'goals': profile.goals,
                'education_level': profile.education_level,
                'field_of_study': profile.field_of_study,
                'experience_level': profile.experience_level,
                'current_role': profile.current_role,
                'primary_career_field': profile.primary_career_field,
                'preferred_work_style': profile.preferred_work_style,
                'salary_expectation': profile.salary_expectation,
                'career_stage': profile.career_stage,
                'profile_completion': profile.profile_completion,
                'last_assessment_date': profile.last_assessment_date,
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
