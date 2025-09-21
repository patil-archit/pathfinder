# 🚀 PathFinder AI Deployment Guide - Railway (Cheapest Option)

## 💰 Total Cost: **$5-10/month**

This guide will help you deploy your PathFinder AI Career Advisor application to Railway for the cheapest possible hosting costs.

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Your project pushed to GitHub

## 🛠️ Step 1: Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Verify these files are in your repository**:
   - ✅ `requirements-prod.txt`
   - ✅ `backend/settings_prod.py`
   - ✅ `railway.json`
   - ✅ `nixpacks.toml`
   - ✅ `.env.production` (template)

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `career_pathfinder` repository
5. Railway will automatically detect it's a Django project

### 2.2 Add PostgreSQL Database
1. In your Railway project dashboard, click **"New Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL database and provide a `DATABASE_URL`

### 2.3 Configure Environment Variables
In Railway project settings, add these environment variables:

```bash
# Required Variables
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
DEBUG=False
DJANGO_SETTINGS_MODULE=backend.settings_prod

# Frontend URLs (update after frontend deployment)
FRONTEND_URL=https://your-app-name.vercel.app
FRONTEND_DOMAIN=your-app-name.vercel.app

# Optional: AI Services
OPENAI_API_KEY=sk-your-openai-key-here
GOOGLE_AI_API_KEY=your-google-ai-key

# Optional: Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 2.4 Deploy Backend
1. Railway will automatically deploy your backend
2. Your backend URL will be: `https://your-project-name.up.railway.app`
3. Wait for deployment to complete (check logs for any issues)

## 🌐 Step 3: Deploy Frontend to Vercel (Free)

### 3.1 Prepare Frontend
1. **Update frontend environment**:
   ```bash
   cd pathfinder-frontend
   echo "VITE_API_URL=https://your-railway-backend-url.up.railway.app" > .env.production
   ```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Select your repository
4. Set **Root Directory** to `pathfinder-frontend`
5. **Environment Variables**:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app
   ```
6. Click **"Deploy"**

### 3.3 Update Backend CORS
1. Go back to Railway dashboard
2. Update environment variables:
   ```bash
   FRONTEND_URL=https://your-app.vercel.app
   FRONTEND_DOMAIN=your-app.vercel.app
   ```
3. Redeploy the backend service

## ⚙️ Step 4: Database Setup

1. **Access Railway PostgreSQL**:
   ```bash
   # Use Railway CLI or web terminal
   railway login
   railway connect
   python manage.py migrate
   python manage.py createsuperuser
   ```

2. **Or connect directly**:
   - Get database credentials from Railway dashboard
   - Use a PostgreSQL client to connect and run migrations

## 🔍 Step 5: Verify Deployment

### Backend Health Check
Visit: `https://your-railway-app.up.railway.app/api/health/`
Should return: `{"status": "healthy", "service": "PathFinder AI Career Advisor"}`

### Frontend Check
Visit: `https://your-app.vercel.app`
Should load your React application

### API Connection Test
1. Open browser dev tools
2. Go to your frontend URL
3. Check Network tab - API calls should go to your Railway backend

## 💡 Cost Optimization Tips

### Railway (Backend + Database)
- **Starter Plan**: $5/month for 512MB RAM, 1GB storage
- **PostgreSQL**: Included with starter plan
- **Automatic sleep**: App sleeps after 30 minutes of inactivity (hobby plan)

### Vercel (Frontend)
- **Free Plan**: Perfect for frontend hosting
- **Bandwidth**: 100GB/month included
- **Builds**: 6000 build minutes/month

### **Total Monthly Cost: $5** 🎉

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check Railway logs
   railway logs
   
   # Common fixes:
   # - Ensure requirements-prod.txt has all dependencies
   # - Check Python version in nixpacks.toml
   ```

2. **Database Connection Issues**:
   ```bash
   # Verify DATABASE_URL is set
   echo $DATABASE_URL
   
   # Check if migrations ran
   python manage.py showmigrations
   ```

3. **CORS Errors**:
   - Ensure FRONTEND_URL is correctly set in Railway
   - Check backend/settings_prod.py CORS configuration

4. **Static Files Not Loading**:
   ```bash
   # Force collect static files
   python manage.py collectstatic --clear --noinput
   ```

### Debug Mode
Temporarily enable debug mode by setting `DEBUG=True` in Railway environment variables (remember to turn off after debugging).

## 🔧 Alternative Cheap Options

### If Railway doesn't work for you:

1. **Render**: $7/month (Web Service) + $7/month (PostgreSQL)
2. **DigitalOcean App Platform**: $5/month basic
3. **Fly.io**: $3-8/month (pay-per-use)

## 🎯 Production Optimizations

### Performance Improvements
```python
# Add to settings_prod.py for better performance
DATABASES['default']['OPTIONS'] = {
    'MAX_CONNS': 20,
    'OPTIONS': {
        'MAX_CONNS': 20,
    }
}

# Enable caching if you add Redis
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.getenv('REDIS_URL'),
    }
}
```

### Security Headers
```python
# Add to settings_prod.py
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
```

## 📈 Monitoring & Maintenance

1. **Railway Dashboard**: Monitor resource usage and logs
2. **Vercel Analytics**: Track frontend performance
3. **Database Backups**: Railway provides automatic backups
4. **Error Monitoring**: Consider adding Sentry for production

## 🎉 Congratulations!

Your PathFinder AI Career Advisor is now deployed for just **$5/month**!

### Access Your Application:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-railway-app.up.railway.app/api/
- **Admin Panel**: https://your-railway-app.up.railway.app/admin/

---

## 📞 Need Help?

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Django Deployment**: [docs.djangoproject.com/en/stable/howto/deployment/](https://docs.djangoproject.com/en/stable/howto/deployment/)

**Happy deploying! 🚀**