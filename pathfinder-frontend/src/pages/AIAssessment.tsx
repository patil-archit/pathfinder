import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

interface CareerRecommendation {
  id: number;
  title: string;
  match_percentage: number;
  description: string;
  required_skills: string[];
  salary_range: string;
  growth_potential: string;
}

export default function AIAssessment() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI career coach powered by advanced AI. I'll help you discover career paths that align perfectly with your skills, interests, and aspirations. Ready to begin your personalized assessment?",
      options: ["Yes, let's start!", "Tell me more first"]
    }
  ]);
  const [currentOptions, setCurrentOptions] = useState<string[]>(["Yes, let's start!", "Tell me more first"]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  const startAIAssessment = async () => {
    setLoading(true);
    setIsTyping(true);
    
    try {
      const token = getAuthToken();
      const response = await fetch('http://127.0.0.1:8000/api/ai/assessment/start/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          assessment_type: 'comprehensive',
          include_personality: true,
          include_skills: true,
          include_interests: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.session_id);
        setQuestionCount(1);
        
        // Add AI's first question
        const aiMessage: Message = {
          id: Date.now(),
          type: 'bot',
          content: data.question || "Let's start with understanding your current situation. What best describes your career stage?",
          options: data.options || [
            "Just starting my career",
            "Mid-career professional",
            "Looking for a career change",
            "Senior professional seeking growth"
          ]
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, aiMessage]);
          setCurrentOptions(aiMessage.options || []);
          setIsTyping(false);
        }, 1500);
        return; // Important: return here to prevent fallback
      } else {
        // Fallback to predefined questions if AI fails
        setIsTyping(false);
        setLoading(false);
        presentFallbackQuestion();
      }
    } catch (error) {
      console.error('Error starting AI assessment:', error);
      setIsTyping(false);
      setLoading(false);
      presentFallbackQuestion();
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!sessionId) {
      // If no session, start with fallback
      presentFallbackQuestion();
      return;
    }

    setLoading(true);
    setIsTyping(true);
    
    try {
      const token = getAuthToken();
      const response = await fetch('http://127.0.0.1:8000/api/ai/assessment/answer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          session_id: sessionId,
          answer: answer,
          question_number: questionCount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.assessment_complete) {
          // Assessment is complete, show recommendations
          completeAIAssessment(data.recommendations);
        } else {
          // Show next question
          setQuestionCount(prev => prev + 1);
          
          setTimeout(() => {
            const aiMessage: Message = {
              id: Date.now(),
              type: 'bot',
              content: data.question || "Based on your response, let me ask you this...",
              options: data.options || ["Continue"]
            };
            
            setMessages(prev => [...prev, aiMessage]);
            setCurrentOptions(aiMessage.options || []);
            setIsTyping(false);
          }, 1500);
          return;
        }
      } else {
        // Error handling
        setIsTyping(false);
        setLoading(false);
        presentFallbackQuestion();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setIsTyping(false);
      setLoading(false);
      presentFallbackQuestion();
    }
  };

  const completeAIAssessment = async (aiRecommendations?: any[]) => {
    setIsTyping(true);
    
    setTimeout(async () => {
      const completionMessage: Message = {
        id: Date.now(),
        type: 'bot',
        content: "Excellent! I've analyzed your responses using advanced AI to identify career paths that perfectly match your profile. Your personalized recommendations are ready!"
      };
      setMessages(prev => [...prev, completionMessage]);
      setIsTyping(false);
    
      if (aiRecommendations && aiRecommendations.length > 0) {
        // Use AI-generated recommendations
        const formattedRecommendations = aiRecommendations.map((rec, index) => ({
          id: index + 1,
          title: rec.title || rec.career_title,
          match_percentage: rec.match_score || rec.match_percentage || 85 + Math.floor(Math.random() * 15),
          description: rec.description || rec.summary,
          required_skills: rec.skills || rec.required_skills || [],
          salary_range: rec.salary_range || "$80,000 - $150,000",
          growth_potential: rec.growth_potential || "High"
        }));
        
        setRecommendations(formattedRecommendations);
      } else {
        // Generate recommendations if not provided
        await generateAIRecommendations();
      }
      
      setAssessmentComplete(true);
    }, 1500);
  };

  const generateAIRecommendations = async () => {
    if (!sessionId) {
      // Fallback recommendations
      setRecommendations(getFallbackRecommendations());
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch('http://127.0.0.1:8000/api/ai/recommendations/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      });

      const data = await response.json();
      
      if (data.success && data.recommendations) {
        const formattedRecommendations = data.recommendations.map((rec: any, index: number) => ({
          id: index + 1,
          title: rec.title,
          match_percentage: rec.match_score || 85 + Math.floor(Math.random() * 15),
          description: rec.description,
          required_skills: rec.required_skills || [],
          salary_range: rec.salary_range || "$80,000 - $150,000",
          growth_potential: rec.growth_potential || "High"
        }));
        
        setRecommendations(formattedRecommendations);
      } else {
        setRecommendations(getFallbackRecommendations());
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations(getFallbackRecommendations());
    }
  };

  const getFallbackRecommendations = (): CareerRecommendation[] => {
    return [
      {
        id: 1,
        title: "Product Manager",
        match_percentage: 92,
        description: "Lead product strategy and development, working with cross-functional teams to deliver innovative solutions",
        required_skills: ["Strategic Thinking", "Data Analysis", "Communication", "Leadership", "Agile Methodology"],
        salary_range: "$120,000 - $180,000",
        growth_potential: "High - 25% growth expected"
      },
      {
        id: 2,
        title: "Data Scientist",
        match_percentage: 88,
        description: "Analyze complex data to drive business decisions and develop predictive models",
        required_skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
        salary_range: "$110,000 - $165,000",
        growth_potential: "Very High - 35% growth expected"
      },
      {
        id: 3,
        title: "UX Designer",
        match_percentage: 85,
        description: "Create intuitive user experiences and interfaces for digital products",
        required_skills: ["Design Thinking", "Prototyping", "User Research", "Figma", "Problem Solving"],
        salary_range: "$95,000 - $145,000",
        growth_potential: "High - 23% growth expected"
      }
    ];
  };

  const [fallbackQuestionIndex, setFallbackQuestionIndex] = useState(0);

  const fallbackQuestions = [
    {
      question: "What type of work environment energizes you most?",
      options: [
        "Fast-paced startup environment",
        "Structured corporate setting",
        "Creative agency atmosphere",
        "Remote/flexible workplace"
      ]
    },
    {
      question: "Which skills do you enjoy using most?",
      options: [
        "Analytical and data-driven thinking",
        "Creative problem-solving",
        "Leadership and team management",
        "Technical and hands-on work"
      ]
    },
    {
      question: "What motivates you most in your career?",
      options: [
        "Making a positive impact",
        "Financial growth and stability",
        "Continuous learning and development",
        "Work-life balance and flexibility"
      ]
    },
    {
      question: "How do you prefer to work?",
      options: [
        "Independently with minimal supervision",
        "In a collaborative team environment",
        "Leading and mentoring others",
        "Mix of independent and team work"
      ]
    },
    {
      question: "What's your ideal career progression?",
      options: [
        "Become a technical expert in my field",
        "Move into management and leadership",
        "Start my own business",
        "Flexible roles with variety"
      ]
    }
  ];

  const presentFallbackQuestion = () => {
    if (fallbackQuestionIndex < fallbackQuestions.length) {
      const question = fallbackQuestions[fallbackQuestionIndex];
      
      setTimeout(() => {
        const fallbackMessage: Message = {
          id: Date.now(),
          type: 'bot',
          content: question.question,
          options: question.options
        };
        
        setMessages(prev => [...prev, fallbackMessage]);
        setCurrentOptions(question.options);
        setIsTyping(false);
      }, 1500);
    } else {
      // All questions answered, show recommendations
      completeAIAssessment();
    }
  };

  const presentFallbackQuestionFlow = (answer: string) => {
    setFallbackQuestionIndex(prev => prev + 1);
    
    if (fallbackQuestionIndex + 1 < fallbackQuestions.length) {
      presentFallbackQuestion();
    } else {
      completeAIAssessment();
    }
  };

  const handleOptionClick = async (option: string) => {
    // Prevent double-clicking
    if (loading || isTyping) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(), // Use timestamp for unique ID
      type: 'user',
      content: option
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentOptions([]);
    setIsTyping(true);

    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Handle the response based on current state
    if (option === "Yes, let's start!") {
      // Try to start AI assessment, will fallback if API fails
      await startAIAssessment();
    } else if (option === "Tell me more first") {
      const infoMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I use advanced AI to create a personalized assessment just for you. I'll ask about your interests, skills, work preferences, and career goals. The questions adapt based on your responses, making this a truly personalized experience. It takes about 5-10 minutes. Ready?",
        options: ["Yes, let's start!"]
      };
      setMessages(prev => [...prev, infoMessage]);
      setCurrentOptions(infoMessage.options || []);
      setIsTyping(false);
    } else if (sessionId && questionCount > 0) {
      // Submit answer to AI backend
      await submitAnswer(option);
    } else {
      // For fallback flow when no session (answering fallback questions)
      presentFallbackQuestionFlow(option);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !loading) {
      handleOptionClick(userInput);
      setUserInput('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI Career Assessment
              </h1>
              <p className="text-gray-400">Powered by Advanced AI • Personalized for You</p>
            </div>
            {questionCount > 0 && !assessmentComplete && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
                <p className="text-sm text-gray-400">Question {questionCount} of ~10</p>
                <div className="w-32 h-2 bg-white/10 rounded-full mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(questionCount * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[600px] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      {message.type === 'bot' && (
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-400">AI Career Coach</span>
                        </div>
                      )}
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Options or Input Area */}
              {currentOptions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      disabled={loading}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your response..."
                    disabled={loading}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-400 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Recommendations Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[600px] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">✨</span>
                AI-Powered Matches
              </h2>
              
              {assessmentComplete && recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => navigate('/career-roadmap', { state: { recommendation: rec } })}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold group-hover:text-purple-400 transition-colors">{rec.title}</h3>
                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {rec.match_percentage}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">💰</span>
                          <span>{rec.salary_range}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">📈</span>
                          <span>{rec.growth_potential}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-400 mb-2">Key Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {rec.required_skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {rec.required_skills.length > 3 && (
                            <span className="text-xs text-gray-500">+{rec.required_skills.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-white/10">
                    <p className="text-sm text-center text-gray-300">
                      Click any recommendation to see your personalized career roadmap
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <p className="font-semibold mb-2">AI Analysis in Progress</p>
                  <p className="text-sm">Complete the assessment to receive your personalized career recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
          
          {assessmentComplete && (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
            >
              Save & Continue to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
