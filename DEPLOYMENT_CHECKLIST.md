# 🚀 LDOIA Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### Security
- [ ] Generate new JWT_SECRET for production
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Update MongoDB password in Atlas
- [ ] Switch Razorpay from TEST to LIVE keys
- [ ] Generate Gmail App-Specific Password for SMTP
- [ ] Verify FAST2SMS API key has sufficient credits
- [ ] Add `.env.production` to `.gitignore` (already done ✓)

### Code Preparation
- [ ] Test build locally: `npm run build`
- [ ] Check for console errors in production build
- [ ] Verify all API endpoints work with test data
- [ ] Test image upload and promotion card generation
- [ ] Test SMS OTP functionality
- [ ] Test payment gateway (use test mode first)

---

## 🔧 Deployment Steps

### Step 1: Deploy Backend to Render.com

1. **Create Render Account**
   - [ ] Sign up at https://render.com
   - [ ] Connect GitHub account
   - [ ] Authorize repository access

2. **Create Web Service**
   - [ ] Click "New +" → "Web Service"
   - [ ] Select `Muskaan786/ldoia` repository
   - [ ] Configure:
     ```
     Name: ldoia-backend
     Region: Singapore
     Branch: main
     Root Directory: ldoia-backend
     Runtime: Node
     Build Command: npm install
     Start Command: node server-registrations.cjs
     Plan: Free (or Starter for production)
     ```

3. **Add Environment Variables** (in Render dashboard)
   - [ ] MONGODB_URI
   - [ ] JWT_SECRET (generate new!)
   - [ ] FAST2SMS_API_KEY
   - [ ] RAZORPAY_KEY_ID (LIVE key)
   - [ ] RAZORPAY_KEY_SECRET (LIVE key)
   - [ ] SMTP_USER
   - [ ] SMTP_PASS
   - [ ] All other vars from `.env.production.example`

4. **Deploy**
   - [ ] Click "Create Web Service"
   - [ ] Wait for build to complete (~5-10 minutes)
   - [ ] Check logs for "Connected to MongoDB Atlas"
   - [ ] Copy backend URL: `https://ldoia-backend.onrender.com`
   - [ ] Test health endpoint: `https://ldoia-backend.onrender.com/api/health`

### Step 2: Deploy Frontend to Netlify

1. **Update Frontend Config**
   - [ ] Edit `.env.production`:
     ```
     VITE_BACKEND_API_URL=https://ldoia-backend.onrender.com/api
     ```

2. **Deploy to Netlify**
   - [ ] Go to https://app.netlify.com
   - [ ] Click "Add new site" → "Import an existing project"
   - [ ] Select `Muskaan786/ldoia` from GitHub
   - [ ] Configure:
     ```
     Branch: main
     Build command: npm run build
     Publish directory: dist
     ```
   - [ ] Add environment variable:
     ```
     VITE_BACKEND_API_URL=https://ldoia-backend.onrender.com/api
     ```

3. **Deploy**
   - [ ] Click "Deploy site"
   - [ ] Wait for build (~5 minutes)
   - [ ] Copy site URL: `https://your-site-name.netlify.app`

### Step 3: Update CORS Configuration

1. **Update Backend Environment Variables in Render**
   - [ ] Go back to Render dashboard
   - [ ] Update:
     ```
     FRONTEND_URL=https://your-site-name.netlify.app
     ADMIN_FRONTEND_URL=https://your-site-name.netlify.app/superadmin
     ```
   - [ ] Redeploy backend (click "Manual Deploy" → "Deploy latest commit")

### Step 4: Configure MongoDB Atlas

1. **Update Network Access**
   - [ ] Go to MongoDB Atlas → Network Access
   - [ ] Click "Add IP Address"
   - [ ] Add `0.0.0.0/0` (allow from anywhere) for Render
   - [ ] Or find Render's static IP and add that

