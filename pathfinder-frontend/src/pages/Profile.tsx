import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id?: number;
  skills?: string;
  interests?: string;
  goals?: string;
  education_level?: string;
  field_of_study?: string;
  experience_level?: string;
  current_role?: string;
  preferred_work_style?: string;
  salary_expectation?: number;
  profile_completion?: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'settings'>('overview');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    skills: '',
    interests: '',
    goals: '',
    education_level: '',
    field_of_study: '',
    experience_level: '',
    current_role: '',
    preferred_work_style: '',
    salary_expectation: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/profiles/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setProfile(data[0]);
          setFormData({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            skills: data[0].skills || '',
            interests: data[0].interests || '',
            goals: data[0].goals || '',
            education_level: data[0].education_level || '',
            field_of_study: data[0].field_of_study || '',
            experience_level: data[0].experience_level || '',
            current_role: data[0].current_role || '',
            preferred_work_style: data[0].preferred_work_style || '',
            salary_expectation: data[0].salary_expectation?.toString() || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const profileData = {
        skills: formData.skills,
        interests: formData.interests,
        goals: formData.goals,
        education_level: formData.education_level,
        field_of_study: formData.field_of_study,
        experience_level: formData.experience_level,
        current_role: formData.current_role,
        preferred_work_style: formData.preferred_work_style,
        salary_expectation: formData.salary_expectation ? parseInt(formData.salary_expectation) : null,
      };

      const method = profile?.id ? 'PUT' : 'POST';
      const url = profile?.id 
        ? `http://127.0.0.1:8000/api/profiles/${profile.id}/`
        : 'http://127.0.0.1:8000/api/profiles/';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        await fetchProfile();
        setEditing(false);
        // Update user context if name changed
        if (formData.first_name !== user?.first_name || formData.last_name !== user?.last_name) {
          updateUser({
            first_name: formData.first_name,
            last_name: formData.last_name
          });
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/assessment')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Assessment
              </button>
              <button
                onClick={logout}
                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-red-500/20"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          {/* Profile Header */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold">
                  {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username}
                  </h1>
                  <p className="text-gray-400 mb-1">{user?.email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date().getFullYear()}</p>
                </div>
              </div>
              
              <div className="text-right">
                {profile?.profile_completion && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Profile Completion</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getCompletionColor(profile.profile_completion)} rounded-full transition-all duration-500`}
                          style={{ width: `${profile.profile_completion}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{Math.round(profile.profile_completion)}%</span>
                    </div>
                  </div>
                )}
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        fetchProfile();
                      }}
                      className="bg-white/10 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="flex space-x-2 mb-6 bg-white/5 backdrop-blur-sm p-2 rounded-2xl border border-white/10 inline-flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'details' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Career Details
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      disabled={!editing}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      disabled={!editing}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-2xl font-bold">
                      {formData.current_role || 'Not Set'}
                    </div>
                    <div className="text-xs text-gray-400">Current Role</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-1">🎓</div>
                    <div className="text-2xl font-bold">
                      {formData.education_level?.replace('_', ' ') || 'Not Set'}
                    </div>
                    <div className="text-xs text-gray-400">Education</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-1">💼</div>
                    <div className="text-2xl font-bold">
                      {formData.experience_level?.replace('_', ' ') || 'Not Set'}
                    </div>
                    <div className="text-xs text-gray-400">Experience</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-2xl font-bold">
                      {formData.salary_expectation ? `$${parseInt(formData.salary_expectation).toLocaleString()}` : 'Not Set'}
                    </div>
                    <div className="text-xs text-gray-400">Expected Salary</div>
                  </div>
                </div>
              </div>

              {/* Skills & Interests */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Skills & Expertise</h2>
                <textarea
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  disabled={!editing}
                  placeholder="Enter your skills..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[120px]"
                />
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Interests</h2>
                <textarea
                  value={formData.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                  disabled={!editing}
                  placeholder="Enter your interests..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[120px]"
                />
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Career Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Career Goals</label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    disabled={!editing}
                    placeholder="Describe your career goals..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[120px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Role</label>
                  <input
                    type="text"
                    value={formData.current_role}
                    onChange={(e) => handleInputChange('current_role', e.target.value)}
                    disabled={!editing}
                    placeholder="e.g., Software Engineer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Education Level</label>
                  <select
                    value={formData.education_level}
                    onChange={(e) => handleInputChange('education_level', e.target.value)}
                    disabled={!editing}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
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
                  <label className="block text-sm text-gray-400 mb-2">Field of Study</label>
                  <input
                    type="text"
                    value={formData.field_of_study}
                    onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                    disabled={!editing}
                    placeholder="e.g., Computer Science"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Experience Level</label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => handleInputChange('experience_level', e.target.value)}
                    disabled={!editing}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
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
                  <label className="block text-sm text-gray-400 mb-2">Preferred Work Style</label>
                  <select
                    value={formData.preferred_work_style}
                    onChange={(e) => handleInputChange('preferred_work_style', e.target.value)}
                    disabled={!editing}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  >
                    <option value="">Select Work Style</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Salary Expectation (Annual)</label>
                  <input
                    type="number"
                    value={formData.salary_expectation}
                    onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                    disabled={!editing}
                    placeholder="e.g., 75000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="pb-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold mb-2">Privacy Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Make my profile public</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Allow recruiters to contact me</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Show my assessments to potential employers</span>
                    </label>
                  </div>
                </div>

                <div className="pb-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                      <span>Email me about new recommendations</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                      <span>Weekly career insights</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Promotional emails</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
                  <button className="bg-red-500/10 text-red-400 px-6 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-red-500/20">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
