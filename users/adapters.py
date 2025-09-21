from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter
from django.http import JsonResponse, HttpResponseRedirect
from django.conf import settings
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import UserProfile
import json


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Custom adapter to handle social authentication for API usage
    """
    
    def is_open_for_signup(self, request, sociallogin):
        """
        Allow signup for all social accounts
        """
        return True
    
    def save_user(self, request, sociallogin, form=None):
        """
        Save user and create profile
        """
        user = super().save_user(request, sociallogin, form)
        
        # Create user profile if it doesn't exist
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        return user
    
    def get_login_redirect_url(self, request):
        """
        Redirect to frontend after successful social login
        """
        # Check if this is an API request
        if request.META.get('HTTP_ACCEPT', '').startswith('application/json'):
            # Generate JWT tokens for API usage
            refresh = RefreshToken.for_user(request.user)
            tokens = {
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }
            
            # Get user profile
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            
            response_data = {
                'success': True,
                'message': 'Social authentication successful',
                'user': {
                    'id': request.user.id,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                },
                'tokens': tokens,
                'profile_completion': profile.profile_completion,
                'is_new_user': created
            }
            
            return JsonResponse(response_data)
        
        # For web requests, redirect to frontend with tokens
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(request.user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        # Redirect to frontend with tokens as URL parameters
        redirect_url = f"{frontend_url}/auth/callback?access_token={access_token}&refresh_token={refresh_token}"
        
        return redirect_url
    
    def get_signup_redirect_url(self, request):
        """
        Redirect after successful social signup
        """
        return self.get_login_redirect_url(request)


class CustomAccountAdapter(DefaultAccountAdapter):
    """
    Custom adapter for regular account operations
    """
    
    def is_open_for_signup(self, request):
        """
        Allow signup for regular accounts
        """
        return True
    
    def save_user(self, request, user, form, commit=True):
        """
        Save user and create profile
        """
        user = super().save_user(request, user, form, commit)
        
        if commit:
            # Create user profile
            profile, created = UserProfile.objects.get_or_create(user=user)
        
        return user
    
    def get_login_redirect_url(self, request):
        """
        Redirect after successful login
        """
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        return f"{frontend_url}/dashboard"
    
    def get_logout_redirect_url(self, request):
        """
        Redirect after logout
        """
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        return frontend_url
