from django.core.management.base import BaseCommand
from recommendations.models import CareerPath

class Command(BaseCommand):
    help = 'Populate database with comprehensive career paths for all industries'

    def handle(self, *args, **options):
        career_paths = [
            # Technology & Engineering
            {
                'name': 'Software Engineering',
                'industry': 'Technology',
                'description': 'Design, develop, and maintain software applications and systems',
                'required_skills': ['Programming', 'Problem Solving', 'System Design', 'Version Control'],
                'career_stages': [
                    {'stage': 'Junior Developer', 'experience': '0-2 years', 'skills': ['Basic Programming', 'Version Control'], 'responsibilities': ['Code simple features', 'Debug issues', 'Learn frameworks']},
                    {'stage': 'Mid-level Developer', 'experience': '2-5 years', 'skills': ['Advanced Programming', 'Architecture Design'], 'responsibilities': ['Lead small projects', 'Mentor juniors', 'Design solutions']},
                    {'stage': 'Senior Developer', 'experience': '5+ years', 'skills': ['System Architecture', 'Leadership', 'Strategic Planning'], 'responsibilities': ['Architect systems', 'Lead teams', 'Technical decisions']}
                ],
                'average_salary_range': {'entry': '60000-80000', 'mid': '80000-120000', 'senior': '120000-200000'},
                'growth_outlook': 'Excellent - 22% growth expected through 2031'
            },
            
            # Creative Arts
            {
                'name': 'Graphic Design',
                'industry': 'Creative Arts',
                'description': 'Create visual concepts and designs for communication and marketing',
                'required_skills': ['Design Software', 'Creativity', 'Color Theory', 'Typography'],
                'career_stages': [
                    {'stage': 'Junior Designer', 'experience': '0-2 years', 'skills': ['Basic Design Tools', 'Visual Fundamentals'], 'responsibilities': ['Create basic designs', 'Learn software', 'Follow brand guidelines']},
                    {'stage': 'Graphic Designer', 'experience': '2-5 years', 'skills': ['Advanced Design', 'Client Management'], 'responsibilities': ['Lead design projects', 'Client interaction', 'Brand development']},
                    {'stage': 'Art Director', 'experience': '5+ years', 'skills': ['Creative Leadership', 'Strategic Vision'], 'responsibilities': ['Guide creative vision', 'Manage design teams', 'Strategic planning']}
                ],
                'average_salary_range': {'entry': '35000-45000', 'mid': '45000-70000', 'senior': '70000-120000'},
                'growth_outlook': 'Good - 3% growth expected through 2031'
            },
            
            # Healthcare
            {
                'name': 'Nursing',
                'industry': 'Healthcare',
                'description': 'Provide patient care and support in various healthcare settings',
                'required_skills': ['Patient Care', 'Medical Knowledge', 'Communication', 'Empathy'],
                'career_stages': [
                    {'stage': 'Registered Nurse', 'experience': '0-2 years', 'skills': ['Basic Nursing Care', 'Patient Assessment'], 'responsibilities': ['Direct patient care', 'Documentation', 'Follow protocols']},
                    {'stage': 'Charge Nurse', 'experience': '2-5 years', 'skills': ['Leadership', 'Unit Management'], 'responsibilities': ['Supervise staff', 'Coordinate care', 'Mentor new nurses']},
                    {'stage': 'Nurse Manager', 'experience': '5+ years', 'skills': ['Management', 'Strategic Planning', 'Budget Management'], 'responsibilities': ['Department oversight', 'Staff management', 'Quality improvement']}
                ],
                'average_salary_range': {'entry': '60000-75000', 'mid': '75000-95000', 'senior': '95000-130000'},
                'growth_outlook': 'Excellent - 9% growth expected through 2031'
            },
            
            # Business & Finance
            {
                'name': 'Financial Analysis',
                'industry': 'Finance',
                'description': 'Analyze financial data to guide business investment decisions',
                'required_skills': ['Financial Modeling', 'Data Analysis', 'Excel', 'Communication'],
                'career_stages': [
                    {'stage': 'Financial Analyst', 'experience': '0-2 years', 'skills': ['Financial Modeling', 'Excel', 'Basic Analysis'], 'responsibilities': ['Create models', 'Analyze data', 'Prepare reports']},
                    {'stage': 'Senior Analyst', 'experience': '2-5 years', 'skills': ['Advanced Modeling', 'Strategic Analysis'], 'responsibilities': ['Complex analysis', 'Team leadership', 'Stakeholder presentations']},
                    {'stage': 'Finance Manager', 'experience': '5+ years', 'skills': ['Team Management', 'Strategic Planning', 'Executive Communication'], 'responsibilities': ['Department management', 'Strategic planning', 'Executive reporting']}
                ],
                'average_salary_range': {'entry': '55000-70000', 'mid': '70000-110000', 'senior': '110000-180000'},
                'growth_outlook': 'Good - 6% growth expected through 2031'
            },
            
            # Education
            {
                'name': 'Teaching',
                'industry': 'Education',
                'description': 'Educate and inspire students in academic subjects',
                'required_skills': ['Subject Expertise', 'Communication', 'Patience', 'Classroom Management'],
                'career_stages': [
                    {'stage': 'New Teacher', 'experience': '0-2 years', 'skills': ['Curriculum Knowledge', 'Basic Classroom Management'], 'responsibilities': ['Teach classes', 'Grade work', 'Parent communication']},
                    {'stage': 'Experienced Teacher', 'experience': '2-5 years', 'skills': ['Advanced Pedagogy', 'Differentiation'], 'responsibilities': ['Mentor new teachers', 'Curriculum development', 'Leadership roles']},
                    {'stage': 'Department Head', 'experience': '5+ years', 'skills': ['Leadership', 'Administrative Skills', 'Strategic Planning'], 'responsibilities': ['Department oversight', 'Teacher evaluation', 'Curriculum planning']}
                ],
                'average_salary_range': {'entry': '40000-55000', 'mid': '55000-75000', 'senior': '75000-100000'},
                'growth_outlook': 'Stable - 5% growth expected through 2031'
            },
            
            # Sales & Marketing
            {
                'name': 'Digital Marketing',
                'industry': 'Marketing',
                'description': 'Develop and execute online marketing strategies',
                'required_skills': ['SEO/SEM', 'Content Creation', 'Analytics', 'Social Media'],
                'career_stages': [
                    {'stage': 'Marketing Coordinator', 'experience': '0-2 years', 'skills': ['Basic Digital Tools', 'Content Creation'], 'responsibilities': ['Execute campaigns', 'Content creation', 'Data entry']},
                    {'stage': 'Digital Marketing Specialist', 'experience': '2-5 years', 'skills': ['Campaign Management', 'Analytics', 'Strategy'], 'responsibilities': ['Manage campaigns', 'Analyze performance', 'Optimize strategies']},
                    {'stage': 'Marketing Manager', 'experience': '5+ years', 'skills': ['Strategic Planning', 'Team Leadership', 'Budget Management'], 'responsibilities': ['Strategic oversight', 'Team management', 'Budget planning']}
                ],
                'average_salary_range': {'entry': '40000-55000', 'mid': '55000-85000', 'senior': '85000-130000'},
                'growth_outlook': 'Excellent - 10% growth expected through 2031'
            },
            
            # Hospitality
            {
                'name': 'Hospitality Management',
                'industry': 'Hospitality',
                'description': 'Manage hotel, restaurant, and hospitality operations',
                'required_skills': ['Customer Service', 'Operations Management', 'Communication', 'Problem Solving'],
                'career_stages': [
                    {'stage': 'Assistant Manager', 'experience': '0-2 years', 'skills': ['Customer Service', 'Basic Operations'], 'responsibilities': ['Guest services', 'Staff supervision', 'Daily operations']},
                    {'stage': 'Department Manager', 'experience': '2-5 years', 'skills': ['Operations Management', 'Staff Leadership'], 'responsibilities': ['Department oversight', 'Staff management', 'Quality control']},
                    {'stage': 'General Manager', 'experience': '5+ years', 'skills': ['Strategic Management', 'Financial Management', 'Leadership'], 'responsibilities': ['Overall operations', 'P&L responsibility', 'Strategic planning']}
                ],
                'average_salary_range': {'entry': '35000-45000', 'mid': '45000-65000', 'senior': '65000-100000'},
                'growth_outlook': 'Good - 15% growth expected through 2031'
            },
            
            # Legal
            {
                'name': 'Legal Services',
                'industry': 'Law',
                'description': 'Provide legal counsel and representation',
                'required_skills': ['Legal Research', 'Writing', 'Critical Thinking', 'Communication'],
                'career_stages': [
                    {'stage': 'Junior Associate', 'experience': '0-3 years', 'skills': ['Legal Research', 'Document Drafting'], 'responsibilities': ['Research cases', 'Draft documents', 'Support senior lawyers']},
                    {'stage': 'Senior Associate', 'experience': '3-7 years', 'skills': ['Client Management', 'Case Strategy'], 'responsibilities': ['Client interaction', 'Case management', 'Court appearances']},
                    {'stage': 'Partner', 'experience': '7+ years', 'skills': ['Business Development', 'Leadership', 'Strategic Planning'], 'responsibilities': ['Firm management', 'Business development', 'Strategic decisions']}
                ],
                'average_salary_range': {'entry': '70000-120000', 'mid': '120000-250000', 'senior': '250000-500000'},
                'growth_outlook': 'Good - 9% growth expected through 2031'
            }
        ]
        
        created_count = 0
        for path_data in career_paths:
            career_path, created = CareerPath.objects.get_or_create(
                name=path_data['name'],
                industry=path_data['industry'],
                defaults=path_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created career path: {career_path.name}')
                )
            else:
                self.stdout.write(f'Career path already exists: {career_path.name}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new career paths')
        )
