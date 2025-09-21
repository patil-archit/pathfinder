import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🧠",
      title: "Data-Driven Insights",
      description: "Advanced machine learning algorithms analyze your profile to provide personalized career recommendations",
      color: "from-purple-500 to-blue-600"
    },
    {
      icon: "📊",
      title: "Skills Assessment",
      description: "Comprehensive evaluation of your technical and soft skills with detailed analytics and improvement suggestions",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: "🚀",
      title: "Career Acceleration",
      description: "Track your progress and get actionable insights to accelerate your professional growth",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer → Senior Product Manager",
      content: "PathFinder helped me transition from engineering to product management. The recommendations were spot-on!",
      avatar: "👩‍💻"
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Specialist → Growth Director",
      content: "The skills assessment identified gaps I didn't even know I had. Now I'm leading a team of 15!",
      avatar: "👨‍💼"
    },
    {
      name: "Emily Foster",
      role: "Data Analyst → ML Engineer",
      content: "The career path recommendations opened my eyes to possibilities I never considered. Game changer!",
      avatar: "👩‍🔬"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black"></div>
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
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

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-200">
              P
            </div>
            <span className="text-xl font-bold">PathFinder</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                    </div>
                    <span className="text-white">{user?.first_name || user?.username}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="bg-red-500/10 text-red-400 px-4 py-2 rounded-full hover:bg-red-500/20 transition-all duration-200 border border-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative z-10 px-6 py-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8 animate-pulse">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <span className="text-sm font-medium text-gray-300">Professional Career Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="block mb-2">Transform Your</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Career Journey
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Leverage advanced analytics to discover your ideal career path, assess your skills,
            and get personalized recommendations that accelerate your professional growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard"
                  className="group relative bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/assessment"
                  className="bg-purple-500/10 text-purple-400 px-8 py-4 rounded-full font-semibold hover:bg-purple-500/20 transition-all duration-300 border border-purple-500/20"
                >
                  Take New Assessment
                </Link>
              </>
            ) : (
              <Link 
                to="/signup"
                className="group relative bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Start Free Assessment</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}
            
            <button className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span>Watch Demo</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "10K+", label: "Career Paths Analyzed" },
              { value: "95%", label: "Accuracy Rate" },
              { value: "2.5x", label: "Faster Career Growth" },
              { value: "500+", label: "Success Stories" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Powered by Advanced Analytics</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our cutting-edge algorithms analyze millions of career trajectories to provide 
              you with personalized insights and recommendations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 cursor-pointer ${
                  activeFeature === index ? 'scale-105 border-white/30' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                     style={{ background: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                      style={{ backgroundImage: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">See It in Action</h2>
              <p className="text-xl text-gray-400 mb-8">
                Watch how we analyze your profile and generate personalized
                career recommendations in real-time.
              </p>
              
              <div className="space-y-4">
                {[
                  { step: 1, text: "Complete skills assessment", active: true },
                  { step: 2, text: "Profile analysis in progress", active: true },
                  { step: 3, text: "Get personalized recommendations", active: false },
                  { step: 4, text: "Track your progress", active: false }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      item.active ? 'bg-white text-black' : 'bg-white/10 text-gray-400'
                    }`}>
                      {item.step}
                    </div>
                    <span className={item.active ? 'text-white' : 'text-gray-400'}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Skills Analysis</span>
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 font-mono">
                    &gt; Analyzing technical skills...<br/>
                    &gt; Processing communication patterns...<br/>
                    &gt; Generating recommendations...
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-green-400 text-sm font-mono mb-2">✓ Analysis Complete</div>
                    <div className="text-white text-sm">
                      <strong>Recommended Path:</strong> Senior Product Manager<br/>
                      <strong>Confidence:</strong> 94%<br/>
                      <strong>Timeline:</strong> 8-12 months
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of professionals who have transformed their careers with PathFinder.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                {isAuthenticated ? 'Continue Your Career Journey' : 'Ready to Transform Your Career?'}
              </h2>
              <p className="text-xl opacity-90 mb-8">
                {isAuthenticated 
                  ? 'Explore new opportunities and track your progress.'
                  : 'Join over 10,000 professionals who have discovered their ideal career path.'}
              </p>
              <Link 
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
              >
                {isAuthenticated ? 'View Your Dashboard' : 'Start Your Journey Today'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold">
                  P
                </div>
                <span className="text-lg font-bold">PathFinder</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional career guidance for the next generation of leaders.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "API", "Documentation"]
              },
              {
                title: "Company", 
                links: ["About", "Blog", "Careers", "Press"]
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Privacy", "Terms"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 PathFinder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
