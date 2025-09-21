from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
import json

from .models import Recommendation, CareerPath, UserCareerProgress
from .serializers import (
    RecommendationSerializer, CareerPathSerializer, 
    UserCareerProgressSerializer, RecommendationFeedbackSerializer
)
from users.models import UserProfile

class RecommendationViewSet(viewsets.ModelViewSet):
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Recommendation.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def feedback(self, request, pk=None):
        """Update recommendation feedback"""
        recommendation = self.get_object()
        serializer = RecommendationFeedbackSerializer(
            recommendation, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark recommendation as read"""
        recommendation = self.get_object()
        recommendation.is_read = True
        recommendation.save()
        return Response({'status': 'marked as read'})

class CareerPathViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CareerPath.objects.all()
    serializer_class = CareerPathSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = CareerPath.objects.all()
        industry = self.request.query_params.get('industry')
        if industry:
            queryset = queryset.filter(industry=industry)
        return queryset

class UserCareerProgressViewSet(viewsets.ModelViewSet):
    serializer_class = UserCareerProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserCareerProgress.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_ai_recommendations(request):
    """Generate AI-powered career recommendations using Gemini AI"""
    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found. Please complete your profile first.'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        # Use Gemini AI for recommendations
        from .ai_service import CareerAdvisorAI
        
        ai_advisor = CareerAdvisorAI()
        ai_recommendations = ai_advisor.generate_career_recommendations(user_profile)
        
        # Save AI recommendations to database
        created_recommendations = []
        for rec_data in ai_recommendations:
            # Ensure content is properly structured
            content = {
                'description': rec_data.get('description', ''),
                'action_steps': rec_data.get('action_steps', []),
                'timeline': rec_data.get('timeline', ''),
                'resources': rec_data.get('resources', []),
                'expected_outcomes': rec_data.get('expected_outcomes', '')
            }
            
            recommendation = Recommendation.objects.create(
                user=request.user,
                recommendation_type=rec_data.get('type', 'career_path'),
                title=rec_data.get('title', 'Career Recommendation'),
                content=content,
                priority=rec_data.get('priority', 'medium'),
                ai_confidence_score=rec_data.get('confidence', 0.75)
            )
            created_recommendations.append(recommendation)
        
        # Update last assessment date
        user_profile.last_assessment_date = timezone.now()
        user_profile.save()
        
        serializer = RecommendationSerializer(created_recommendations, many=True)
        return Response({
            'message': f'Generated {len(created_recommendations)} AI-powered recommendations',
            'recommendations': serializer.data,
            'ai_powered': True
        })
        
    except Exception as e:
        # Fallback to mock recommendations if AI fails
        print(f"AI recommendation failed: {e}")
        mock_recommendations = generate_mock_recommendations(user_profile)
        
        created_recommendations = []
        for rec_data in mock_recommendations:
            recommendation = Recommendation.objects.create(
                user=request.user,
                recommendation_type=rec_data['type'],
                title=rec_data['title'],
                content=rec_data['content'],
                priority=rec_data['priority'],
                ai_confidence_score=rec_data['confidence']
            )
            created_recommendations.append(recommendation)
        
        serializer = RecommendationSerializer(created_recommendations, many=True)
        return Response({
            'message': f'Generated {len(created_recommendations)} recommendations (fallback mode)',
            'recommendations': serializer.data,
            'ai_powered': False,
            'note': 'AI service unavailable, using fallback recommendations'
        })

def generate_mock_recommendations(user_profile):
    """Generate mock AI recommendations based on user profile"""
    recommendations = []
    
    # Career path recommendation
    if user_profile.skills and user_profile.interests:
        recommendations.append({
            'type': 'career_path',
            'title': 'Recommended Career Path: Software Engineering',
            'content': {
                'description': 'Based on your technical skills and interests, software engineering offers excellent growth opportunities.',
                'next_steps': [
                    'Strengthen programming fundamentals',
                    'Build portfolio projects',
                    'Practice system design'
                ],
                'timeline': '6-12 months',
                'resources': [
                    'Online coding bootcamps',
                    'Open source contributions',
                    'Technical interview preparation'
                ]
            },
            'priority': 'high',
            'confidence': 0.85
        })
    
    # Skill development recommendation
    if user_profile.technical_skills_score and user_profile.technical_skills_score < 7:
        recommendations.append({
            'type': 'skill_development',
            'title': 'Improve Technical Skills',
            'content': {
                'description': 'Your technical skills assessment suggests room for improvement in core areas.',
                'focus_areas': [
                    'Programming languages',
                    'System architecture',
                    'Database design',
                    'Testing methodologies'
                ],
                'recommended_courses': [
                    'Advanced Python Programming',
                    'System Design Fundamentals',
                    'Database Management'
                ]
            },
            'priority': 'medium',
            'confidence': 0.75
        })
    
    # Industry insight
    if user_profile.preferred_industries:
        recommendations.append({
            'type': 'industry_insight',
            'title': 'Technology Industry Trends',
            'content': {
                'description': 'Current trends in your preferred industry sectors.',
                'trends': [
                    'AI/ML adoption accelerating',
                    'Remote work becoming standard',
                    'Cloud-native development growing',
                    'Cybersecurity skills in high demand'
                ],
                'opportunities': [
                    'AI/ML Engineer positions',
                    'DevOps and Cloud roles',
                    'Cybersecurity specialists'
                ]
            },
            'priority': 'low',
            'confidence': 0.70
        })
    
    return recommendations

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_insights(request):
    """Get personalized career insights for the user"""
    try:
        user_profile = UserProfile.objects.get(user=request.user)
        
        insights = {
            'profile_completion': user_profile.profile_completion,
            'skill_scores': {
                'technical': user_profile.technical_skills_score,
                'communication': user_profile.communication_score,
                'leadership': user_profile.leadership_score,
                'problem_solving': user_profile.problem_solving_score,
            },
            'recommendations_count': Recommendation.objects.filter(user=request.user).count(),
            'unread_recommendations': Recommendation.objects.filter(
                user=request.user, is_read=False
            ).count(),
            'career_progress': list(
                UserCareerProgress.objects.filter(user=request.user).values(
                    'career_path__name', 'progress_percentage'
                )
            ),
            'last_activity': user_profile.last_assessment_date,
        }
        
        return Response(insights)
        
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
