import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        setError(errorDescription || 'OAuth authentication failed');
        setLoading(false);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setLoading(false);
        return;
      }

      try {
        // Exchange the code for tokens
        const response = await fetch('http://127.0.0.1:8000/api/auth/social/callback/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            provider: detectProvider()
          })
        });

        const data = await response.json();

        if (data.success) {
          // Store tokens and user data
          localStorage.setItem('access_token', data.tokens.access);
          localStorage.setItem('refresh_token', data.tokens.refresh);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Check if this is a new user who needs to complete assessment
          if (data.is_new_user || !data.user.has_completed_assessment) {
            navigate('/assessment');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError(data.error || 'Failed to complete authentication');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Network error during authentication');
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const detectProvider = () => {
    // Detect provider from URL or state parameter
    const pathname = window.location.pathname;
    if (pathname.includes('google')) return 'google';
    if (pathname.includes('github')) return 'github';
    if (pathname.includes('linkedin')) return 'linkedin_oauth2';
    
    // Fallback: try to detect from referrer or state
    const state = searchParams.get('state');
    if (state) {
      try {
        const stateData = JSON.parse(atob(state));
        return stateData.provider;
      } catch {}
    }
    
    return 'google'; // Default fallback
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        {loading ? (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Completing authentication...</h2>
            <p className="text-gray-400">Please wait while we set up your account</p>
          </>
        ) : error ? (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Authentication Failed</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
            >
              Back to Login
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
