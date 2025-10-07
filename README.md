# LDOIA - Lokshahi Daivadnyanche Ola India (लोकशाही दैवज्ञांचे ओळा इंडिया)

Official website and management system for LDOIA organization.

## 🌐 Live Deployments

- **Main Website**: https://ldoia.com
- **Super Admin Panel**: https://admin.ldoia.com (or subdomain of your choice)

## 📋 Project Overview

This repository contains three main components:

1. **Main Website (`/client`)** - Public-facing website with registration, gallery, committee info
2. **Super Admin Panel (`/super-admin`)** - Administrative dashboard for managing applications
3. **Backend API (`/ldoia-backend`)** - Node.js/Express server with MongoDB

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB Atlas
- **Image Processing**: Sharp (for promotion cards & ID cards)
- **Deployment**: 
  - Frontend: Vercel/Netlify
  - Backend: Railway/Render/DigitalOcean
  - Database: MongoDB Atlas

## 📦 Features

- ✅ Multi-language support (10 Indian languages)
- ✅ Committee & Advisory member registration
- ✅ Application approval workflow
- ✅ ID card generation
- ✅ Promotion card generation with personalization
- ✅ Referral code system
- ✅ Gallery management
- ✅ Contact form with SMS notifications

---

## 🚀 Deployment Guide

### Prerequisites

Before deployment, ensure you have:

- [ ] Domain: `ldoia.com` (DNS access)
- [ ] MongoDB Atlas account (free tier works)
- [ ] Vercel/Netlify account (for frontend)
- [ ] Railway/Render account (for backend)
- [ ] Git repository (GitHub/GitLab)

---

### Step 1: Setup MongoDB Atlas (Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Database Cluster**
   ```
   Cluster Name: ldoia-cluster
   Region: Choose nearest to your users (e.g., Mumbai for India)
   Tier: M0 Free
   ```

3. **Create Database User**
   ```
   Username: ldoia_admin
   Password: [Generate strong password - SAVE THIS!]
   ```

4. **Whitelist IP Addresses**
   - Go to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - (For production, restrict to specific IPs)

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string:
   ```
   mongodb+srv://ldoia_admin:<password>@ldoia-cluster.xxxxx.mongodb.net/ldoia_database?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - **IMPORTANT**: Database name is `ldoia_database`

---

### Step 2: Prepare Code for Deployment

#### 2.1 Update Environment Variables

Create `.env` file in project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://ldoia_admin:YOUR_PASSWORD@ldoia-cluster.xxxxx.mongodb.net/ldoia_database?retryWrites=true&w=majority

# API Configuration
PORT=3001
NODE_ENV=production

# SMS Configuration (if using)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=LDOIA

# Frontend URL (for CORS)
FRONTEND_URL=https://ldoia.com
ADMIN_URL=https://admin.ldoia.com
```

#### 2.2 Update CORS Settings

In `/ldoia-backend/server-registrations.cjs`, update CORS configuration:

```javascript
const cors = require('cors');
app.use(cors({
  origin: [
    'https://ldoia.com',
    'https://www.ldoia.com',
    'https://admin.ldoia.com',
    'http://localhost:5173', // for local development
    'http://localhost:8082'
  ],
  credentials: true
}));
```

---

### Step 3: Deploy Backend (Railway Recommended)

#### Option A: Deploy to Railway

1. **Sign up at Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `ldoia-main` repository

3. **Configure Build Settings**
   ```
   Root Directory: ldoia-backend
   Build Command: npm install
   Start Command: node server-registrations.cjs
   ```

4. **Add Environment Variables**
   - Go to Variables tab
   - Add all variables from `.env` file
   - **Important**: Add these variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=3001
     NODE_ENV=production
     FRONTEND_URL=https://ldoia.com
     ADMIN_URL=https://admin.ldoia.com
     ```

5. **Deploy**
   - Railway will auto-deploy
   - Note your backend URL: `https://ldoia-backend-production.up.railway.app`

#### Option B: Deploy to Render

1. **Sign up at Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your repository

3. **Configure Service**
   ```
   Name: ldoia-backend
   Root Directory: ldoia-backend
   Environment: Node
   Build Command: npm install
   Start Command: node server-registrations.cjs
   Plan: Free
   ```

4. **Add Environment Variables**
   - Same as Railway (Step 3.4 above)

5. **Deploy**
   - Note your backend URL: `https://ldoia-backend.onrender.com`

---

### Step 4: Deploy Main Website to Netlify

#### 4.1 Update API Endpoint (Before Deployment)

In `/client/services/apiService.ts`, update the base URL:

```typescript
const API_BASE_URL = 'https://ldoia-backend-production.up.railway.app';
// OR
const API_BASE_URL = 'https://ldoia-backend.onrender.com';
```

#### 4.2 Netlify Deployment Configuration

