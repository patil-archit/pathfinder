# PathFinder AI Career Advisor

A comprehensive AI-powered career guidance platform that helps users discover their career path, assess their skills, and get personalized recommendations.

![PathFinder Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=PathFinder+AI+Career+Dashboard)

## 🚀 Features

### Core Functionality
- **Comprehensive User Profiles**: Detailed career profiles with education, experience, skills, and preferences
- **Skills Assessment**: Interactive 10-point skill evaluation system
- **AI-Powered Recommendations**: Personalized career advice based on user profiles and industry trends
- **Career Path Mapping**: Visual representation of career progression and requirements
- **Industry Insights**: Current market trends and opportunities
- **Progress Tracking**: Monitor career development and goal achievement

### Advanced Features
- **Multi-tab Dashboard**: Organized interface for profile management, assessments, and recommendations
- **Real-time Insights**: Dynamic completion tracking and recommendation counters
- **Priority-based Recommendations**: High, medium, and low priority career advice
- **Confidence Scoring**: AI confidence levels for each recommendation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Technology Stack

### Backend
- **Django 5.x**: Python web framework
- **Django REST Framework**: API development
- **MySQL**: Primary database
- **JWT Authentication**: Secure user authentication
- **Django ORM**: Database management

### Frontend
- **React 19**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool
- **Axios**: HTTP client for API calls

### AI/ML (Ready for Integration)
- OpenAI GPT API (placeholder implementation included)
- Custom recommendation algorithms
- Skills matching system
- Career path prediction models

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd career_pathfinder
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE career_pathfinder;
   exit
   
   # Run migrations
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd pathfinder-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

### Getting Started

1. **Visit the application**: Open `http://localhost:5173` in your browser
2. **Create an account**: Sign up with your email and password
3. **Complete your profile**: Fill out the comprehensive career profile form
4. **Take the skills assessment**: Rate your abilities across key skill areas
5. **Generate recommendations**: Get AI-powered career advice
6. **Explore career paths**: Discover different career trajectories
7. **Track your progress**: Monitor your career development over time

### Dashboard Overview

#### Profile Tab
- Basic information (skills, interests, goals)
- Education and experience details
- Career preferences and salary expectations
- Work style preferences (remote, hybrid, on-site)

#### Skills Assessment Tab
- Technical skills evaluation
- Communication abilities
- Leadership capabilities
- Problem-solving aptitude
- Interactive sliders with real-time feedback

#### AI Recommendations Tab
- Personalized career advice
- Priority-based recommendations
- Confidence scoring
- Actionable next steps
- Industry insights and trends

### API Endpoints

#### Authentication
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh JWT token

#### User Profiles
- `GET /api/profiles/` - Get user profile
- `PUT /api/profiles/{id}/` - Update user profile
- `POST /api/profiles/` - Create user profile

#### Recommendations
- `GET /api/recommendations/` - Get user recommendations
- `POST /api/generate-recommendations/` - Generate new AI recommendations
- `PATCH /api/recommendations/{id}/feedback/` - Provide feedback on recommendations

#### Career Paths
- `GET /api/career-paths/` - Get available career paths
- `GET /api/career-paths/?industry=technology` - Filter by industry

#### User Insights
- `GET /api/insights/` - Get user analytics and insights

## 🤖 AI Integration

The platform is designed to integrate with various AI services:

### Current Implementation
- Mock AI recommendations based on user profiles
- Rule-based career matching
- Skills gap analysis
- Industry trend simulation

### Ready for Integration
- **OpenAI GPT-4**: Natural language career advice
- **Custom ML Models**: Personalized recommendation engines
- **Job Market APIs**: Real-time market data
- **Learning Platforms**: Course recommendations

### Sample AI Integration
```python
# recommendations/ai_service.py
import openai

def generate_career_advice(user_profile):
    prompt = f"""
    User Profile:
    - Skills: {user_profile.skills}
    - Interests: {user_profile.interests}
    - Experience: {user_profile.experience_level}
    - Goals: {user_profile.goals}
    
    Provide personalized career recommendations.
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

## 📊 Database Schema

### Key Models

#### UserProfile
- Personal and professional information
- Skills and interests
- Education and experience
- Career preferences
- Assessment scores

#### Recommendation
- AI-generated career advice
- Priority levels and confidence scores
- User feedback and ratings
- Recommendation types

#### CareerPath
- Industry-specific career trajectories
- Required skills and stages
- Salary ranges and growth outlook
- Progression milestones

#### UserCareerProgress
- Individual career tracking
- Progress metrics
- Milestone achievements

## 🎨 UI/UX Design

### Design Principles
- **User-Centered**: Intuitive navigation and clear information hierarchy
- **Responsive**: Works seamlessly across all devices
- **Accessible**: WCAG 2.1 compliant design
- **Modern**: Clean, professional aesthetic with engaging interactions

### Color Scheme
- Primary: Blue gradient (#4F46E5 to #7C3AED)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)
- Neutral: Gray scale (#F9FAFB to #111827)

### Components
- Interactive skill assessment sliders
- Priority-based recommendation cards
- Progress tracking visualizations
- Tabbed navigation system
- Responsive form layouts

## 🔧 Configuration

### Environment Variables
Create `.env` file in the project root:

```env
# Database
DB_NAME=career_pathfinder
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

# Django
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# AI Services (Optional)
OPENAI_API_KEY=your_openai_key
```

### Django Settings
Key configuration in `backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'career_pathfinder'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## 🚀 Deployment

### Production Considerations
- Use PostgreSQL or MySQL in production
- Configure proper CORS settings
- Set up SSL certificates
- Use environment-specific settings
- Implement proper logging and monitoring
- Set up automated backups

### Docker Deployment (Optional)
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 📈 Future Enhancements

### Planned Features
- **Real-time Chat**: AI-powered career counseling chat
- **Video Interviews**: Practice interview scenarios
- **Networking**: Connect with industry professionals
- **Job Board Integration**: Direct job applications
- **Learning Path Recommendations**: Personalized course suggestions
- **Salary Negotiation Tools**: Market-based compensation advice
- **Portfolio Builder**: Showcase skills and projects

### AI/ML Improvements
- Advanced natural language processing
- Computer vision for resume analysis
- Predictive career modeling
- Personalized learning recommendations
- Market trend analysis and forecasting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email [your-email] or create an issue in this repository.

## 🙏 Acknowledgments

- Inspired by the PathFinder AI Career Advisor concept
- Built with modern web technologies
- Designed for scalability and extensibility
- Community-driven development approach

---

**Built with ❤️ using Django, React, and AI**
