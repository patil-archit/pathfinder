from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db import transaction
from allauth.socialaccount.models import SocialAccount
from users.models import UserProfile
import json


@api_view(['POST'])
@permission_classes([AllowAny])
def social_auth_success(request):
    """
    Handle successful social authentication callback
    This endpoint will be called after successful OAuth with social providers
    """
    try:
        # Get user from request (set by social auth middleware)
        user = request.user
        
        if not user.is_authenticated:
            return Response({
                'success': False,
                'error': 'Authentication failed'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get or create user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Get social account info
        social_accounts = SocialAccount.objects.filter(user=user)
        social_data = []
        
        for social_account in social_accounts:
            social_data.append({
                'provider': social_account.provider,
                'uid': social_account.uid,
                'extra_data': social_account.extra_data
            })
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        return Response({
            'success': True,
            'message': 'Social authentication successful',
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
            'social_accounts': social_data,
            'profile_completion': profile.profile_completion,
            'is_new_user': created
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Social authentication failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_social_login_urls(request):
    """
    Get social login URLs for frontend
    """
    try:
        from django.urls import reverse
        from django.conf import settings
        
        base_url = request.build_absolute_uri('/')
        
        social_urls = {
            'google': f"{base_url}accounts/google/login/",
            'github': f"{base_url}accounts/github/login/",
            'linkedin': f"{base_url}accounts/linkedin_oauth2/login/",
        }
        
        return Response({
            'success': True,
            'social_urls': social_urls,
            'redirect_uri': f"{base_url}api/auth/social/success/"
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def connect_social_account(request):
    """
    Connect a social account to an existing user
    """
    try:
        provider = request.data.get('provider')
        access_token = request.data.get('access_token')
        
        if not provider or not access_token:
            return Response({
                'success': False,
                'error': 'Provider and access_token are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # This would require additional implementation based on the social provider
        # For now, return a placeholder response
        return Response({
            'success': False,
            'error': 'Social account connection not implemented yet'
        }, status=status.HTTP_501_NOT_IMPLEMENTED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def disconnect_social_account(request):
    """
    Disconnect a social account from user
    """
    try:
        provider = request.data.get('provider')
        
        if not provider:
            return Response({
                'success': False,
                'error': 'Provider is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        if not user.is_authenticated:
            return Response({
                'success': False,
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Remove social account
        try:
            social_account = SocialAccount.objects.get(user=user, provider=provider)
            social_account.delete()
            
            return Response({
                'success': True,
                'message': f'{provider.title()} account disconnected successfully'
            })
            
        except SocialAccount.DoesNotExist:
            return Response({
                'success': False,
                'error': f'No {provider} account found'
            }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
