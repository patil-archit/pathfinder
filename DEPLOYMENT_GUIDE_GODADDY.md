# 🇮🇳 PathFinder AI - GoDaddy India Hosting Guide

## 💰 **GoDaddy India Pricing (Under ₹200/month)**

Perfect choice for Indian developers! GoDaddy offers excellent hosting with local support and Indian payment options.

---

## 🏆 **GoDaddy India Options**

### **Option 1: GoDaddy Shared Hosting** - ₹99/month ⭐ **RECOMMENDED**
- **Economy Plan**: ₹99/month (introductory price)
- **MySQL Database**: Included (10GB)
- **Python/Django Support**: ✅ Available
- **SSL Certificate**: FREE
- **Domain**: 1 FREE domain included
- **Storage**: 100GB SSD
- **Bandwidth**: Unmetered
- **Payment**: UPI, Cards, Net Banking

### **Option 2: GoDaddy WordPress Hosting** - ₹149/month
- **Basic Plan**: ₹149/month
- **WordPress optimized**: Great for Django too
- **MySQL**: Unlimited databases
- **SSL**: FREE
- **Domain**: 1 FREE domain

### **Option 3: GoDaddy VPS** - ₹799/month
- **Full control**: Root access
- **1GB RAM**: Good for Django
- **MySQL**: Self-managed
- **Perfect for**: Advanced users

---

## 🚀 **GoDaddy Shared Hosting Setup (₹99/month)**

### **Step 1: Purchase GoDaddy Hosting**
1. **Go to**: https://in.godaddy.com/hosting/web-hosting
2. **Choose**: Economy Plan (₹99/month)
3. **Payment**: UPI/Cards/Net Banking
4. **Choose domain**: yourappname.com (FREE for first year)

### **Step 2: Access cPanel**
1. **Login to GoDaddy account**
2. **Go to**: My Products → Web Hosting
3. **Click**: "Manage" → "cPanel"
4. **Note**: cPanel username/password

### **Step 3: Create MySQL Database**
1. **In cPanel**: Find "MySQL Databases"
2. **Create Database**: `pathfinder_ai`
3. **Create User**: `pathfinder_user`
4. **Set Password**: Strong password
5. **Grant Privileges**: All privileges to user

### **Step 4: Upload Your Django Project**
You'll need to modify the project slightly for shared hosting.

---

## 🛠️ **Django Configuration for GoDaddy**

### **Create GoDaddy-specific settings:**

```python
# backend/settings_godaddy.py
from .settings import *
import os

# Production settings
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# Database configuration for GoDaddy
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_cpanel_username_pathfinderai',  # GoDaddy format
        'USER': 'your_cpanel_username_pathfinderuser',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

# Static files for shared hosting
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'public_html/static')

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'public_html/media')

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Email settings (GoDaddy SMTP)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtpout.secureserver.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'noreply@yourdomain.com'  # Your domain email
EMAIL_HOST_PASSWORD = 'your_email_password'

# India-specific settings
TIME_ZONE = 'Asia/Kolkata'
LANGUAGE_CODE = 'en-in'
```

---

## 📁 **File Structure for GoDaddy**

```
your_account/
├── public_html/          # Web root (for React build)
│   ├── index.html       # React app entry point
│   ├── static/          # Django static files
│   └── media/           # User uploads
└── pathfinder/          # Django project (above web root)
    ├── manage.py
    ├── backend/
    └── ...
```

---

## 🔧 **Deployment Steps for GoDaddy**

### **Step 1: Prepare Files**
```bash
# 1. Build React frontend
cd pathfinder-frontend
npm run build

# 2. Collect Django static files
cd ..
python manage.py collectstatic --settings=backend.settings_godaddy
```

### **Step 2: Upload Files**
1. **Use File Manager** in cPanel
2. **Upload Django project** above public_html
3. **Copy React build** to public_html
4. **Upload static files** to public_html/static

### **Step 3: Configure .htaccess**
Create `public_html/.htaccess`:
```apache
# Redirect API calls to Django
RewriteEngine On
RewriteRule ^api/(.*)$ /cgi-bin/django.cgi/api/$1 [L,QSA]

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### **Step 4: Configure Python CGI**
Create `public_html/cgi-bin/django.cgi`:
```python
#!/usr/bin/python3
import sys
import os

# Add your project path
sys.path.insert(0, '/home/yourusername/pathfinder')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings_godaddy')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# CGI wrapper
import cgitb
cgitb.enable()

from wsgiref.handlers import CGIHandler
CGIHandler().run(application)
```

---

## 💳 **GoDaddy India Payment Options**

### **Available Payment Methods:**
✅ **UPI** (PhonePe, GPay, Paytm)  
✅ **Net Banking** (All major banks)  
✅ **Credit/Debit Cards** (Visa, Mastercard, RuPay)  
✅ **Digital Wallets** (Paytm, MobiKwik)  
✅ **EMI Options** available  

### **Pricing Breakdown:**
- **Economy Hosting**: ₹99/month (intro) → ₹299/month (renewal)
- **Domain**: FREE for first year
- **SSL Certificate**: FREE
- **Email**: 1 Professional email included

---

## 🇮🇳 **Benefits of GoDaddy India**

### **Why Choose GoDaddy India:**
✅ **Local Support**: Hindi/English phone support  
✅ **Indian Data Centers**: Fast loading in India  
✅ **Local Payments**: UPI, Net Banking, Indian cards  
✅ **Domain Registration**: Easy .in domain management  
✅ **24/7 Support**: Phone and chat support  
✅ **cPanel**: Easy-to-use control panel  
✅ **One-click installs**: WordPress, etc.  

### **Perfect For:**
- **Small businesses** in India
- **Developers** wanting local support
- **Apps targeting Indian users**
- **Cost-conscious** hosting needs

---

## 📊 **Cost Comparison with Other Options**

| Provider | Monthly Cost | Database | Support | Payment |
|----------|-------------|----------|---------|---------|
| **GoDaddy India** | **₹99-₹149** | MySQL included | Hindi/English | UPI/Cards |
| **Hostinger India** | ₹99 | MySQL | English | UPI/Cards |
| **Railway** | ₹125 | Extra cost | English only | International |
| **Render** | ₹0 (limited) | Extra setup | English only | International |

---

## 🚀 **Quick Start with GoDaddy**

### **Ready to Deploy?**
1. **Sign up**: https://in.godaddy.com/hosting/web-hosting
2. **Choose**: Economy Plan (₹99/month)
3. **Payment**: UPI or your preferred method
4. **Domain**: Choose a domain for your PathFinder AI
5. **Setup**: I'll help you configure Django + MySQL

### **Total Monthly Cost:**
- **Hosting**: ₹99/month (first year)
- **Domain**: FREE (first year)  
- **SSL**: FREE
- **Email**: Included
- **Total**: **₹99/month** 🎉

---

## 🤝 **Support Options**

### **GoDaddy India Support:**
- **Phone**: 1800-Go-Daddy (1800-463-2339)
- **Chat**: 24/7 live chat support
- **Email**: Technical support
- **Help Center**: Extensive documentation
- **Language**: Hindi and English support

---

**Would you like to proceed with GoDaddy? It's a great choice for Indian developers wanting:**
- ✅ **Local support**
- ✅ **Indian payment methods** 
- ✅ **Under ₹200/month** budget
- ✅ **Easy setup and management**

Let me know if you want to go with GoDaddy, and I'll help you set it up step by step!