from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Avg, Q
import uuid

from .models import (
    AssessmentSession, AssessmentQuestion, AssessmentResult,
    CareerRecommendationHistory, AssessmentFeedback
)
from .serializers import (
    AssessmentSessionSerializer, AssessmentSessionListSerializer,
    AssessmentQuestionSerializer, AssessmentResultSerializer,
    CareerRecommendationHistorySerializer, AssessmentFeedbackSerializer,
    StartAssessmentSerializer, SaveQuestionAnswerSerializer,
    CompleteAssessmentSerializer
)


class AssessmentSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing assessment sessions
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = AssessmentSession.objects.filter(user=self.request.user)
        
        # Filter by status if provided
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by session type
        type_filter = self.request.query_params.get('session_type', None)
        if type_filter:
            queryset = queryset.filter(session_type=type_filter)
        
        # Add counts for optimization
        queryset = queryset.annotate(
            question_count=Count('questions'),
            recommendation_count=Count('career_recommendations')
        )
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AssessmentSessionListSerializer
        return AssessmentSessionSerializer
    
    @action(detail=False, methods=['post'])
    def start(self, request):
        """Start a new assessment session"""
        serializer = StartAssessmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create new session
        session = AssessmentSession.objects.create(
            user=request.user,
            session_id=str(uuid.uuid4()),
            session_type=serializer.validated_data.get('session_type', 'ai_powered'),
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        return Response({
            'success': True,
            'session_id': session.session_id,
            'session_type': session.session_type,
            'message': 'Assessment session started successfully'
        })
    
    @action(detail=False, methods=['post'])
    def save_answer(self, request):
        """Save an answer to a question"""
        serializer = SaveQuestionAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Get or create session
        session = get_object_or_404(
            AssessmentSession,
            session_id=data['session_id'],
            user=request.user
        )
        
        # Create or update question
        question, created = AssessmentQuestion.objects.update_or_create(
            session=session,
            question_number=data['question_number'],
            defaults={
                'question_text': data['question_text'],
                'question_type': data.get('question_type', 'multiple_choice'),
                'options': data.get('options', []),
                'user_answer': data['user_answer'],
                'answer_metadata': data.get('answer_metadata', {}),
                'answered_at': timezone.now()
            }
        )
        
        # Update session progress
        session.questions_answered = AssessmentQuestion.objects.filter(
            session=session,
            user_answer__isnull=False
        ).count()
        session.save(update_fields=['questions_answered'])
        
        return Response({
            'success': True,
            'message': 'Answer saved successfully',
            'question_id': question.id,
            'questions_answered': session.questions_answered
        })
    
    @action(detail=False, methods=['post'])
    def complete(self, request):
        """Complete an assessment session"""
        serializer = CompleteAssessmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Get session
        session = get_object_or_404(
            AssessmentSession,
            session_id=data['session_id'],
            user=request.user
        )
        
        # Save recommendations if provided
        if 'recommendations' in data and data['recommendations']:
            session.recommendations = data['recommendations']
            
            # Also save to CareerRecommendationHistory
            for rec in data['recommendations']:
                CareerRecommendationHistory.objects.create(
                    session=session,
                    career_title=rec.get('title', ''),
                    match_percentage=rec.get('match_percentage', 0),
                    description=rec.get('description', ''),
                    required_skills=rec.get('required_skills', []),
                    salary_range=rec.get('salary_range', ''),
                    growth_potential=rec.get('growth_potential', '')
                )
        
        # Update confidence score if provided
        if 'ai_confidence_score' in data:
            session.ai_confidence_score = data['ai_confidence_score']
        
        # Mark as completed
        session.mark_completed()
        
        # Create result summary
        result, created = AssessmentResult.objects.get_or_create(
            session=session,
            defaults={
                'top_career_matches': data.get('recommendations', [])[:3],
                'confidence_score': data.get('ai_confidence_score', 0.8)
            }
        )
        
        return Response({
            'success': True,
            'message': 'Assessment completed successfully',
            'session_id': session.session_id,
            'duration_seconds': session.duration_seconds,
            'total_questions': session.questions.count(),
            'recommendations_count': session.career_recommendations.count()
        })
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Get detailed history of a specific assessment"""
        session = self.get_object()
        serializer = AssessmentSessionSerializer(session)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get user's assessment statistics"""
        sessions = AssessmentSession.objects.filter(user=request.user)
        
        stats = {
            'total_assessments': sessions.count(),
            'completed_assessments': sessions.filter(status='completed').count(),
            'in_progress_assessments': sessions.filter(status='in_progress').count(),
            'average_duration': sessions.filter(
                status='completed',
                duration_seconds__isnull=False
            ).aggregate(Avg('duration_seconds'))['duration_seconds__avg'],
            'total_recommendations': CareerRecommendationHistory.objects.filter(
                session__user=request.user
            ).count(),
            'most_recent_assessment': None
        }
        
        # Get most recent assessment
        recent = sessions.order_by('-created_at').first()
        if recent:
            stats['most_recent_assessment'] = {
                'id': recent.id,
                'session_id': recent.session_id,
                'date': recent.created_at,
                'status': recent.status,
                'type': recent.session_type
            }
        
        return Response(stats)
    
    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class AssessmentHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing assessment history
    """
    serializer_class = AssessmentSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AssessmentSession.objects.filter(
            user=self.request.user,
            status='completed'
        ).prefetch_related(
            'questions',
            'career_recommendations',
            'result'
        ).order_by('-completed_at')
    
    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        """Get recommendations from a specific assessment"""
        session = self.get_object()
        recommendations = session.career_recommendations.all()
        serializer = CareerRecommendationHistorySerializer(
            recommendations, many=True
        )
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def feedback(self, request, pk=None):
        """Submit feedback for an assessment"""
        session = self.get_object()
        
        # Check if feedback already exists
        if hasattr(session, 'feedback'):
            return Response(
                {'error': 'Feedback already submitted for this assessment'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = AssessmentFeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        feedback = serializer.save(
            session=session,
            user=request.user
        )
        
        return Response({
            'success': True,
            'message': 'Thank you for your feedback!',
            'feedback_id': feedback.id
        })


class CareerRecommendationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing career recommendations from assessments
    """
    serializer_class = CareerRecommendationHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CareerRecommendationHistory.objects.filter(
            session__user=self.request.user
        ).select_related('session')
    
    @action(detail=True, methods=['post'])
    def mark_viewed(self, request, pk=None):
        """Mark a recommendation as viewed"""
        recommendation = self.get_object()
        recommendation.viewed = True
        recommendation.save(update_fields=['viewed'])
        return Response({'success': True})
    
    @action(detail=True, methods=['post'])
    def mark_roadmap_clicked(self, request, pk=None):
        """Mark that user clicked to view roadmap"""
        recommendation = self.get_object()
        recommendation.clicked_roadmap = True
        recommendation.save(update_fields=['clicked_roadmap'])
        return Response({'success': True})
    
    @action(detail=True, methods=['post'])
    def toggle_saved(self, request, pk=None):
        """Toggle saved status of a recommendation"""
        recommendation = self.get_object()
        recommendation.saved_by_user = not recommendation.saved_by_user
        recommendation.save(update_fields=['saved_by_user'])
        return Response({
            'success': True,
            'saved': recommendation.saved_by_user
        })
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate a recommendation"""
        recommendation = self.get_object()
        rating = request.data.get('rating')
        
        if not rating or not (1 <= int(rating) <= 5):
            return Response(
                {'error': 'Rating must be between 1 and 5'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recommendation.user_rating = int(rating)
        recommendation.save(update_fields=['user_rating'])
        return Response({'success': True, 'rating': recommendation.user_rating})
    
    @action(detail=True, methods=['post'])
    def add_notes(self, request, pk=None):
        """Add notes to a recommendation"""
        recommendation = self.get_object()
        notes = request.data.get('notes', '')
        
        recommendation.user_notes = notes
        recommendation.save(update_fields=['user_notes'])
        return Response({'success': True})
