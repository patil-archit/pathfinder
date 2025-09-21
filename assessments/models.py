from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import json


class AssessmentSession(models.Model):
    """Stores a complete assessment session"""
    SESSION_TYPES = [
        ('ai_powered', 'AI Powered Assessment'),
        ('standard', 'Standard Assessment'),
        ('quick', 'Quick Assessment'),
    ]
    
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessment_sessions')
    session_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='ai_powered')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    total_questions = models.IntegerField(default=0)
    questions_answered = models.IntegerField(default=0)
    
    # Store the final recommendations
    recommendations = models.JSONField(default=list, blank=True)
    ai_confidence_score = models.FloatField(null=True, blank=True)
    
    # Metadata
    duration_seconds = models.IntegerField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['session_id']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.session_type} - {self.started_at.date()}"
    
    def calculate_duration(self):
        if self.completed_at and self.started_at:
            delta = self.completed_at - self.started_at
            self.duration_seconds = int(delta.total_seconds())
            self.save(update_fields=['duration_seconds'])
    
    def mark_completed(self):
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.calculate_duration()
        self.save(update_fields=['status', 'completed_at'])


class AssessmentQuestion(models.Model):
    """Stores each question asked during an assessment"""
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('text', 'Text Input'),
        ('rating', 'Rating Scale'),
        ('scenario', 'Scenario Based'),
    ]
    
    session = models.ForeignKey(AssessmentSession, on_delete=models.CASCADE, related_name='questions')
    question_number = models.IntegerField()
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='multiple_choice')
    options = models.JSONField(default=list, blank=True)  # For multiple choice questions
    
    # User's response
    user_answer = models.TextField(null=True, blank=True)
    answer_metadata = models.JSONField(default=dict, blank=True)  # Additional answer data
    
    # Timing
    presented_at = models.DateTimeField(default=timezone.now)
    answered_at = models.DateTimeField(null=True, blank=True)
    response_time_seconds = models.IntegerField(null=True, blank=True)
    
    # AI-related fields
    ai_generated = models.BooleanField(default=False)
    ai_context = models.JSONField(default=dict, blank=True)  # Context used to generate question
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['session', 'question_number']
        unique_together = ['session', 'question_number']
    
    def __str__(self):
        return f"Q{self.question_number}: {self.question_text[:50]}..."
    
    def save_answer(self, answer):
        self.user_answer = answer
        self.answered_at = timezone.now()
        if self.presented_at:
            delta = self.answered_at - self.presented_at
            self.response_time_seconds = int(delta.total_seconds())
        self.save()


class AssessmentResult(models.Model):
    """Stores the analysis and results of an assessment"""
    session = models.OneToOneField(AssessmentSession, on_delete=models.CASCADE, related_name='result')
    
    # Career matches
    top_career_matches = models.JSONField(default=list)
    skill_gaps = models.JSONField(default=list)
    recommended_skills = models.JSONField(default=list)
    
    # Personality insights
    work_style_preference = models.CharField(max_length=100, null=True, blank=True)
    team_preference = models.CharField(max_length=100, null=True, blank=True)
    leadership_style = models.CharField(max_length=100, null=True, blank=True)
    motivation_factors = models.JSONField(default=list)
    
    # Scores
    technical_affinity = models.FloatField(null=True, blank=True)
    creative_affinity = models.FloatField(null=True, blank=True)
    analytical_affinity = models.FloatField(null=True, blank=True)
    interpersonal_affinity = models.FloatField(null=True, blank=True)
    
    # AI Analysis
    ai_analysis = models.TextField(null=True, blank=True)
    confidence_score = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Results for {self.session}"


class CareerRecommendationHistory(models.Model):
    """Stores individual career recommendations from assessments"""
    session = models.ForeignKey(AssessmentSession, on_delete=models.CASCADE, related_name='career_recommendations')
    
    career_title = models.CharField(max_length=200)
    match_percentage = models.IntegerField()
    description = models.TextField()
    required_skills = models.JSONField(default=list)
    salary_range = models.CharField(max_length=100, null=True, blank=True)
    growth_potential = models.CharField(max_length=100, null=True, blank=True)
    
    # User interaction
    viewed = models.BooleanField(default=False)
    clicked_roadmap = models.BooleanField(default=False)
    saved_by_user = models.BooleanField(default=False)
    user_rating = models.IntegerField(null=True, blank=True)  # 1-5 star rating
    user_notes = models.TextField(null=True, blank=True)
    
    # Additional metadata
    industry = models.CharField(max_length=100, null=True, blank=True)
    experience_level = models.CharField(max_length=50, null=True, blank=True)
    education_requirements = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-match_percentage', 'career_title']
    
    def __str__(self):
        return f"{self.career_title} - {self.match_percentage}% match"


class AssessmentFeedback(models.Model):
    """Stores user feedback about assessments"""
    RATING_CHOICES = [(i, i) for i in range(1, 6)]
    
    session = models.OneToOneField(AssessmentSession, on_delete=models.CASCADE, related_name='feedback')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    overall_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    accuracy_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    usefulness_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    
    feedback_text = models.TextField(null=True, blank=True)
    would_recommend = models.BooleanField(null=True, blank=True)
    
    # Specific feedback
    questions_relevant = models.BooleanField(null=True, blank=True)
    recommendations_helpful = models.BooleanField(null=True, blank=True)
    assessment_too_long = models.BooleanField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Feedback from {self.user.username} - Rating: {self.overall_rating}/5"
