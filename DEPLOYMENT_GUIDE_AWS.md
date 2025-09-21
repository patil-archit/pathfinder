# ☁️ PathFinder AI - AWS India Hosting Guide

## 💰 **AWS Pricing (Under ₹200/month)**

AWS is perfect for scalable hosting and offers excellent free tier options for new users!

---

## 🆓 **AWS Free Tier (12 Months FREE)**

### **Perfect for New AWS Users:**
✅ **EC2**: 750 hours/month of t2.micro instance (FREE)  
✅ **RDS MySQL**: 750 hours/month of db.t2.micro (FREE)  
✅ **S3**: 5GB storage (FREE)  
✅ **Data Transfer**: 15GB/month (FREE)  
✅ **Route 53**: Hosted zone (FREE)  

**Total Cost: ₹0/month for first year!** 🎉

---

## 🏆 **AWS Options for India**

### **Option 1: AWS Free Tier** - ₹0/month (12 months) ⭐ **RECOMMENDED**
- **EC2 t2.micro**: Django backend hosting
- **RDS MySQL**: Free database
- **S3**: Static file storage
- **CloudFront**: CDN for React app
- **Route 53**: DNS management
- **Perfect for**: Learning, testing, small apps

### **Option 2: AWS Pay-as-you-go** - ₹150-300/month
- **EC2 t3.micro**: ₹500-800/month
- **RDS**: ₹300-500/month  
- **S3 + CloudFront**: ₹50-100/month
- **Total**: Depends on usage

### **Option 3: AWS Lightsail** - ₹280/month ($3.50)
- **All-in-one**: VPS + Database + Storage
- **Easy setup**: WordPress-like simplicity
- **Fixed pricing**: No surprises
- **Great for**: Simple deployments

---

## 🚀 **AWS Free Tier Setup (₹0/month)**

### **Step 1: Create AWS Account**
1. **Go to**: https://aws.amazon.com
2. **Sign up**: Use your email/phone
3. **Verification**: Phone + Credit card (₹2 charge, refunded)
4. **Choose**: Basic support (FREE)

### **Step 2: Launch EC2 Instance (Django Backend)**
```bash
# Instance Configuration
Instance Type: t2.micro (FREE tier eligible)
OS: Amazon Linux 2 or Ubuntu 22.04
Storage: 30GB EBS (FREE tier eligible)
Security Group: HTTP (80), HTTPS (443), SSH (22)
Region: ap-south-1 (Mumbai)
```

### **Step 3: Setup RDS MySQL (Database)**
```bash
# Database Configuration  
Engine: MySQL 8.0
Instance: db.t2.micro (FREE tier eligible)
Storage: 20GB (FREE tier eligible)
Region: ap-south-1 (Mumbai)
Multi-AZ: No (to stay in free tier)
```

### **Step 4: Configure S3 (Static Files)**
```bash
# S3 Bucket for React build + Django static files
Bucket Name: pathfinder-ai-static
Region: ap-south-1 (Mumbai)
Public Access: Enabled for static files
Storage Class: Standard
```

---

## 🛠️ **AWS Deployment Architecture**

```
User Request
     ↓
CloudFront CDN (Global)
     ↓
S3 Bucket (React App)
     ↓
ALB/Route 53 (Load Balancer)
     ↓
EC2 Instance (Django API)
     ↓
RDS MySQL (Database)
```

---

## 💻 **Step-by-Step AWS Deployment**

### **1. Setup EC2 Instance**
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Python and dependencies
sudo yum update -y
sudo yum install python3 python3-pip git nginx -y

# Clone your project
git clone https://github.com/patil-archit/pathfinder.git
cd pathfinder

# Install dependencies
pip3 install -r requirements-prod.txt

# Install additional AWS packages
pip3 install boto3 django-storages
```

### **2. Configure Django for AWS**
Create `backend/settings_aws.py`:
```python
from .settings import *
import os

# Production settings
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'your-ec2-ip.amazonaws.com']

# Database - RDS MySQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'pathfinder_ai',
        'USER': 'admin',
        'PASSWORD': os.environ.get('RDS_PASSWORD'),
        'HOST': 'your-rds-endpoint.rds.amazonaws.com',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = 'pathfinder-ai-static'
