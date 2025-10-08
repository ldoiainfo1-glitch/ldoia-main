# 🎯 RENDER FIX - STEP BY STEP VISUAL GUIDE

## Problem: "Cannot find module 'sharp'"

This happens because Render is running `npm install` in the **root** folder, but trying to start the server from the `ldoia-backend` folder where dependencies aren't installed.

---

## 🔧 SOLUTION (Takes 2 minutes)

### Step 1: Go to Render Dashboard
🌐 https://dashboard.render.com

### Step 2: Find Your Service
Look for: **"ldoia-backend"** or your service name

### Step 3: Click on Settings Tab
Top navigation: `Deploy` | **`Settings`** | `Environment` | etc.

### Step 4: Scroll to "Build & Deploy"

You'll see a section that looks like this:

```
┌─────────────────────────────────────────────┐
│  Build & Deploy                             │
├─────────────────────────────────────────────┤
│  Root Directory:  [________________]        │
│  Build Command:   [________________]        │
│  Start Command:   [________________]        │
└─────────────────────────────────────────────┘
```

### Step 5: Update These 3 Fields

**🎯 IMPORTANT: Set these EXACT values:**

```
Root Directory:  ldoia-backend
Build Command:   npm install  
Start Command:   node server-registrations.cjs
```

**Visual Guide:**

```
┌─────────────────────────────────────────────┐
│  Build & Deploy                             │
├─────────────────────────────────────────────┤
│  Root Directory:  ldoia-backend        ✅   │
│  Build Command:   npm install          ✅   │
│  Start Command:   node server-registrations.cjs ✅
└─────────────────────────────────────────────┘
```

### Step 6: Save Changes
Click the **"Save Changes"** button at the bottom

### Step 7: Manual Deploy
1. Look for **"Manual Deploy"** button (top right area)
2. Click it
3. Select **"Deploy latest commit"**
4. Click **"Deploy"**

### Step 8: Watch the Build Log

You should see:

```
✅ ==> Cloning from https://github.com/ldoiainfo1-glitch/ldoia-main
✅ ==> Root directory: ldoia-backend
✅ ==> Running build command 'npm install'
   
   Installing sharp...
   Installing express...
   Installing mongodb...
   ... (lots of packages)
   
   added 688 packages in 45s
   
✅ Build successful 🎉

✅ ==> Running 'node server-registrations.cjs'
   
   📊 Database name: ldoia_database
   🚀 LDOIA Registration Server running on port 3001
   ✅ Connected to MongoDB Atlas - Database: ldoia_database
```

---

## ✅ SUCCESS INDICATORS

### You'll know it worked when:

1. **Build Log shows:**
   - ✅ "Root directory: ldoia-backend"
   - ✅ "added 688 packages" (or similar number)
   - ✅ "Build successful 🎉"

2. **Runtime Log shows:**
   - ✅ "LDOIA Registration Server running on port 3001"
   - ✅ "Connected to MongoDB Atlas"

3. **Service Status:**
   - ✅ Green dot next to service name
   - ✅ Says "Live"

---

## 🧪 Test Your Backend

Once it's live, test it:

**Copy your Render URL** (looks like: `https://ldoia-backend-xxxx.onrender.com`)

Then test:

```bash
curl https://YOUR-URL.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "LDOIA API Server is running",
  "timestamp": "2025-10-08T03:15:30.123Z"
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ WRONG Configuration:

```
Root Directory:  (blank) or "."
Build Command:   yarn or npm run build
Start Command:   npm start or cd ldoia-backend && node server...
```

### ✅ CORRECT Configuration:

```
Root Directory:  ldoia-backend
Build Command:   npm install
Start Command:   node server-registrations.cjs
```

---

## 📸 Screenshot Reference

The Settings page should look like:

```
╔════════════════════════════════════════════════════════╗
║  ldoia-backend Settings                                ║
╠════════════════════════════════════════════════════════╣
║  Repository                                            ║
║  └─ ldoiainfo1-glitch/ldoia-main (main branch)         ║
║                                                         ║
║  Build & Deploy                                        ║
║  ┌──────────────────────────────────────────┐          ║
║  │ Root Directory:  ldoia-backend           │          ║
║  │ Build Command:   npm install             │          ║
║  │ Start Command:   node server-registrations.cjs     │
║  └──────────────────────────────────────────┘          ║
║                                                         ║
║  [Save Changes]                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## ⏱️ Timeline

- **Update settings:** 30 seconds
- **Save & trigger deploy:** 30 seconds  
- **Build time:** 3-5 minutes
- **Start time:** 30 seconds
- **Total:** ~5-7 minutes

---

## 🎉 After Success

Once backend is running:

1. **Copy Backend URL**
2. **Update Netlify:**
   - Go to https://app.netlify.com
   - Your site → Site Settings → Environment Variables
   - Add: `VITE_BACKEND_API_URL` = `https://your-backend.onrender.com/api`
3. **Redeploy Netlify**
4. **Test SuperAdmin:** https://ldoia.com/superadmin

---

## 💡 Why This Works

**The Problem:**
- Render was running `npm install` in **root folder**
- But trying to run server from **ldoia-backend folder**
- Sharp and other deps were in wrong location

**The Fix:**
- Setting `Root Directory: ldoia-backend` tells Render to work INSIDE that folder
- Now `npm install` runs in the correct place
- All dependencies (including sharp) get installed
- Server starts successfully

---

## 📞 Still Stuck?

If you're still seeing errors:

1. **Check the exact error message** in Render logs
2. **Verify MongoDB Atlas** allows connections from 0.0.0.0/0
3. **Double-check environment variables** are set in Render
4. **Make sure** you're using the `ldoia-main` repository (not `ldoia`)

---

**Last Updated:** October 8, 2025  
**Status:** ✅ Fix pushed to GitHub - Ready to deploy  
**Next:** Update Render settings and deploy
