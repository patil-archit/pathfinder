from django.http import JsonResponse
from django.urls import path

def health_check(request):
    return JsonResponse({'status': 'healthy', 'service': 'PathFinder AI Career Advisor'})

urlpatterns = [
    path('api/health/', health_check, name='health_check'),
]