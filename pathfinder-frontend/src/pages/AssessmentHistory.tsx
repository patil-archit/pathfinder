import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

interface AssessmentSession {
  id: number;
  session_id: string;
  session_type: string;
  status: string;
  started_at: string;
  completed_at: string;
  total_questions: number;
  questions_answered: number;
  ai_confidence_score: number;
  duration_seconds: number;
  recommendation_count: number;
  created_at: string;
}

interface AssessmentStats {
  total_assessments: number;
  completed_assessments: number;
  in_progress_assessments: number;
  average_duration: number;
  total_recommendations: number;
  most_recent_assessment: {
    id: number;
    session_id: string;
    date: string;
    status: string;
    type: string;
  } | null;
}

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentSession[]>([]);
  const [stats, setStats] = useState<AssessmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  useEffect(() => {
    fetchAssessments();
    fetchStats();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  const fetchAssessments = async (statusFilter?: string) => {
    try {
      const token = getAuthToken();
      let url = 'http://127.0.0.1:8000/api/assessments/history/';
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://127.0.0.1:8000/api/assessments/sessions/statistics/', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'in_progress':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'abandoned':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_powered':
        return '🤖';
      case 'standard':
        return '📝';
      case 'quick':
        return '⚡';
      default:
        return '📋';
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'completed' | 'in_progress') => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      fetchAssessments();
    } else {
      fetchAssessments(newFilter);
    }
  };

  const viewAssessmentDetails = (sessionId: string) => {
    navigate(`/assessment-review/${sessionId}`);
  };

  const retakeAssessment = () => {
    navigate('/assessment');
  };

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
                onClick={retakeAssessment}
                className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
              >
                New Assessment
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Assessment History
            </h1>
            <p className="text-gray-400">Review your past assessments and track your career journey</p>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold">{stats.total_assessments}</div>
                <div className="text-sm text-gray-400">Total Assessments</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold">{stats.completed_assessments}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-2">⏳</div>
                <div className="text-2xl font-bold">{stats.in_progress_assessments}</div>
                <div className="text-sm text-gray-400">In Progress</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-bold">
                  {stats.average_duration ? formatDuration(Math.round(stats.average_duration)) : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">Avg Duration</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold">{stats.total_recommendations}</div>
                <div className="text-sm text-gray-400">Career Matches</div>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6 bg-white/5 backdrop-blur-sm p-2 rounded-2xl border border-white/10 inline-flex">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Assessments
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'completed' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => handleFilterChange('in_progress')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'in_progress' 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              In Progress
            </button>
          </div>

          {/* Assessments List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading assessments...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-2">No Assessments Yet</h3>
              <p className="text-gray-400 mb-6">Start your first assessment to discover your ideal career path</p>
              <button
                onClick={retakeAssessment}
                className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-200"
              >
                Take Your First Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => viewAssessmentDetails(assessment.session_id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{getTypeIcon(assessment.session_type)}</span>
                        <div>
                          <h3 className="text-lg font-semibold group-hover:text-purple-400 transition-colors">
                            {assessment.session_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Assessment
                          </h3>
                          <p className="text-sm text-gray-400">
                            {format(new Date(assessment.started_at), 'MMM dd, yyyy • hh:mm a')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Status</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assessment.status)}`}>
                            {assessment.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Questions</p>
                          <p className="font-semibold">
                            {assessment.questions_answered} / {assessment.total_questions || '?'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Duration</p>
                          <p className="font-semibold">{formatDuration(assessment.duration_seconds)}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Recommendations</p>
                          <p className="font-semibold">{assessment.recommendation_count || 0}</p>
                        </div>
                      </div>

                      {assessment.ai_confidence_score && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-gray-400">AI Confidence</p>
                            <p className="text-xs font-semibold">{Math.round(assessment.ai_confidence_score * 100)}%</p>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${assessment.ai_confidence_score * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Most Recent Assessment Highlight */}
          {stats?.most_recent_assessment && (
            <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="mr-2">🌟</span>
                Continue Your Journey
              </h3>
              <p className="text-gray-300 mb-4">
                Your most recent assessment was on {format(new Date(stats.most_recent_assessment.date), 'MMM dd, yyyy')}.
                {stats.most_recent_assessment.status === 'in_progress' 
                  ? " It's still in progress - continue where you left off!"
                  : " Review your results or take a new assessment to track your progress."}
              </p>
              <div className="flex space-x-3">
                {stats.most_recent_assessment.status === 'in_progress' ? (
                  <button
                    onClick={() => navigate('/assessment')}
                    className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                  >
                    Continue Assessment
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => viewAssessmentDetails(stats.most_recent_assessment.session_id)}
                      className="bg-white/10 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
                    >
                      View Results
                    </button>
                    <button
                      onClick={retakeAssessment}
                      className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                    >
                      New Assessment
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