AWS_S3_REGION_NAME = 'ap-south-1'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'

# Static files configuration
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# Media files configuration  
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# India-specific settings
TIME_ZONE = 'Asia/Kolkata'
LANGUAGE_CODE = 'en-in'
```

### **3. Setup Nginx**
Create `/etc/nginx/sites-available/pathfinder`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
        root /home/ec2-user/pathfinder/pathfinder-frontend/dist;
    }
    
    location /static/ {
        return 301 https://pathfinder-ai-static.s3.ap-south-1.amazonaws.com$request_uri;
    }
}
```

### **4. Deploy React to S3**
```bash
# Build React app
cd pathfinder-frontend
npm install
npm run build

# Upload to S3
aws s3 sync dist/ s3://pathfinder-ai-static/ --delete
aws s3 website s3://pathfinder-ai-static --index-document index.html
```

---

## 💳 **AWS Billing and Cost Management**

### **Free Tier Limits (12 months):**
- **EC2**: 750 hours/month (run 24/7 for free)
- **RDS**: 750 hours/month
- **S3**: 5GB storage, 20,000 GET requests
- **Data Transfer**: 15GB/month out

### **After Free Tier (Monthly Costs):**
- **EC2 t3.micro**: ~₹800/month
- **RDS db.t3.micro**: ~₹600/month
- **S3**: ~₹50/month (first 50TB)
- **CloudFront**: ~₹100/month
- **Total**: ~₹1,550/month

---

## 🇮🇳 **AWS Benefits for India**

### **Why AWS is Great for India:**
✅ **Mumbai Region**: ap-south-1 (lowest latency)  
✅ **Free Tier**: 12 months free for new users  
✅ **Scalability**: Grow as your app grows  
✅ **Professional**: Used by major companies  
✅ **Learning**: Great for cloud skills  
✅ **Support**: 24/7 technical support  

### **Payment Options:**
✅ **Credit Cards**: Visa, Mastercard  
✅ **Debit Cards**: International debit cards  
✅ **Net Banking**: Some banks supported  
✅ **UPI**: Through payment partners  

---

## 📊 **Cost Comparison**

| Provider | Year 1 | Year 2+ | Scalability | Learning Value |
|----------|--------|---------|-------------|----------------|
| **AWS** | **₹0** | ₹1,550/month | Excellent | High |
| **GoDaddy** | ₹89/month | ₹299/month | Limited | Medium |
| **Free Hosting** | ₹0 | ₹0 | None | Medium |

---

## 🎯 **AWS Recommendation for You**

### **Perfect If You:**
- ✅ **Want to learn cloud computing**
- ✅ **Plan to scale your app**
- ✅ **Are eligible for free tier** (new AWS user)
- ✅ **Want professional hosting**
- ✅ **Don't mind technical setup**

### **Not Ideal If You:**
- ❌ **Want simple setup** (GoDaddy is easier)
- ❌ **Already used AWS free tier**
- ❌ **Prefer local support** in Hindi
- ❌ **Want predictable pricing**

---

## 🚀 **Quick Start with AWS**

### **Ready to Try AWS?**
1. **Sign up**: https://aws.amazon.com
2. **Verify**: Phone + Credit card
3. **Choose region**: ap-south-1 (Mumbai)
4. **Launch**: Free tier instances
5. **Deploy**: I'll help you step by step

### **Free Tier Benefits:**
- **12 months FREE** for new users
- **Perfect for learning** cloud technologies
- **Professional setup** for your portfolio
- **Unlimited potential** for scaling

---

## 🤔 **AWS vs Other Options**

**Choose AWS if:**
- You want to learn cloud computing
- You're eligible for free tier
- You plan to scale your app
- You want professional hosting

**Choose GoDaddy if:**
- You want simple setup
- You prefer local support
- You want predictable pricing
- You don't need advanced features

**Choose Free Hosting if:**
- Budget is ₹0 only
- It's just for portfolio/learning
- You don't need custom domains
- You're okay with limitations

---

**Would you like to try AWS? It's excellent for learning and completely FREE for the first year if you're eligible for the free tier!**

Let me know if you want to proceed with AWS, and I'll guide you through the setup! 🚀