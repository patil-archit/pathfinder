import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface RoadmapStep {
  phase: string;
  duration: string;
  title: string;
  skills: string[];
  resources: string[];
  milestones: string[];
}

export default function CareerRoadmap() {
  const location = useLocation();
  const navigate = useNavigate();
  const recommendation = location.state?.recommendation;
  
  if (!recommendation) {
    navigate('/assessment');
    return null;
  }

  const roadmapSteps: RoadmapStep[] = [
    {
      phase: "Foundation",
      duration: "0-3 months",
      title: "Build Core Fundamentals",
      skills: ["Business Fundamentals", "Communication Skills", "Basic Analytics", "Industry Knowledge"],
      resources: ["Coursera Business Strategy", "LinkedIn Learning", "Industry Reports", "Networking Events"],
      milestones: ["Complete foundational courses", "Join professional communities", "Build initial network"]
    },
    {
      phase: "Skill Development",
      duration: "3-9 months",
      title: "Develop Specialized Skills",
      skills: recommendation.required_skills,
      resources: ["Advanced Certifications", "Bootcamps", "Mentorship Programs", "Side Projects"],
      milestones: ["Earn key certifications", "Complete 3+ projects", "Find a mentor"]
    },
    {
      phase: "Experience Building",
      duration: "9-15 months",
      title: "Gain Practical Experience",
      skills: ["Project Management", "Team Collaboration", "Problem Solving", "Leadership"],
      resources: ["Internships", "Freelance Projects", "Volunteer Work", "Cross-functional Projects"],
      milestones: ["Lead 2+ projects", "Build portfolio", "Get recommendations"]
    },
    {
      phase: "Career Transition",
      duration: "15-18 months",
      title: "Make the Move",
      skills: ["Interview Skills", "Negotiation", "Personal Branding", "Networking"],
      resources: ["Career Coaches", "Interview Prep", "Resume Services", "LinkedIn Optimization"],
      milestones: ["Update all materials", "Apply to 50+ positions", "Land target role"]
    },
    {
      phase: "Excellence",
      duration: "18+ months",
      title: "Become a Leader",
      skills: ["Strategic Thinking", "Executive Presence", "Innovation", "Mentoring"],
      resources: ["Executive Education", "Leadership Programs", "Industry Conferences", "Thought Leadership"],
      milestones: ["Exceed performance goals", "Mentor others", "Become recognized expert"]
    }
  ];

  const [activePhase, setActivePhase] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                P
              </div>
              <span className="text-xl font-bold">PathFinder</span>
            </Link>
            
            <button
              onClick={() => navigate('/assessment')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Assessment
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full mb-4">
              <span className="font-semibold">{recommendation.match_percentage}% Match</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {recommendation.title} Roadmap
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {recommendation.description}
            </p>
            
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Salary Range</p>
                <p className="text-xl font-semibold">{recommendation.salary_range}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Growth Potential</p>
                <p className="text-xl font-semibold">{recommendation.growth_potential}</p>
              </div>
            </div>
          </div>

          {/* Skills You Need Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Skills You Need to Acquire</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendation.required_skills.map((skill: string, index: number) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-purple-500 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{skill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap Timeline */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Your Journey to Success</h2>
            
            {/* Timeline Navigation */}
            <div className="flex justify-between mb-8 relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-white/10"></div>
              <div 
                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ width: `${(activePhase + 1) * 20}%` }}
              ></div>
              
              {roadmapSteps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActivePhase(index)}
                  className={`relative z-10 flex flex-col items-center ${
                    index <= activePhase ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      index === activePhase
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 scale-125'
                        : index < activePhase
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                        : 'bg-white/10'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 hidden md:block">{step.phase}</span>
                  <span className="text-xs text-gray-500 hidden md:block">{step.duration}</span>
                </button>
              ))}
            </div>

            {/* Active Phase Details */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  Phase {activePhase + 1}: {roadmapSteps[activePhase].title}
                </h3>
                <p className="text-gray-400">Duration: {roadmapSteps[activePhase].duration}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Skills to Learn */}
                <div>
                  <h4 className="font-semibold mb-3 text-purple-400">Skills to Learn</h4>
                  <ul className="space-y-2">
                    {roadmapSteps[activePhase].skills.map((skill, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-400 mr-2">▸</span>
                        <span className="text-gray-300">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="font-semibold mb-3 text-blue-400">Resources</h4>
                  <ul className="space-y-2">
                    {roadmapSteps[activePhase].resources.map((resource, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2">▸</span>
                        <span className="text-gray-300">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestones */}
                <div>
                  <h4 className="font-semibold mb-3 text-green-400">Milestones</h4>
                  <ul className="space-y-2">
                    {roadmapSteps[activePhase].milestones.map((milestone, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span className="text-gray-300">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Success Tips */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Tips for Success</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "🎯",
                  title: "Set Clear Goals",
                  description: "Break down your journey into weekly and monthly objectives"
                },
                {
                  icon: "🤝",
                  title: "Network Actively",
                  description: "Connect with professionals in your target field regularly"
                },
                {
                  icon: "📚",
                  title: "Never Stop Learning",
                  description: "Dedicate at least 1 hour daily to skill development"
                },
                {
                  icon: "💪",
                  title: "Build Your Portfolio",
                  description: "Document your projects and achievements consistently"
                }
              ].map((tip, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{tip.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-gray-400 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
            >
              Start Your Journey Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
