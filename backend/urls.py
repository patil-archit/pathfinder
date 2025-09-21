from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse
from users.views import UserProfileViewSet, register_user, login_user, get_user_profile
from users.social_auth_views import (
    social_auth_success, get_social_login_urls, 
    connect_social_account, disconnect_social_account
)
from recommendations.views import (
    RecommendationViewSet, CareerPathViewSet, UserCareerProgressViewSet,
    generate_ai_recommendations, get_user_insights
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')
router.register(r'career-paths', CareerPathViewSet, basename='careerpath')
router.register(r'career-progress', UserCareerProgressViewSet, basename='careerprogress')

def health_check(request):
    return JsonResponse({'status': 'healthy', 'service': 'PathFinder AI Career Advisor'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/assessments/', include('assessments.urls')),
    path('api/health/', health_check, name='health_check'),
]


urlpatterns += [
    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Authentication endpoints
    path('api/auth/register/', register_user, name='api_register'),
    path('api/auth/login/', login_user, name='api_login'),
    path('api/auth/profile/', get_user_profile, name='api_user_profile'),
    
    # Social Authentication API endpoints
    path('api/auth/social/urls/', get_social_login_urls, name='social_login_urls'),
    path('api/auth/social/success/', social_auth_success, name='social_auth_success'),
    path('api/auth/social/connect/', connect_social_account, name='connect_social_account'),
    path('api/auth/social/disconnect/', disconnect_social_account, name='disconnect_social_account'),
    
    # AI recommendations and insights
    path('api/generate-recommendations/', generate_ai_recommendations, name='generate_recommendations'),
    path('api/insights/', get_user_insights, name='user_insights'),
    
    # Django Allauth URLs (for traditional web authentication)
    path('accounts/', include('allauth.urls')),
]
