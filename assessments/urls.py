from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AssessmentSessionViewSet,
    AssessmentHistoryViewSet,
    CareerRecommendationViewSet
)

router = DefaultRouter()
router.register(r'sessions', AssessmentSessionViewSet, basename='assessment-session')
router.register(r'history', AssessmentHistoryViewSet, basename='assessment-history')
router.register(r'recommendations', CareerRecommendationViewSet, basename='career-recommendation')

urlpatterns = [
    path('', include(router.urls)),
]
