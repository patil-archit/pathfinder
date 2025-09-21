import os
import json
import google.generativeai as genai
from django.conf import settings
from users.models import UserProfile

# Configure Gemini AI
def configure_gemini():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')

class CareerAdvisorAI:
    def __init__(self):
        self.model = configure_gemini()
    
    def generate_career_recommendations(self, user_profile: UserProfile):
        """Generate comprehensive career recommendations using Gemini AI"""
        
        # Build detailed prompt based on user profile
        prompt = self._build_career_prompt(user_profile)
        
        try:
            response = self.model.generate_content(prompt)
            recommendations_text = response.text
            
            # Parse AI response and structure recommendations
            return self._parse_recommendations(recommendations_text, user_profile)
            
        except Exception as e:
            print(f"Error generating AI recommendations: {e}")
            # Fallback to structured recommendations if AI fails
            return self._generate_fallback_recommendations(user_profile)
    
    def _build_career_prompt(self, profile: UserProfile):
        """Build comprehensive prompt for Gemini AI"""
        
        # Get field-specific context
        field_context = self._get_field_context(profile.primary_career_field)
        
        prompt = f"""
        You are a professional career advisor AI. Analyze this user profile and provide personalized career guidance.

        USER PROFILE:
        - Primary Career Field: {profile.get_primary_career_field_display() or 'Not specified'}
        - Career Stage: {profile.get_career_stage_display() or 'Not specified'}
        - Education: {profile.get_education_level_display() or 'Not specified'}
        - Field of Study: {profile.field_of_study or 'Not specified'}
        - Experience Level: {profile.get_experience_level_display() or 'Not specified'}
        - Current Role: {profile.current_role or 'Not specified'}
        - Skills: {profile.skills or 'Not specified'}
        - Interests: {profile.interests or 'Not specified'}
        - Goals: {profile.goals or 'Not specified'}
        - Work Style Preference: {profile.get_preferred_work_style_display() or 'Not specified'}
        - Salary Expectation: ${profile.salary_expectation or 'Not specified'}

        SKILL ASSESSMENT SCORES (1-10 scale):
        - Technical/Specialized Skills: {profile.technical_skills_score or 'Not assessed'}
        - Communication: {profile.communication_score or 'Not assessed'}
        - Leadership: {profile.leadership_score or 'Not assessed'}
        - Problem Solving: {profile.problem_solving_score or 'Not assessed'}
        - Creativity: {profile.creativity_score or 'Not assessed'}
        - Adaptability: {profile.adaptability_score or 'Not assessed'}
        - Teamwork: {profile.teamwork_score or 'Not assessed'}
        - Customer Service: {profile.customer_service_score or 'Not assessed'}
        - Sales & Marketing: {profile.sales_marketing_score or 'Not assessed'}
        - Analytical Thinking: {profile.analytical_thinking_score or 'Not assessed'}

        FIELD-SPECIFIC CONTEXT:
        {field_context}

        Please provide 3-5 specific, actionable career recommendations in JSON format with this structure:
        {{
            "recommendations": [
                {{
                    "type": "career_path|skill_development|job_match|education|industry_insight|salary_guidance",
                    "title": "Specific recommendation title",
                    "description": "Detailed description explaining why this is relevant",
                    "priority": "high|medium|low",
                    "confidence": 0.85,
                    "action_steps": ["Step 1", "Step 2", "Step 3"],
                    "timeline": "Short timeline estimate",
                    "resources": ["Resource 1", "Resource 2"],
                    "expected_outcomes": "What they can expect to achieve"
                }}
            ]
        }}

        Focus on:
        1. Career progression opportunities in their field
        2. Skill gaps and development recommendations
        3. Industry-specific insights and trends
        4. Networking and professional development
        5. Compensation and career advancement strategies

        Make recommendations specific to their career field, experience level, and stated goals.
        """
        
        return prompt
    
    def _get_field_context(self, field):
        """Get field-specific context and insights"""
        
        field_contexts = {
            'technology': """
            Tech industry trends: AI/ML, cloud computing, cybersecurity, DevOps
            In-demand skills: Full-stack development, data science, cloud architecture
            Career paths: Developer → Senior Developer → Tech Lead → Engineering Manager
            """,
            'healthcare': """
            Healthcare trends: Telemedicine, digital health, personalized medicine
            Growth areas: Nursing, mental health, geriatric care, health tech
            Career paths: Entry-level → Specialist → Department Head → Healthcare Executive
            """,
            'finance': """
            Finance trends: FinTech, cryptocurrency, sustainable investing, digital banking
            Key skills: Financial analysis, risk management, regulatory compliance
            Career paths: Analyst → Senior Analyst → Manager → Director → VP
            """,
            'marketing': """
            Marketing trends: Digital marketing, content creation, data analytics, social media
            Essential skills: SEO/SEM, social media marketing, analytics, creativity
            Career paths: Coordinator → Specialist → Manager → Director → CMO
            """,
            'arts': """
            Creative industry trends: Digital art, NFTs, streaming platforms, virtual reality
            Key skills: Technical proficiency, portfolio development, client management
            Career paths: Freelancer → Studio Artist → Art Director → Creative Director
            """,
            'education': """
            Education trends: EdTech, online learning, personalized education, STEM focus
            Growth areas: Special education, ESL, educational technology, curriculum design
            Career paths: Teacher → Department Head → Administrator → Principal
            """,
            'sales': """
            Sales trends: Social selling, CRM technology, consultative selling, account-based marketing
            Key skills: Relationship building, data analysis, communication, negotiation
            Career paths: Sales Rep → Senior Rep → Sales Manager → Sales Director → VP Sales
            """
        }
        
        # Get context for the field or provide general business context
        return field_contexts.get(field, """
        General business trends: Remote work, digital transformation, sustainability focus
        Universal skills: Communication, leadership, adaptability, continuous learning
        Career growth: Individual contributor → Team lead → Manager → Senior leader
        """)
    
    def _parse_recommendations(self, ai_response: str, profile: UserProfile):
        """Parse AI response and return structured recommendations"""
        
        try:
            # Try to parse JSON response
            if '{' in ai_response and '}' in ai_response:
                json_start = ai_response.find('{')
                json_end = ai_response.rfind('}') + 1
                json_text = ai_response[json_start:json_end]
                recommendations_data = json.loads(json_text)
                return recommendations_data.get('recommendations', [])
        except json.JSONDecodeError:
            pass
        
        # If JSON parsing fails, create structured recommendations from text
        return self._text_to_structured_recommendations(ai_response, profile)
    
    def _text_to_structured_recommendations(self, text: str, profile: UserProfile):
        """Convert text response to structured recommendations"""
        
        # Split text into sections and create recommendations
        recommendations = []
        sections = text.split('\n\n')
        
        for i, section in enumerate(sections[:5]):  # Max 5 recommendations
            if len(section.strip()) > 50:  # Only consider substantial sections
                recommendation = {
                    'type': self._determine_recommendation_type(section, i),
                    'title': self._extract_title(section),
                    'description': section.strip(),
                    'priority': self._determine_priority(section, i),
                    'confidence': 0.75 + (i * 0.05),  # Decreasing confidence
                    'action_steps': self._extract_action_steps(section),
                    'timeline': '1-3 months',
                    'resources': ['Professional development courses', 'Industry networking'],
                    'expected_outcomes': 'Career advancement and skill development'
                }
                recommendations.append(recommendation)
        
        return recommendations
    
    def _determine_recommendation_type(self, text: str, index: int):
        """Determine recommendation type based on content"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['skill', 'learn', 'course', 'training']):
            return 'skill_development'
        elif any(word in text_lower for word in ['job', 'position', 'role', 'career']):
            return 'career_path'
        elif any(word in text_lower for word in ['salary', 'compensation', 'pay']):
            return 'salary_guidance'
        elif any(word in text_lower for word in ['industry', 'trend', 'market']):
            return 'industry_insight'
        elif any(word in text_lower for word in ['education', 'degree', 'certification']):
            return 'education'
        else:
            return 'career_path'
    
    def _extract_title(self, text: str):
        """Extract or generate title from text"""
        lines = text.split('\n')
        first_line = lines[0].strip()
        
        # If first line is short, use as title
        if len(first_line) < 100:
            return first_line
        
        # Generate title based on content
        return "Career Development Recommendation"
    
    def _determine_priority(self, text: str, index: int):
        """Determine priority based on content and position"""
        if index == 0:
            return 'high'
        elif index < 3:
            return 'medium'
        else:
            return 'low'
    
    def _extract_action_steps(self, text: str):
        """Extract action steps from text"""
        steps = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if any(line.startswith(prefix) for prefix in ['1.', '2.', '3.', '-', '*']):
                clean_step = line.lstrip('123456789.-* ')
                if clean_step:
                    steps.append(clean_step)
        
        # If no structured steps found, create generic ones
        if not steps:
            steps = [
                'Research opportunities in this area',
                'Develop relevant skills and knowledge',
                'Network with professionals in the field',
                'Apply learnings to current role or seek new opportunities'
            ]
        
        return steps[:4]  # Max 4 steps
    
    def _generate_fallback_recommendations(self, profile: UserProfile):
        """Generate fallback recommendations if AI fails"""
        
        recommendations = []
        
        # Career path recommendation
        recommendations.append({
            'type': 'career_path',
            'title': f'Career Growth in {profile.get_primary_career_field_display() or "Your Field"}',
            'description': f'Based on your background in {profile.field_of_study or "your field"}, there are several advancement opportunities to explore.',
            'priority': 'high',
            'confidence': 0.80,
            'action_steps': [
                'Research senior roles in your field',
                'Identify key skills for advancement',
                'Seek mentorship from industry leaders',
                'Apply for stretch assignments'
            ],
            'timeline': '6-12 months',
            'resources': ['Industry publications', 'Professional associations', 'LinkedIn Learning'],
            'expected_outcomes': 'Clear career progression path and increased opportunities'
        })
        
        # Skill development recommendation
        if profile.technical_skills_score and profile.technical_skills_score < 8:
            recommendations.append({
                'type': 'skill_development',
                'title': 'Strengthen Technical Skills',
                'description': 'Enhancing your technical capabilities will open new opportunities and increase your market value.',
                'priority': 'medium',
                'confidence': 0.75,
                'action_steps': [
                    'Assess current skill gaps',
                    'Enroll in relevant courses or certifications',
                    'Practice through hands-on projects',
                    'Seek feedback from peers and mentors'
                ],
                'timeline': '3-6 months',
                'resources': ['Online learning platforms', 'Certification programs', 'Workshops'],
                'expected_outcomes': 'Improved technical proficiency and career advancement'
            })
        
        return recommendations
