from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class UserProfile(models.Model):
    EDUCATION_CHOICES = [
        ('high_school', 'High School'),
        ('associate', 'Associate Degree'),
        ('bachelor', 'Bachelor\'s Degree'),
        ('master', 'Master\'s Degree'),
        ('phd', 'PhD'),
        ('bootcamp', 'Bootcamp/Certification'),
        ('other', 'Other'),
    ]
    
    EXPERIENCE_CHOICES = [
        ('entry', '0-2 years'),
        ('junior', '2-5 years'),
        ('mid', '5-8 years'),
        ('senior', '8-12 years'),
        ('lead', '12+ years'),
    ]
    
    INDUSTRY_CHOICES = [
        # Technology & Engineering
        ('technology', 'Technology & IT'),
        ('engineering', 'Engineering'),
        ('data_science', 'Data Science & Analytics'),
        ('cybersecurity', 'Cybersecurity'),
        
        # Business & Finance
        ('finance', 'Finance & Banking'),
        ('accounting', 'Accounting'),
        ('consulting', 'Business Consulting'),
        ('entrepreneurship', 'Entrepreneurship'),
        ('management', 'Management & Leadership'),
        ('operations', 'Operations Management'),
        ('project_management', 'Project Management'),
        
        # Commerce & Sales
        ('sales', 'Sales & Business Development'),
        ('marketing', 'Marketing & Advertising'),
        ('digital_marketing', 'Digital Marketing'),
        ('ecommerce', 'E-commerce'),
        ('retail', 'Retail & Customer Service'),
        
        # Creative Arts & Media
        ('graphic_design', 'Graphic Design'),
        ('web_design', 'Web Design & UX/UI'),
        ('content_creation', 'Content Creation'),
        ('photography', 'Photography & Videography'),
        ('writing', 'Writing & Journalism'),
        ('music', 'Music & Audio Production'),
        ('film', 'Film & Television'),
        ('fashion', 'Fashion & Styling'),
        ('architecture', 'Architecture & Interior Design'),
        
        # Healthcare & Life Sciences
        ('healthcare', 'Healthcare & Medicine'),
        ('nursing', 'Nursing'),
        ('pharmacy', 'Pharmacy'),
        ('psychology', 'Psychology & Counseling'),
        ('physical_therapy', 'Physical Therapy'),
        ('veterinary', 'Veterinary Medicine'),
        ('biotechnology', 'Biotechnology'),
        
        # Education & Training
        ('education', 'Education & Teaching'),
        ('research', 'Research & Academia'),
        ('training', 'Corporate Training'),
        
        # Legal & Public Service
        ('law', 'Law & Legal Services'),
        ('government', 'Government & Public Policy'),
        ('nonprofit', 'Non-profit & Social Services'),
        ('human_resources', 'Human Resources'),
        
        # Science & Environment
        ('environmental', 'Environmental Science'),
        ('chemistry', 'Chemistry & Materials'),
        ('physics', 'Physics & Research'),
        ('agriculture', 'Agriculture & Food Science'),
        
        # Trades & Manufacturing
        ('manufacturing', 'Manufacturing & Production'),
        ('construction', 'Construction & Trades'),
        ('automotive', 'Automotive'),
        ('logistics', 'Logistics & Supply Chain'),
        
        # Hospitality & Services
        ('hospitality', 'Hospitality & Tourism'),
        ('food_service', 'Food Service & Culinary'),
        ('beauty', 'Beauty & Wellness'),
        ('fitness', 'Fitness & Sports'),
        
        # Transportation & Aviation
        ('aviation', 'Aviation & Aerospace'),
        ('transportation', 'Transportation & Logistics'),
        ('maritime', 'Maritime & Shipping'),
        
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Basic info
    skills = models.TextField(blank=True, help_text="Comma-separated list of skills")
    interests = models.TextField(blank=True, help_text="Areas of interest")
    goals = models.TextField(blank=True, help_text="Career goals and aspirations")
    
    # Education and Experience
    education_level = models.CharField(max_length=20, choices=EDUCATION_CHOICES, blank=True)
    field_of_study = models.CharField(max_length=100, blank=True)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, blank=True)
    current_role = models.CharField(max_length=100, blank=True)
    
    # Career preferences
    primary_career_field = models.CharField(
        max_length=50, 
        choices=INDUSTRY_CHOICES, 
        blank=True, 
        help_text="Primary career field of interest"
    )
    preferred_industries = models.JSONField(default=list, blank=True)
    preferred_work_style = models.CharField(
        max_length=20,
        choices=[('remote', 'Remote'), ('hybrid', 'Hybrid'), ('onsite', 'On-site'), ('flexible', 'Flexible')],
        blank=True
    )
    salary_expectation = models.PositiveIntegerField(blank=True, null=True, help_text="Annual salary expectation")
    
    # Career stage and aspirations
    career_stage = models.CharField(
        max_length=20,
        choices=[
            ('exploring', 'Exploring Options'),
            ('transitioning', 'Career Transition'),
            ('advancing', 'Career Advancement'),
            ('specializing', 'Specialization'),
            ('leadership', 'Leadership Track'),
            ('entrepreneurial', 'Entrepreneurial'),
        ],
        blank=True
    )
    
    # Universal Assessment scores (1-10 scale)
    technical_skills_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Technical/specialized skills for your field"
    )
    communication_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Written and verbal communication abilities"
    )
    leadership_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Team management and leadership capabilities"
    )
    problem_solving_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Analytical and critical thinking skills"
    )
    
    # Additional Universal Skills
    creativity_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Creative thinking and innovation"
    )
    adaptability_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Adaptability and learning agility"
    )
    teamwork_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Collaboration and teamwork skills"
    )
    customer_service_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Customer/client relationship skills"
    )
    sales_marketing_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Sales and marketing abilities"
    )
    analytical_thinking_score = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)], 
        blank=True, 
        null=True,
        help_text="Data analysis and research skills"
    )
    
    # Metadata
    profile_completion = models.FloatField(default=0.0, help_text="Profile completion percentage")
    last_assessment_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_completion_percentage(self):
        """Calculate profile completion percentage"""
        fields = [
            self.skills, self.interests, self.goals, self.education_level,
            self.field_of_study, self.experience_level, self.current_role,
            self.preferred_industries, self.preferred_work_style,
        ]
        completed = sum(1 for field in fields if field)
        percentage = (completed / len(fields)) * 100
        self.profile_completion = percentage
        return percentage
    
    def save(self, *args, **kwargs):
        self.calculate_completion_percentage()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.profile_completion:.1f}% complete"
