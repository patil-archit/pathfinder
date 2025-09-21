from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    profile_completion = serializers.ReadOnlyField()
    primary_career_field_display = serializers.CharField(source='get_primary_career_field_display', read_only=True)
    career_stage_display = serializers.CharField(source='get_career_stage_display', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'skills', 'interests', 'goals', 'education_level', 
            'field_of_study', 'experience_level', 'current_role',
            'primary_career_field', 'primary_career_field_display',
            'career_stage', 'career_stage_display',
            'preferred_industries', 'preferred_work_style', 'salary_expectation',
            # All skill assessment scores
            'technical_skills_score', 'communication_score', 'leadership_score',
            'problem_solving_score', 'creativity_score', 'adaptability_score',
            'teamwork_score', 'customer_service_score', 'sales_marketing_score',
            'analytical_thinking_score',
            # Metadata
            'profile_completion', 'last_assessment_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['profile_completion', 'created_at', 'updated_at', 
                          'primary_career_field_display', 'career_stage_display']

class UserProfileCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for profile creation"""
    class Meta:
        model = UserProfile
        fields = ['skills', 'interests', 'goals']

class SkillAssessmentSerializer(serializers.ModelSerializer):
    """Serializer for comprehensive skill assessment updates"""
    class Meta:
        model = UserProfile
        fields = [
            'technical_skills_score', 'communication_score', 'leadership_score',
            'problem_solving_score', 'creativity_score', 'adaptability_score',
            'teamwork_score', 'customer_service_score', 'sales_marketing_score',
            'analytical_thinking_score'
        ]
