from django.db import models
from django.contrib.auth.models import User

class Recommendation(models.Model):
    RECOMMENDATION_TYPES = [
        ('career_path', 'Career Path'),
        ('skill_development', 'Skill Development'),
        ('job_match', 'Job Match'),
        ('education', 'Education'),
        ('industry_insight', 'Industry Insight'),
        ('salary_guidance', 'Salary Guidance'),
    ]
    
    PRIORITY_LEVELS = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recommendation_type = models.CharField(max_length=20, choices=RECOMMENDATION_TYPES, default='career_path')
    title = models.CharField(max_length=200, default='Career Recommendation')
    content = models.JSONField(help_text="AI-generated recommendation content")
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    
    # Metadata
    ai_confidence_score = models.FloatField(default=0.0, help_text="AI confidence in recommendation (0-1)")
    is_read = models.BooleanField(default=False)
    is_bookmarked = models.BooleanField(default=False)
    feedback_rating = models.IntegerField(null=True, blank=True, help_text="User feedback (1-5)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'recommendation_type']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"

class CareerPath(models.Model):
    """Represents a career progression path"""
    name = models.CharField(max_length=100)
    industry = models.CharField(max_length=50)
    description = models.TextField()
    required_skills = models.JSONField(default=list)
    career_stages = models.JSONField(default=list)  # List of career stages with requirements
    average_salary_range = models.JSONField(default=dict)  # Min/max salary by experience level
    growth_outlook = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.industry})"

class UserCareerProgress(models.Model):
    """Tracks user progress along a career path"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    career_path = models.ForeignKey(CareerPath, on_delete=models.CASCADE)
    current_stage = models.IntegerField(default=0)
    progress_percentage = models.FloatField(default=0.0)
    milestones_achieved = models.JSONField(default=list)
    
    started_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'career_path']
    
    def __str__(self):
        return f"{self.user.username} - {self.career_path.name} ({self.progress_percentage:.1f}%)"
