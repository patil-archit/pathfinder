export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center border-b border-white/20 shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-lg font-bold">🎯</span>
        </div>
        <h1 className="font-bold text-2xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          PathFinder
        </h1>
      </div>
      <div className="flex space-x-2">
        <a 
          href="/" 
          className="px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-200 font-medium backdrop-blur-sm"
        >
          🏠 Home
        </a>
        <a 
          href="/dashboard" 
          className="px-4 py-2 rounded-xl bg-white/20 font-medium backdrop-blur-sm border border-white/30"
        >
          📊 Dashboard
        </a>
      </div>
    </nav>
  );
}
