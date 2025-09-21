export default function Footer() {
  return (
    <footer className="w-full bg-white/20 backdrop-blur-md border-t border-white/30 text-center py-6 mt-10">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm text-gray-600 font-medium">
          © {new Date().getFullYear()} PathFinder AI Career Advisor • 
          <span className="text-blue-600">Built with ❤️ using AI</span>
        </p>
        <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-500">
          <span>🚀 Powered by React & Django</span>
          <span>•</span>
          <span>🤖 AI-Driven Career Guidance</span>
        </div>
      </div>
    </footer>
  );
}