**Repository:** `https://github.com/Muskaan786/ldoia.git`

**Team:** Developer

**Branch to Deploy:** `main`

##### Build Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Base directory** | Leave empty | Root of repository |
| **Build command** | `npm run build` | Vite build command |
| **Publish directory** | `dist` | Vite output directory |
| **Functions directory** | `netlify/functions` | Optional (if using Netlify Functions) |

##### Environment Variables

Add these environment variables in Netlify dashboard:

```env
# API Configuration (if needed in frontend)
VITE_API_BASE_URL=https://your-backend-url.railway.app

# Optional: Analytics, tracking IDs
VITE_GA_TRACKING_ID=your-google-analytics-id
```

**Note:** 
- All environment variables for Vite must be prefixed with `VITE_`
- Set scope to "All scopes"
- Set deploy context to "All deploy contexts"

##### Deploy Configuration Steps

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Click "Add new site"** → "Import an existing project"
3. **Connect to GitHub**: Authorize Netlify to access your repositories
4. **Select Repository**: Choose `Muskaan786/ldoia`
5. **Configure Build Settings**:
   - Team: **Developer**
   - Branch: **main**
   - Base directory: **(leave empty)**
   - Build command: **npm run build**
   - Publish directory: **dist**
6. **Click "Deploy site"**

#### 4.3 Configure Custom Domain (ldoia.com)

1. **In Netlify Dashboard**:
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter: `ldoia.com`
   - Click "Verify" and "Add domain"

2. **Add www subdomain**:
   - Click "Add domain alias"
   - Enter: `www.ldoia.com`

3. **Enable HTTPS**:
   - Netlify will auto-provision SSL certificate
   - Wait 24-48 hours for DNS propagation

#### 4.4 Update DNS Records

**At your domain registrar (GoDaddy, Namecheap, etc.):**

```
Type    Name    Value                           TTL
A       @       75.2.60.5                       3600
CNAME   www     your-site-name.netlify.app      3600
```

**Or use Netlify DNS (Recommended):**
- Go to Domain management → Netlify DNS
- Follow instructions to update nameservers at your registrar

---

### Step 5: Deploy Super Admin Panel to Netlify

#### 5.1 Update API Endpoint

In `/super-admin/index.html`, update API endpoint:

```javascript
const API_BASE_URL = 'https://ldoia-backend-production.up.railway.app';
```

#### 5.2 Deploy Super Admin

**Option A: Deploy as Separate Site on Netlify**

1. **Create New Site on Netlify**:
   - Click "Add new site" → "Import an existing project"
   - Select `Muskaan786/ldoia` repository
   - Configure:
     - Team: **Developer**
     - Branch: **main**
     - Base directory: **super-admin**
     - Build command: **(leave empty)** - static HTML
     - Publish directory: **.** (current directory)

2. **Configure Subdomain**:
   - Go to Domain management
   - Add custom domain: `admin.ldoia.com`
   - Update DNS with CNAME record

**Option B: Deploy to Netlify from CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy super admin
cd super-admin
netlify deploy --prod --dir=.
```

#### 5.3 DNS Configuration for Subdomain

Add this CNAME record at your domain registrar:

```
Type    Name     Value
CNAME   admin    your-super-admin-site.netlify.app    3600
```

---

### Step 6: Post-Deployment Configuration

#### 6.1 Test Deployments

1. **Test Main Website**
   - Visit https://ldoia.com
   - Check registration forms
   - Verify gallery loads
   - Test language switching

2. **Test Super Admin**
   - Visit https://admin.ldoia.com
   - Login with super admin credentials
   - Test application approval flow
   - Upload promotion templates

3. **Test Backend API**
   ```bash
   curl https://ldoia-backend-production.up.railway.app/api/health
   ```

#### 6.2 Configure Super Admin Access

1. **Create Super Admin Config**

   In `/client/config/super-admin-config.js`:

   ```javascript
   export const SUPER_ADMIN_CREDENTIALS = {
     username: 'admin@ldoia.com',
     password: 'your-secure-password' // CHANGE THIS!
   };
   ```

2. **Secure Super Admin Panel**
   - Add authentication
   - Use environment variables for credentials
   - Enable HTTPS only

#### 6.3 Upload Initial Data

1. **Upload Promotion Templates**
   - Login to admin panel
   - Go to Promotion Images section
   - Upload templates for all 10 languages

2. **Test ID Card Generation**
   - Approve a test application
   - Generate ID card
   - Verify image composition

---

### Step 7: DNS Configuration Summary

**At your domain registrar (e.g., GoDaddy, Namecheap):**

##### For Netlify Deployment:

```
# Main Website (ldoia.com)
Type    Name    Value                           TTL
A       @       75.2.60.5                       3600
CNAME   www     your-site-name.netlify.app      3600

