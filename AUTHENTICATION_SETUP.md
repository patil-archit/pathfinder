# Authentication Setup Guide

## Overview

Your Career Pathfinder application now supports comprehensive authentication including:

- **Regular Email/Password Registration & Login**
- **Social Authentication**: Google, GitHub, LinkedIn
- **API-based Authentication** with JWT tokens
- **Web-based Authentication** with session handling

## API Endpoints

### Regular Authentication

#### Register User
```
POST /api/auth/register/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Account created successfully",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "profile_completion": 0.0
}
```

#### Login User
```
POST /api/auth/login/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "profile_completion": 25.5
}
```

#### Get User Profile
```
GET /api/auth/profile/
Authorization: Bearer <access_token>
```

### Social Authentication

#### Get Social Login URLs
```
GET /api/auth/social/urls/
```

**Response:**
```json
{
    "success": true,
    "social_urls": {
        "google": "http://127.0.0.1:8000/accounts/google/login/",
        "github": "http://127.0.0.1:8000/accounts/github/login/",
        "linkedin": "http://127.0.0.1:8000/accounts/linkedin_oauth2/login/"
    },
    "redirect_uri": "http://127.0.0.1:8000/api/auth/social/success/"
}
```

## Social OAuth Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://127.0.0.1:8000/accounts/google/login/callback/`
   - `http://localhost:8000/accounts/google/login/callback/`
6. Copy Client ID and Client Secret to `.env` file

### 2. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://127.0.0.1:8000/accounts/github/login/callback/`
4. Copy Client ID and Client Secret to `.env` file

### 3. LinkedIn OAuth Setup

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new app
3. Add OAuth 2.0 redirect URLs:
   - `http://127.0.0.1:8000/accounts/linkedin_oauth2/login/callback/`
4. Copy Client ID and Client Secret to `.env` file

## Environment Variables

Update your `.env` file:

```env
# Social Authentication - OAuth Credentials
# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id_here
GOOGLE_OAUTH_SECRET=your_google_client_secret_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_SECRET=your_github_client_secret_here

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_SECRET=your_linkedin_client_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Frontend Integration

### React/JavaScript Example

```javascript
// Register user
const registerUser = async (userData) => {
    const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    return response.json();
};

// Login user
const loginUser = async (credentials) => {
    const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });
    return response.json();
};

// Social login
const getSocialUrls = async () => {
    const response = await fetch('/api/auth/social/urls/');
    return response.json();
};

// Redirect to social provider
const socialLogin = (provider) => {
    window.location.href = socialUrls[provider];
};
```

## Web Authentication (Traditional)

The application also supports traditional web authentication:

- **Login Page**: `/accounts/login/`
- **Signup Page**: `/accounts/signup/`
- **Password Reset**: `/accounts/password/reset/`

These pages include social authentication buttons and will redirect to your React frontend after successful authentication.

## JWT Token Usage

After successful authentication, use the access token for API requests:

```javascript
const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    return fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
};
```

## Token Refresh

Use the refresh token to get new access tokens:

```javascript
const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    
    const response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
    });
    
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
    }
    
    // Token refresh failed, redirect to login
    window.location.href = '/login';
};
```

## Testing Authentication

1. Start your Django server:
   ```bash
   python manage.py runserver
   ```

2. Test API endpoints:
   ```bash
   # Register
   curl -X POST http://127.0.0.1:8000/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123","password_confirm":"testpass123"}'
   
   # Login
   curl -X POST http://127.0.0.1:8000/api/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123"}'
   ```

3. Test web authentication:
   - Visit: `http://127.0.0.1:8000/accounts/login/`
   - Visit: `http://127.0.0.1:8000/accounts/signup/`

## Security Notes

- JWT tokens are stateless and expire automatically
- Social authentication creates user profiles automatically
- Email verification is optional but recommended for production
- CORS is configured for your React frontend
- All passwords are hashed using Django's built-in authentication

## Troubleshooting

1. **OAuth Callback Errors**: Ensure redirect URIs match exactly in provider settings
2. **CORS Issues**: Check CORS_ALLOWED_ORIGINS in settings
3. **Token Errors**: Ensure JWT secret key is set in settings
4. **Social Auth Not Working**: Check provider credentials in .env file
