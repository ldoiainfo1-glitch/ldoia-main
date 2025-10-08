# 🚀 LDOIA Production Deployment Guide

## Architecture Overview

**Frontend (Netlify):**
- React + Vite application
- Deployed to Netlify
- URL: https://your-site.netlify.app

**Backend (Render.com):**
- Node.js Express API
- Deployed to Render
- URL: https://ldoia-backend.onrender.com

---

## 📦 Step 1: Deploy Backend to Render.com

### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repository

### 1.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Muskaan786/ldoia`
3. Configure the service:
   - **Name**: `ldoia-backend`
   - **Region**: Singapore (or closest to India)
   - **Branch**: `main`
   - **Root Directory**: `ldoia-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server-registrations.cjs`
   - **Instance Type**: `Free` (or upgrade for better performance)

### 1.3 Add Environment Variables in Render

Go to **Environment** tab and add these variables:

```plaintext
# MongoDB Connection
MONGODB_URI=mongodb+srv://muskaan7862407:1234567890@cluster0.1yloj.mongodb.net/ldoia_database?retryWrites=true&w=majority

# Server Configuration
NODE_ENV=production
PORT=3001

# Frontend URLs (Update after Netlify deployment)
FRONTEND_URL=https://your-site.netlify.app
ADMIN_FRONTEND_URL=https://your-site.netlify.app/superadmin

# JWT & Security
JWT_SECRET=ldoia_jwt_secret_CHANGE_THIS_IN_PRODUCTION_2024_v2_secure_random_string

# SMS/OTP Configuration
FAST2SMS_API_KEY=Ra3Weq1mDp27byivuZdcr0MEf5Lk8XK64sUPwHOBgSxJIhzGYN3SLbFvqcOoJZ0sE8Q1VBzCGAuDyr5f
FAST2SMS_SENDER_ID=LDOIA
OTP_PROVIDER=fast2sms
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3

# Email Configuration (Update with your production SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_production_email@gmail.com
SMTP_PASS=your_app_specific_password

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
PAYMENT_CURRENCY=INR

# File Upload Settings
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=jpeg,jpg,png,pdf
UPLOAD_DIR=/tmp/uploads

# Database (PostgreSQL - if you're using it)
DB_HOST=your_postgres_host
DB_PORT=5432
DB_NAME=ldoia_applications
DB_USER=ldoia_user
DB_PASSWORD=SECURE_PASSWORD_HERE
```

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment to complete
4. Copy your backend URL: `https://ldoia-backend.onrender.com`

---

## 🌐 Step 2: Deploy Frontend to Netlify

### 2.1 Update Frontend Environment Variables

Create `.env.production` file:

```env
VITE_BACKEND_API_URL=https://ldoia-backend.onrender.com/api
```

### 2.2 Configure Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select `Muskaan786/ldoia`
4. Configure build settings:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**:
     ```
     VITE_BACKEND_API_URL=https://ldoia-backend.onrender.com/api
     ```

### 2.3 Deploy
1. Click **"Deploy site"**
2. Wait for build to complete
3. Get your site URL: `https://your-site.netlify.app`

### 2.4 Update Backend CORS

Go back to Render and update environment variables:
```
FRONTEND_URL=https://your-actual-site.netlify.app
ADMIN_FRONTEND_URL=https://your-actual-site.netlify.app/superadmin
```

Then redeploy the backend.

---

## 🔐 Step 3: Security Checklist

### Production Security Updates:

1. **Change JWT Secret**:
   ```
   JWT_SECRET=GENERATE_A_NEW_SECURE_RANDOM_STRING_256_BITS
   ```
   Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Update Razorpay Keys**:
   - Replace test keys (`rzp_test_*`) with live keys (`rzp_live_*`)
   - Get from: https://dashboard.razorpay.com/app/keys

3. **Update SMTP Credentials**:
   - Use production email account
   - Generate App-Specific Password if using Gmail
   - Guide: https://support.google.com/accounts/answer/185833

4. **Update FAST2SMS API Key**:
   - Verify your production API key is active
   - Check credit balance

5. **Secure MongoDB**:
   - Update password in MongoDB Atlas
   - Add Render's IP to MongoDB Atlas Network Access
   - Enable encryption at rest

---

## 🧪 Step 4: Testing

### Test Backend API:
```bash
# Health check
curl https://ldoia-backend.onrender.com/api/health

# Test CORS
curl -H "Origin: https://your-site.netlify.app" https://ldoia-backend.onrender.com/api/health
```

### Test Frontend:
1. Visit `https://your-site.netlify.app`
2. Test registration form
3. Test promotion card download
4. Test SuperAdmin login

---

## 📊 Monitoring

### Render Dashboard:
- Monitor logs: https://dashboard.render.com/web/[your-service-id]/logs
- Check metrics: CPU, Memory, Response time
- Set up health checks

### Netlify Dashboard:
- Monitor deploys: https://app.netlify.com/sites/[your-site]/deploys
- Check build logs
- Monitor bandwidth

---

## 🔄 Continuous Deployment

Both Render and Netlify auto-deploy when you push to `main` branch:

```bash
git add .
git commit -m "Update production config"
git push origin main
```

---

## 💰 Cost Breakdown

### Free Tier (Recommended for MVP):
- **Render Free**: $0/month
  - 750 hours/month
  - Spins down after 15 min inactivity
  - Slower cold starts (~30 seconds)
  
- **Netlify Free**: $0/month
  - 100GB bandwidth/month
  - Unlimited sites
  - 300 build minutes/month

- **MongoDB Atlas Free**: $0/month
  - 512MB storage
  - Shared cluster

**Total: $0/month**

### Paid Tier (For Production Traffic):
- **Render Starter**: $7/month
  - Always-on instance
  - 512MB RAM
  - Fast response times
  
- **Netlify Pro**: $19/month (optional)
  - 1TB bandwidth
  - More build minutes
  
- **MongoDB Atlas M10**: $57/month (optional)
  - 10GB storage
  - Dedicated cluster

**Total: ~$7-83/month** depending on needs

---

## 🚨 Troubleshooting

### Backend Issues:
1. **500 Errors**: Check Render logs
2. **CORS Errors**: Verify FRONTEND_URL matches Netlify URL exactly
3. **MongoDB Connection**: Check IP whitelist in Atlas (allow 0.0.0.0/0 for Render)
4. **Cold Starts**: Upgrade to paid plan or use UptimeRobot to ping every 5 min

### Frontend Issues:
1. **API Errors**: Verify VITE_BACKEND_API_URL is correct
2. **Build Failures**: Check Node version compatibility
3. **Routing Issues**: Ensure netlify.toml has redirect rules

---

## 📝 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Netlify
3. ✅ Update all environment variables
4. ✅ Test end-to-end functionality
5. ✅ Configure custom domain (optional)
6. ✅ Set up monitoring & alerts
7. ✅ Enable HTTPS (automatic on both platforms)

---

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Razorpay Dashboard](https://dashboard.razorpay.com)
- [FAST2SMS Dashboard](https://www.fast2sms.com)

---

## 💡 Pro Tips

1. **Use Environment Variables**: Never hardcode secrets
2. **Enable Logs**: Monitor errors in production
3. **Set Up Alerts**: Get notified of downtime
4. **Backup Database**: Export MongoDB data regularly
5. **Version Control**: Always commit before deploying
6. **Test Locally**: Use `npm run build` before pushing

---

**Need Help?** Check the troubleshooting section or create an issue on GitHub.