# Super Admin Subdomain (admin.ldoia.com)
CNAME   admin   your-admin-site.netlify.app     3600

# Email (if needed)
MX      @       mail.ldoia.com                  3600
```

**Alternative: Use Netlify DNS (Recommended)**

Instead of configuring individual records, you can use Netlify DNS:

1. Go to Netlify Dashboard → Domain management
2. Click "Use Netlify DNS"
3. Copy the nameserver addresses provided
4. Update nameservers at your domain registrar:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
5. Wait 24-48 hours for DNS propagation

---

## 📋 Quick Netlify Deployment Checklist

Use this checklist when deploying to Netlify:

### Main Website Deployment

- [ ] Repository pushed to GitHub: `https://github.com/Muskaan786/ldoia.git`
- [ ] Backend deployed and URL obtained
- [ ] API endpoint updated in `/client/services/apiService.ts`
- [ ] Netlify site created from repository
- [ ] Build settings configured:
  - [ ] Branch: `main`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
- [ ] Environment variables added (if any)
- [ ] Custom domain `ldoia.com` added
- [ ] DNS records configured
- [ ] HTTPS/SSL certificate provisioned
- [ ] Site tested and working

### Super Admin Deployment

- [ ] API endpoint updated in `/super-admin/index.html`
- [ ] Separate Netlify site created for super-admin
- [ ] Build settings configured:
  - [ ] Branch: `main`
  - [ ] Base directory: `super-admin`
  - [ ] Publish directory: `.`
- [ ] Subdomain `admin.ldoia.com` configured
- [ ] DNS CNAME record added for admin subdomain
- [ ] Admin panel tested and accessible

---

## 🔧 Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ldoia-main.git
cd ldoia-main
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd ldoia-backend
npm install
cd ..
```

### 3. Configure Environment

Create `.env` file with your MongoDB credentials (see Step 2.1)

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd ldoia-backend
node server-registrations.cjs
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - Super Admin (optional):**
```bash
cd super-admin
python3 -m http.server 8000
```

### 5. Access Applications

- Main Website: http://localhost:5173
- Backend API: http://localhost:3001
- Super Admin: http://localhost:8000

---

## 📚 API Endpoints

### Registration
- `POST /api/register` - Submit application
- `GET /api/applications` - Get all applications

### Committee Management
- `GET /api/committee/:level` - Get committee members
- `GET /api/advisory/:level` - Get advisory members
- `PUT /api/applications/:id/approve` - Approve application

### Promotion Cards
- `POST /api/promotions/upload-image` - Upload template
- `GET /api/promotions/records` - Get promotion records
- `GET /api/promotions/generate` - Generate personalized card

### ID Cards
- `GET /api/id-card/:memberId` - Generate ID card

---

## 🔐 Security Checklist

- [ ] Change default super admin password
- [ ] Enable HTTPS on all deployments
- [ ] Restrict MongoDB IP whitelist
- [ ] Add rate limiting to API endpoints
- [ ] Enable CORS only for your domains
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Regular database backups
- [ ] Monitor API usage and errors

---

## 📊 Monitoring & Maintenance

### Database Backups

**MongoDB Atlas Auto-Backup:**
- Go to Atlas Dashboard
- Enable continuous backup (paid feature)
- Or manually export data weekly

### Application Monitoring

**Railway/Render:**
- Check logs regularly
- Set up alerts for errors
- Monitor memory/CPU usage

**Vercel:**
- Monitor build logs
- Check analytics for traffic
- Set up error tracking (Sentry)

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
- Check MongoDB connection string
- Verify IP whitelist includes deployment server
- Ensure database name is `ldoia_database`

### Issue: "CORS error"
**Solution:**
- Update CORS configuration in backend
- Add your frontend URL to allowed origins

### Issue: "Promotion cards not generating"
**Solution:**
- Verify Sharp library installed: `npm list sharp`
- Check image upload permissions
- Review backend logs for errors

### Issue: "Applications not showing in admin panel"
**Solution:**
- Check API endpoint URL in admin panel
- Verify backend is running
- Check browser console for errors

---

## 📞 Support & Contact

- **Technical Issues**: Create issue on GitHub
- **LDOIA Organization**: contact@ldoia.com
- **Developer**: [Your contact info]

---

## 📄 License

© 2025 LDOIA - All Rights Reserved

---

## 🙏 Acknowledgments

Built with ❤️ for Lokshahi Daivadnyanche Ola India

---

## 📝 Changelog

### Version 1.0.0 (October 2025)
- ✅ Initial release
- ✅ Registration system
- ✅ Committee management
- ✅ ID card generation
- ✅ Promotion card feature
- ✅ Multi-language support
- ✅ Gallery & contact forms

---

## 🔜 Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Email notification system
- [ ] Member directory search
- [ ] Event management module

---

**Last Updated:** October 8, 2025
