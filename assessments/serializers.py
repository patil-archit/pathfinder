from rest_framework import serializers
from .models import (
    AssessmentSession, AssessmentQuestion, AssessmentResult,
    CareerRecommendationHistory, AssessmentFeedback
)
from django.contrib.auth.models import User


class AssessmentQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentQuestion
        fields = [
            'id', 'question_number', 'question_text', 'question_type',
            'options', 'user_answer', 'answer_metadata',
            'presented_at', 'answered_at', 'response_time_seconds',
            'ai_generated'
        ]
        read_only_fields = ['id', 'presented_at', 'response_time_seconds']


class CareerRecommendationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerRecommendationHistory
        fields = [
            'id', 'career_title', 'match_percentage', 'description',
            'required_skills', 'salary_range', 'growth_potential',
            'viewed', 'clicked_roadmap', 'saved_by_user',
            'user_rating', 'user_notes', 'industry',
            'experience_level', 'education_requirements'
        ]


class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = [
            'id', 'top_career_matches', 'skill_gaps', 'recommended_skills',
            'work_style_preference', 'team_preference', 'leadership_style',
            'motivation_factors', 'technical_affinity', 'creative_affinity',
            'analytical_affinity', 'interpersonal_affinity',
            'ai_analysis', 'confidence_score'
        ]


class AssessmentSessionSerializer(serializers.ModelSerializer):
    questions = AssessmentQuestionSerializer(many=True, read_only=True)
    career_recommendations = CareerRecommendationHistorySerializer(many=True, read_only=True)
    result = AssessmentResultSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AssessmentSession
        fields = [
            'id', 'session_id', 'username', 'session_type', 'status',
            'started_at', 'completed_at', 'total_questions',
            'questions_answered', 'recommendations', 'ai_confidence_score',
            'duration_seconds', 'created_at', 'updated_at',
            'questions', 'career_recommendations', 'result'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'duration_seconds',
            'username'
        ]


class AssessmentSessionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing sessions"""
    username = serializers.CharField(source='user.username', read_only=True)
    recommendation_count = serializers.IntegerField(
        source='career_recommendations.count',
        read_only=True
    )
    
    class Meta:
        model = AssessmentSession
        fields = [
            'id', 'session_id', 'username', 'session_type', 'status',
            'started_at', 'completed_at', 'total_questions',
            'questions_answered', 'ai_confidence_score',
            'duration_seconds', 'recommendation_count', 'created_at'
        ]


class StartAssessmentSerializer(serializers.Serializer):
    """Serializer for starting a new assessment"""
    session_type = serializers.ChoiceField(
        choices=['ai_powered', 'standard', 'quick'],
        default='ai_powered'
    )
    include_personality = serializers.BooleanField(default=True)
    include_skills = serializers.BooleanField(default=True)
    include_interests = serializers.BooleanField(default=True)


class SaveQuestionAnswerSerializer(serializers.Serializer):
    """Serializer for saving a question answer"""
    session_id = serializers.CharField()
    question_number = serializers.IntegerField()
    question_text = serializers.CharField()
    question_type = serializers.CharField(default='multiple_choice')
    options = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    user_answer = serializers.CharField()
    answer_metadata = serializers.JSONField(required=False, default=dict)


class CompleteAssessmentSerializer(serializers.Serializer):
    """Serializer for completing an assessment"""
    session_id = serializers.CharField()
    recommendations = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )
    ai_confidence_score = serializers.FloatField(required=False)


class AssessmentFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentFeedback
        fields = [
            'id', 'overall_rating', 'accuracy_rating', 'usefulness_rating',
            'feedback_text', 'would_recommend', 'questions_relevant',
            'recommendations_helpful', 'assessment_too_long', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
