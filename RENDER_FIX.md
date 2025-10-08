# 🚨 URGENT: Render Build Command Fix

## The Problem:
Render is building in the root directory instead of `ldoia-backend` folder.
This causes the `sharp` module (and other dependencies) to not be installed.

**Error:** `Cannot find module 'sharp'`

---

## ✅ SOLUTION: Update Render Service Settings

### Step 1: Go to Render Dashboard
https://dashboard.render.com

### Step 2: Update Service Settings

1. **Select Your Service:**
   - Click on your "ldoia-backend" service

2. **Go to Settings Tab**

3. **Update Build & Start Commands:**
   
   Scroll to **Build & Deploy** section and set:
   
   ```
   Root Directory: ldoia-backend
   Build Command: npm install
   Start Command: node server-registrations.cjs
   ```

4. **Save Changes:**
   - Click **Save Changes** button

5. **Manual Deploy:**
   - Go to **Manual Deploy** section (top right)
   - Click **Deploy latest commit**
   - Wait for build to complete (~5-10 minutes)

---

## 📋 Correct Configuration:

| Setting | Value |
|---------|-------|
| **Repository** | `ldoiainfo1-glitch/ldoia-main` |
| **Branch** | `main` |
| **Root Directory** | `ldoia-backend` ⚠️ IMPORTANT |
| **Build Command** | `npm install` |
| **Start Command** | `node server-registrations.cjs` |
| **Runtime** | Node |
| **Region** | Singapore (or your choice) |

---

## 🔍 What This Does:

- **Root Directory: ldoia-backend** → Tells Render to work inside the backend folder
- **Build Command: npm install** → Installs all dependencies (including sharp)
- **Start Command: node server-registrations.cjs** → Starts the server directly

---

## ✅ Expected Success Log:

After fixing, you should see:

```
==> Cloning from https://github.com/ldoiainfo1-glitch/ldoia-main
==> Root directory: ldoia-backend
==> Running build command 'npm install'
added 688 packages in 45s
✅ Build successful 🎉
==> Running 'node server-registrations.cjs'
📊 Database name: ldoia_database
🚀 LDOIA Registration Server running on port 3001
✅ Connected to MongoDB Atlas - Database: ldoia_database
```

---

## 🧪 Verify It's Working:

Once deployed successfully:

```bash
curl https://YOUR-BACKEND.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "LDOIA API Server is running",
  "timestamp": "2025-10-08T..."
}
```

---

## 🚨 If Still Failing:

### Check These:

1. **Root Directory** is set to `ldoia-backend` (NOT blank!)
2. **Build Command** is `npm install` (NOT `yarn`)
3. **Start Command** is `node server-registrations.cjs` (NOT `npm start`)
4. Repository is `ldoiainfo1-glitch/ldoia-main`

### Alternative: Use render.yaml

The repository has a `render.yaml` file that should configure everything automatically.

If manual config doesn't work:
1. Delete the current service
2. Create new service using **Blueprint** option
3. Select `render.yaml` from repository
4. It will auto-configure everything correctly

---

## 📞 After Successful Deploy:

1. ✅ Copy your backend URL (e.g., `https://ldoia-backend.onrender.com`)
2. 🔧 Update Netlify environment variable:
   - Go to https://app.netlify.com
   - Site Settings → Environment Variables
   - Add: `VITE_BACKEND_API_URL` = `https://YOUR-BACKEND.onrender.com/api`
3. 🚀 Redeploy Netlify site
4. 🎉 Test: https://ldoia.com/superadmin

---

**Status:** Environment variables configured ✅  
**Last Updated:** October 8, 2025 at 4:21 PM

---

### Option 2: Delete & Recreate Service

If updating repository doesn't work:

1. **Delete Current Service:**
   - Render Dashboard → Your service
   - Settings → Delete Service

2. **Create New Service:**
   - Click **New +** → **Web Service**
   - Connect repository: `ldoiainfo1-glitch/ldoia-main`
   - Configure:
     ```
     Name: ldoia-backend
     Region: Singapore
     Branch: main
     Root Directory: ldoia-backend
     Runtime: Node
     Build Command: npm install
     Start Command: node server-registrations.cjs
     ```

3. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://application:Newpass123@cluster0.5cmxzxj.mongodb.net/ldoia_database?retryWrites=true&w=majority&appName=Cluster0
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://ldoia.com
   ADMIN_FRONTEND_URL=https://ldoia.com/superadmin
   FAST2SMS_API_KEY=Ra3Weq1mDp27byivuZdcr0MEf5Lk8XK64sUPwHOBgSxJIhzGYN3SLbFvqcOoJZ0sE8Q1VBzCGAuDyr5f
   FAST2SMS_SENDER_ID=LDOIA
   OTP_PROVIDER=fast2sms
   OTP_EXPIRY_MINUTES=10
   OTP_MAX_ATTEMPTS=3
   JWT_SECRET=ldoia_jwt_secret_change_in_production_2024
   MAX_FILE_SIZE_MB=10
   ALLOWED_FILE_TYPES=jpeg,jpg,png,pdf
   UPLOAD_DIR=/tmp/uploads
   ```

4. **Deploy:**
   - Click **Create Web Service**
   - Wait for deployment

---

## 🧪 Verify Correct Repository

After updating, check the deploy log should show:

```
==> Cloning from https://github.com/ldoiainfo1-glitch/ldoia-main
                                                        ^^^^^^ WITH -main!
==> Checking out commit cd4f24c... (latest commit)
==> Running build command 'npm install'
✅ Build succeeded
```

---

## 📊 Repository Comparison:

| Repository | Status | Has Fix |
|------------|--------|---------|
| `ldoiainfo1-glitch/ldoia` | ❌ OLD | No (has packageManager bug) |
| `ldoiainfo1-glitch/ldoia-main` | ✅ CURRENT | Yes (fixed!) |

---

## ⚡ Quick Check:

**Current Render Commit:** `d166ba4e7e0aca336b6d838ae1a7ee50845ec4db`  
**Latest Commit (with fix):** `cd4f24c...` (from ldoia-main repo)

You need to point Render to `ldoia-main` repository!

---

## 🎯 After Fix:

Once Render uses correct repository:
- ✅ Build will succeed
- ✅ No packageManager error
- ✅ Backend will start
- ✅ MongoDB will connect

Then your SuperAdmin will work at: https://ldoia.com/superadmin