2. **Verify Connection**
   - [ ] Check Render logs for MongoDB connection success
   - [ ] Test API endpoint that queries database

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Health check: `curl https://ldoia-backend.onrender.com/api/health`
- [ ] CORS test: `curl -H "Origin: https://your-site.netlify.app" https://ldoia-backend.onrender.com/api/health`
- [ ] Test registration endpoint
- [ ] Test promotion images upload
- [ ] Test promotion card generation
- [ ] Check logs for errors

### Frontend Tests
- [ ] Visit homepage: `https://your-site.netlify.app`
- [ ] Test navigation (all pages load)
- [ ] Test registration form (Committee)
- [ ] Test registration form (Advisory)
- [ ] Test SuperAdmin login: `/superadmin`
- [ ] Upload promotion template
- [ ] Download promotion card
- [ ] Check browser console for errors
- [ ] Test on mobile device

### Integration Tests
- [ ] Complete registration flow end-to-end
- [ ] Verify data saved in MongoDB
- [ ] Test SMS OTP (if enabled)
- [ ] Test email notifications (if enabled)
- [ ] Test payment gateway (use test mode first)
- [ ] Test promotion card download with all languages

---

## 🔍 Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor Render logs for errors
- [ ] Check Netlify deploy logs
- [ ] Monitor MongoDB Atlas metrics
- [ ] Test all critical user flows
- [ ] Check response times
- [ ] Verify no CORS errors

### Ongoing
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error alerting
- [ ] Monitor API usage
- [ ] Check database storage usage
- [ ] Review logs weekly

---

## 🚨 Rollback Plan

If something goes wrong:

### Rollback Frontend (Netlify)
1. Go to Netlify dashboard → Deploys
2. Find last working deploy
3. Click "Publish deploy"

### Rollback Backend (Render)
1. Go to Render dashboard → Deploys
2. Find last working deploy
3. Click "Redeploy"

### Emergency
- [ ] Revert Git commit: `git revert HEAD`
- [ ] Push: `git push origin main`
- [ ] Both platforms will auto-redeploy

---

## 📊 Performance Optimization

### After Deployment
- [ ] Enable Netlify CDN (automatic)
- [ ] Compress images in `/public` folder
- [ ] Enable gzip compression (automatic on both platforms)
- [ ] Set up database indexes in MongoDB
- [ ] Monitor cold start times (Render free tier)
- [ ] Consider upgrading to Render Starter ($7/month) for always-on

### Optional Improvements
- [ ] Add custom domain
- [ ] Set up SSL (automatic on Netlify/Render)
- [ ] Configure CDN for static assets
- [ ] Enable database backups
- [ ] Set up staging environment

---

## 🔗 Important URLs

**Production URLs:**
- Frontend: `https://your-site-name.netlify.app`
- Backend: `https://ldoia-backend.onrender.com`
- SuperAdmin: `https://your-site-name.netlify.app/superadmin`

**Dashboards:**
- Render: https://dashboard.render.com
- Netlify: https://app.netlify.com
- MongoDB Atlas: https://cloud.mongodb.com
- Razorpay: https://dashboard.razorpay.com
- FAST2SMS: https://www.fast2sms.com

**Documentation:**
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Backend: `ldoia-backend/server-registrations.cjs`
- Frontend: `client/`

---

## 📞 Support

If you encounter issues:

1. **Check Logs First**
   - Render: Dashboard → Logs
   - Netlify: Dashboard → Deploy logs
   - Browser: DevTools → Console/Network

2. **Common Issues**
   - CORS errors: Verify FRONTEND_URL in Render
   - MongoDB errors: Check Network Access in Atlas
   - Build failures: Check Node version compatibility
   - API 404s: Verify VITE_BACKEND_API_URL

3. **Get Help**
   - Render docs: https://render.com/docs
   - Netlify docs: https://docs.netlify.com
   - MongoDB docs: https://docs.mongodb.com

---

## ✅ Final Checklist

Before going live:
- [ ] All tests passing ✅
- [ ] No errors in logs ✅
- [ ] HTTPS enabled ✅
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up ✅
- [ ] Backups configured ✅
- [ ] Team has access to dashboards ✅
- [ ] Documentation updated ✅

**🎉 Ready for Production!**

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Backend URL:** _____________  
**Frontend URL:** _____________
