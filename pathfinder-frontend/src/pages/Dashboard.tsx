import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/axiosClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface UserProfile {
  id: number;
  skills: string;
  interests: string;
  goals: string;
  education_level: string;
  field_of_study: string;
  experience_level: string;
  current_role: string;
  preferred_industries: string[];
  preferred_work_style: string;
  salary_expectation: number | null;
  technical_skills_score: number | null;
  communication_score: number | null;
  leadership_score: number | null;
  problem_solving_score: number | null;
  profile_completion: number;
}

interface Recommendation {
  id: number;
  recommendation_type: string;
  title: string;
  content: any;
  priority: string;
  ai_confidence_score: number;
  is_read: boolean;
  created_at: string;
}

interface UserInsights {
  profile_completion: number;
  skill_scores: {
    technical: number | null;
    communication: number | null;
    leadership: number | null;
    problem_solving: number | null;
  };
  recommendations_count: number;
  unread_recommendations: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'assessment' | 'recommendations'>('profile');
  
  // Form states
  const [formData, setFormData] = useState({
    skills: '',
    interests: '',
    goals: '',
    primary_career_field: '',
    career_stage: '',
    education_level: '',
    field_of_study: '',
    experience_level: '',
    current_role: '',
    preferred_work_style: '',
    salary_expectation: '',
  });
  
  const [assessmentScores, setAssessmentScores] = useState({
    technical_skills_score: 5,
    communication_score: 5,
    leadership_score: 5,
    problem_solving_score: 5,
  });

