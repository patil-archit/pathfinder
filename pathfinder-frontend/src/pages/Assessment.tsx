import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/axiosClient';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
}

interface AssessmentResponse {
  next_question: string;
  options?: string[];
  is_complete: boolean;
  career_recommendations?: CareerRecommendation[];
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

export default function Assessment() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scenarios = [
    {
      question: "You're leading a team project that's behind schedule. A team member suggests a risky shortcut that could save time but might compromise quality. What do you do?",
      options: [
        "Take the risk to meet the deadline",
        "Discuss alternatives with the team",
        "Stick to the original plan despite delays",
        "Escalate to senior management"
      ]
    },
    {
      question: "You discover a colleague made an error that went unnoticed. Fixing it would take significant effort, but leaving it might never cause issues. How do you respond?",
      options: [
        "Fix it immediately myself",
        "Discuss it privately with the colleague",
        "Report it to management",
        "Document it and move on"
      ]
    },
    {
      question: "You're offered two opportunities: a stable role with clear growth or a startup position with equity but uncertainty. What factors matter most to you?",
      options: [
        "Financial security and benefits",
        "Learning and growth potential",
        "Work-life balance",
        "Innovation and impact"
      ]
    },
    {
      question: "Your ideal work environment would be:",
      options: [
        "Collaborative open office with constant interaction",
        "Quiet space for deep focused work",
        "Mix of collaboration and independent work",
        "Remote with flexible hours"
      ]
    },
    {
      question: "When faced with a complex problem, you typically:",
      options: [
        "Break it down into smaller parts methodically",
        "Brainstorm creative solutions with others",
        "Research best practices and proven solutions",
        "Trust intuition and experience"
      ]
    }
  ];

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);

  useEffect(() => {
    // Start the assessment with the first scenario
    const initialMessage: Message = {
      id: 1,
      type: 'bot',
      content: "Welcome! I'm here to help discover your ideal career path. I'll present you with real-world scenarios to understand your work style and preferences. Ready to begin?",
      options: ["Yes, let's start!", "Tell me more first"]
    };
    setMessages([initialMessage]);
    setCurrentOptions(initialMessage.options || []);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOptionClick = async (option: string) => {
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: option
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentOptions([]);
    setIsTyping(true);

    // Handle the response based on current state
    setTimeout(() => {
      if (option === "Yes, let's start!" || userResponses.length > 0) {
        if (currentScenarioIndex < scenarios.length) {
          presentScenario();
        } else {
          completeAssessment();
        }
      } else if (option === "Tell me more first") {
        const infoMessage: Message = {
          id: messages.length + 2,
          type: 'bot',
          content: "I'll present you with 5 workplace scenarios. Your responses will help me understand your problem-solving style, leadership approach, and work preferences. This takes about 5 minutes. Ready?",
          options: ["Yes, let's start!"]
        };
        setMessages(prev => [...prev, infoMessage]);
        setCurrentOptions(infoMessage.options || []);
      } else {
        // Record the response and move to next scenario
        setUserResponses(prev => [...prev, option]);
        setCurrentScenarioIndex(prev => prev + 1);
        
        if (currentScenarioIndex < scenarios.length - 1) {
          presentScenario();
        } else {
          completeAssessment();
        }
      }
      setIsTyping(false);
    }, 1500);
  };

  const presentScenario = () => {
    const scenario = scenarios[currentScenarioIndex];
    const scenarioMessage: Message = {
      id: messages.length + 2,
      type: 'bot',
      content: `Scenario ${currentScenarioIndex + 1}:\n\n${scenario.question}`,
      options: scenario.options
    };
    setMessages(prev => [...prev, scenarioMessage]);
    setCurrentOptions(scenario.options);
  };

  const completeAssessment = async () => {
    const completionMessage: Message = {
      id: messages.length + 2,
      type: 'bot',
      content: "Excellent! I've analyzed your responses and identified career paths that align with your work style and values. Generating your personalized recommendations..."
    };
    setMessages(prev => [...prev, completionMessage]);
    
    // Simulate AI processing
    setTimeout(() => {
      generateRecommendations();
    }, 2000);
  };

  const generateRecommendations = () => {
    // Mock recommendations based on assessment
    const mockRecommendations: CareerRecommendation[] = [
      {
        id: 1,
        title: "Product Manager",
        match_percentage: 92,
        description: "Lead product strategy and development, working with cross-functional teams",
        required_skills: ["Strategic Thinking", "Data Analysis", "Communication", "Leadership"],
        salary_range: "$120,000 - $180,000",
        growth_potential: "High - 25% growth expected"
      },
      {
        id: 2,
        title: "UX Research Manager",
        match_percentage: 87,
        description: "Drive user research initiatives and shape product experiences",
        required_skills: ["User Research", "Data Synthesis", "Stakeholder Management", "Design Thinking"],
        salary_range: "$110,000 - $160,000",
        growth_potential: "Very High - 30% growth expected"
      },
      {
        id: 3,
        title: "Strategy Consultant",
        match_percentage: 85,
        description: "Advise organizations on business strategy and transformation",
        required_skills: ["Problem Solving", "Business Analysis", "Presentation", "Project Management"],
        salary_range: "$100,000 - $170,000",
        growth_potential: "High - 22% growth expected"
      },
      {
        id: 4,
        title: "Data Science Manager",
        match_percentage: 82,
        description: "Lead data science teams and drive data-driven decision making",
        required_skills: ["Statistics", "Machine Learning", "Python/R", "Team Leadership"],
        salary_range: "$130,000 - $190,000",
        growth_potential: "Very High - 35% growth expected"
      }
    ];

    setRecommendations(mockRecommendations);
    setAssessmentComplete(true);

    const recommendationMessage: Message = {
      id: messages.length + 3,
      type: 'bot',
      content: "Based on your responses, I've identified several career paths that match your profile. Click on any recommendation below to see your personalized roadmap!"
    };
    setMessages(prev => [...prev, recommendationMessage]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleOptionClick(userInput);
      setUserInput('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Career Assessment
          </h1>
          <p className="text-gray-400">Discover your ideal career through scenario-based evaluation</p>
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
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 p-3 rounded-xl text-left transition-all duration-200 hover:scale-[1.02]"
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
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-white placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
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
              <h2 className="text-xl font-bold mb-4">Career Matches</h2>
              
              {assessmentComplete && recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => navigate('/career-roadmap', { state: { recommendation: rec } })}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{rec.title}</h3>
                        <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {rec.match_percentage}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{rec.description}</p>
                      <div className="text-xs text-gray-500">
                        <p>💰 {rec.salary_range}</p>
                        <p>📈 {rec.growth_potential}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-4">💭</div>
                  <p>Complete the assessment to see your career matches</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
