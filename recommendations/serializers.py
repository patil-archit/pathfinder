from rest_framework import serializers
from .models import Recommendation, CareerPath, UserCareerProgress

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = [
            'id', 'recommendation_type', 'title', 'content', 'priority',
            'ai_confidence_score', 'is_read', 'is_bookmarked', 'feedback_rating',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class CareerPathSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerPath
        fields = [
            'id', 'name', 'industry', 'description', 'required_skills',
            'career_stages', 'average_salary_range', 'growth_outlook',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class UserCareerProgressSerializer(serializers.ModelSerializer):
    career_path = CareerPathSerializer(read_only=True)
    
    class Meta:
        model = UserCareerProgress
        fields = [
            'id', 'career_path', 'current_stage', 'progress_percentage',
            'milestones_achieved', 'started_at', 'last_updated'
        ]
        read_only_fields = ['started_at', 'last_updated']

class RecommendationFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for updating recommendation feedback"""
    class Meta:
        model = Recommendation
        fields = ['feedback_rating', 'is_bookmarked']