  useEffect(() => {
    fetchProfile();
    fetchRecommendations();
    fetchInsights();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await client.get("profiles/");
      if (res.data.length > 0) {
        const profileData = res.data[0];
        setProfile(profileData);
        setFormData({
          skills: profileData.skills || '',
          interests: profileData.interests || '',
          goals: profileData.goals || '',
          primary_career_field: profileData.primary_career_field || '',
          career_stage: profileData.career_stage || '',
          education_level: profileData.education_level || '',
          field_of_study: profileData.field_of_study || '',
          experience_level: profileData.experience_level || '',
          current_role: profileData.current_role || '',
          preferred_work_style: profileData.preferred_work_style || '',
          salary_expectation: profileData.salary_expectation?.toString() || '',
        });
        setAssessmentScores({
          technical_skills_score: profileData.technical_skills_score || 5,
          communication_score: profileData.communication_score || 5,
          leadership_score: profileData.leadership_score || 5,
          problem_solving_score: profileData.problem_solving_score || 5,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await client.get("recommendations/");
      setRecommendations(res.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await client.get("insights/");
      setInsights(res.data);
    } catch (err) {
      console.error('Error fetching insights:', err);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        salary_expectation: formData.salary_expectation ? parseInt(formData.salary_expectation) : null,
      };
      
      if (profile?.id) {
        await client.put(`profiles/${profile.id}/`, profileData);
      } else {
        await client.post("profiles/", profileData);
      }

      await fetchProfile();
      await fetchInsights();
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert("Error saving profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      await client.post('generate-recommendations/');
      await fetchRecommendations();
      await fetchInsights();
      setActiveTab('recommendations');
    } catch (err) {
      console.error(err);
      alert('Error generating recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with insights */}
        {insights && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Career Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-3xl font-bold mb-1 text-white">{insights.profile_completion.toFixed(1)}%</div>
                <div className="text-sm opacity-70 font-medium text-gray-300">Profile Complete</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-3xl font-bold mb-1 text-white">{insights.recommendations_count}</div>
                <div className="text-sm opacity-70 font-medium text-gray-300">Recommendations</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-3xl font-bold mb-1 text-white">{insights.unread_recommendations}</div>
                <div className="text-sm opacity-70 font-medium text-gray-300">Unread</div>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                <button 
                  onClick={generateRecommendations}
                  disabled={loading}
                  className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50 shadow-lg"
                >
                  {loading ? '🤖 Generating...' : '✨ Get Recommendations'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-white/5 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'profile' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105' 
                : 'text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'assessment' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105' 
                : 'text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105'
            }`}
          >
            📊 Skills Assessment
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'recommendations' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105' 
                : 'text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105'
            }`}
          >
            🤖 Career Recommendations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Career Profile</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Skills</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="e.g., Python, JavaScript, Project Management"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Interests</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="e.g., Machine Learning, Data Science, Web Development"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-300">Career Goals</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Describe your short and long-term career objectives"
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    rows={3}
                  />
                </div>
                
                {/* Primary Career Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Primary Career Field</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white shadow-sm"
                    value={formData.primary_career_field}
                    onChange={(e) => handleInputChange('primary_career_field', e.target.value)}
                  >
                    <option value="">Select Your Primary Career Field</option>
                    <optgroup label="Technology & Engineering">
                      <option value="technology">Technology & IT</option>
                      <option value="engineering">Engineering</option>
                      <option value="data_science">Data Science & Analytics</option>
                      <option value="cybersecurity">Cybersecurity</option>
                    </optgroup>
                    <optgroup label="Business & Finance">
                      <option value="finance">Finance & Banking</option>
                      <option value="accounting">Accounting</option>
                      <option value="consulting">Business Consulting</option>
                      <option value="entrepreneurship">Entrepreneurship</option>
                      <option value="management">Management & Leadership</option>
                      <option value="operations">Operations Management</option>
                      <option value="project_management">Project Management</option>
                    </optgroup>
                    <optgroup label="Commerce & Sales">
                      <option value="sales">Sales & Business Development</option>
                      <option value="marketing">Marketing & Advertising</option>
                      <option value="digital_marketing">Digital Marketing</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="retail">Retail & Customer Service</option>
                    </optgroup>
                    <optgroup label="Creative Arts & Media">
                      <option value="graphic_design">Graphic Design</option>
                      <option value="web_design">Web Design & UX/UI</option>
                      <option value="content_creation">Content Creation</option>
                      <option value="photography">Photography & Videography</option>
                      <option value="writing">Writing & Journalism</option>
                      <option value="music">Music & Audio Production</option>
                      <option value="film">Film & Television</option>
                      <option value="fashion">Fashion & Styling</option>
                      <option value="architecture">Architecture & Interior Design</option>
                    </optgroup>
                    <optgroup label="Healthcare & Life Sciences">
                      <option value="healthcare">Healthcare & Medicine</option>
                      <option value="nursing">Nursing</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="psychology">Psychology & Counseling</option>
                      <option value="physical_therapy">Physical Therapy</option>
                      <option value="veterinary">Veterinary Medicine</option>
                      <option value="biotechnology">Biotechnology</option>
                    </optgroup>
                    <optgroup label="Education & Training">
                      <option value="education">Education & Teaching</option>
                      <option value="research">Research & Academia</option>
                      <option value="training">Corporate Training</option>
                    </optgroup>
                    <optgroup label="Legal & Public Service">
                      <option value="law">Law & Legal Services</option>
                      <option value="government">Government & Public Policy</option>
                      <option value="nonprofit">Non-profit & Social Services</option>
                      <option value="human_resources">Human Resources</option>
                    </optgroup>
                    <optgroup label="Other Industries">
                      <option value="hospitality">Hospitality & Tourism</option>
                      <option value="food_service">Food Service & Culinary</option>
                      <option value="fitness">Fitness & Sports</option>
                      <option value="construction">Construction & Trades</option>
                      <option value="aviation">Aviation & Aerospace</option>
                      <option value="other">Other</option>
                    </optgroup>
                  </select>
                </div>
                
                {/* Career Stage */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Career Stage</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white shadow-sm"
                    value={formData.career_stage}
                    onChange={(e) => handleInputChange('career_stage', e.target.value)}
                  >
                    <option value="">Select Your Career Stage</option>
                    <option value="exploring">Exploring Options</option>
                    <option value="transitioning">Career Transition</option>
                    <option value="advancing">Career Advancement</option>
                    <option value="specializing">Specialization</option>
                    <option value="leadership">Leadership Track</option>
                    <option value="entrepreneurial">Entrepreneurial</option>
                  </select>
                </div>
                
                {/* Education & Experience */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Education Level</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white shadow-sm"
                    value={formData.education_level}
                    onChange={(e) => handleInputChange('education_level', e.target.value)}
                  >
                    <option value="">Select Education Level</option>
                    <option value="high_school">High School</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="bootcamp">Bootcamp/Certification</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Field of Study</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="e.g., Computer Science, Business"
                    value={formData.field_of_study}
                    onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Experience Level</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white shadow-sm"
                    value={formData.experience_level}
                    onChange={(e) => handleInputChange('experience_level', e.target.value)}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="entry">0-2 years</option>
                    <option value="junior">2-5 years</option>
                    <option value="mid">5-8 years</option>
                    <option value="senior">8-12 years</option>
                    <option value="lead">12+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Current Role</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="e.g., Software Engineer, Student"
                    value={formData.current_role}
                    onChange={(e) => handleInputChange('current_role', e.target.value)}
                  />
                </div>
                
                {/* Preferences */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Preferred Work Style</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white shadow-sm"
                    value={formData.preferred_work_style}
                    onChange={(e) => handleInputChange('preferred_work_style', e.target.value)}
                  >
                    <option value="">Select Work Style</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Salary Expectation (Annual)</label>
                  <input
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="e.g., 75000"
                    value={formData.salary_expectation}
                    onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50 shadow-lg"
                disabled={loading}
              >
                {loading ? '⚙️ Saving...' : (profile ? '🚀 Update Profile' : '✨ Save Profile')}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center py-12">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AI-Powered Career Assessment
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Experience our new AI-driven assessment that adapts to your responses and provides personalized career recommendations based on your unique profile.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">🤖</div>
                  <h3 className="font-semibold mb-1">AI-Powered</h3>
                  <p className="text-sm text-gray-400">Dynamic questions that adapt to your answers</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold mb-1">Personalized</h3>
                  <p className="text-sm text-gray-400">Tailored career paths based on your unique profile</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="font-semibold mb-1">Quick & Easy</h3>
                  <p className="text-sm text-gray-400">Complete in just 5-10 minutes</p>
                </div>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => navigate('/assessment')}
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Start AI Assessment →
                </button>
                <button
                  onClick={() => navigate('/assessment-history')}
                  className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  View History 📊
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mt-4">
                Your previous assessment data will be used to provide better recommendations
              </p>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Career Recommendations</h2>
              {recommendations.length === 0 && (
                <button
                  onClick={generateRecommendations}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 shadow-lg"
                >
                  {loading ? '🤖 Generating...' : '✨ Generate Recommendations'}
                </button>
              )}
            </div>
            
            {recommendations.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority} priority
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(rec.ai_confidence_score * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{rec.title}</h3>
                    {(() => {
                      // Parse content if it's a string containing JSON
                      let parsedContent = rec.content;
                      if (typeof rec.content === 'string') {
                        try {
                          // Remove markdown code blocks if present
                          let cleanContent = rec.content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
                          parsedContent = JSON.parse(cleanContent);
                        } catch (e) {
                          // If parsing fails, try to extract meaningful text
                          parsedContent = { description: rec.content };
                        }
                      }
                      
                      return (
                        <>
                          <p className="text-gray-600 mb-3">
                            {parsedContent.description || parsedContent.type || 'Career recommendation'}
                          </p>
                          
                          {parsedContent.recommendations && Array.isArray(parsedContent.recommendations) && (
                            <div className="mb-3">
                              <h4 className="font-medium text-sm mb-1">Recommendations:</h4>
                              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                {parsedContent.recommendations.map((item: any, index: number) => (
                                  <li key={index}>
                                    {typeof item === 'object' ? (item.title || item.description || JSON.stringify(item)) : item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {parsedContent.action_steps && Array.isArray(parsedContent.action_steps) && (
                            <div className="mb-3">
                              <h4 className="font-medium text-sm mb-1">Action Steps:</h4>
                              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                {parsedContent.action_steps.map((step: any, index: number) => (
                                  <li key={index}>
                                    {typeof step === 'object' ? step.description || JSON.stringify(step) : step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {parsedContent.timeline && (
                            <div className="mb-3">
                              <h4 className="font-medium text-sm mb-1">Timeline:</h4>
                              <p className="text-sm text-gray-600">{parsedContent.timeline}</p>
                            </div>
                          )}
                          
                          {parsedContent.resources && Array.isArray(parsedContent.resources) && (
                            <div className="mb-3">
                              <h4 className="font-medium text-sm mb-1">Resources:</h4>
                              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                {parsedContent.resources.map((resource: any, index: number) => (
                                  <li key={index}>
                                    {typeof resource === 'object' ? resource.title || resource.name || JSON.stringify(resource) : resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {parsedContent.expected_outcomes && (
                            <div className="mb-3">
                              <h4 className="font-medium text-sm mb-1">Expected Outcomes:</h4>
                              <p className="text-sm text-gray-600">{parsedContent.expected_outcomes}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(rec.created_at).toLocaleDateString()}</span>
                      <span className="capitalize">{rec.recommendation_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-medium mb-2">No recommendations yet</h3>
                <p className="text-gray-600 mb-4">Complete your profile and assessment to get personalized career advice.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
      </div>
    </div>
  );
}
