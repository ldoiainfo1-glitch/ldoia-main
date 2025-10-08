# NETLIFY DEPLOYMENT GUIDE FOR LDOIA
# Complete step-by-step instructions for deploying to Netlify

## 📋 QUICK REFERENCE CONFIGURATION

**Repository:** https://github.com/Muskaan786/ldoia.git
**Team:** Developer
**Branch to Deploy:** main

---

## 🚀 NETLIFY CONFIGURATION SETTINGS

### Build Settings

Fill in these values in the Netlify dashboard:

| Field | Value | Notes |
|-------|-------|-------|
| **Team** | Developer | Select from dropdown |
| **Branch to deploy** | `main` | Main production branch |
| **Base directory** | (leave empty) | Root of repository |
| **Build command** | `npm run build` | Vite build command |
| **Publish directory** | `dist/spa` | Vite output folder (SPA mode) |
| **Functions directory** | `netlify/functions` | Optional, can leave default |

---

## 🔧 ENVIRONMENT VARIABLES

### Option 1: If Backend URL is Needed in Frontend

Add these environment variables in Netlify:

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

**How to add:**
1. Click "Add environment variables"
2. Key: `VITE_API_BASE_URL`
3. Value: Your backend URL (from Railway/Render)
4. Scopes: **All scopes**
5. Deploy contexts: **All deploy contexts**

### Option 2: No Environment Variables Needed

If you've hardcoded the API URL in `/client/services/apiService.ts`, you can skip this section.

---

## 📝 STEP-BY-STEP DEPLOYMENT PROCESS

### Step 1: Prepare Your Code

Before deploying, ensure:

1. ✅ Code is pushed to GitHub: `https://github.com/Muskaan786/ldoia.git`
2. ✅ Backend is deployed and you have the backend URL
3. ✅ API endpoint is updated in code (if not using environment variables)

**Update API Endpoint (if hardcoding):**

Edit `/client/services/apiService.ts`:

```typescript
const API_BASE_URL = 'https://your-backend-url.railway.app';
```

Commit and push:
```bash
git add .
git commit -m "Update API endpoint for production"
git push origin main
```

---

### Step 2: Connect Repository to Netlify

1. **Go to Netlify Dashboard**
   - URL: https://app.netlify.com
   - Login with your account

2. **Create New Site**
   - Click **"Add new site"**
   - Select **"Import an existing project"**

3. **Connect to GitHub**
   - Click **"Deploy with GitHub"**
   - Authorize Netlify (if first time)
   - Search for: `Muskaan786/ldoia`
   - Click on the repository

---

### Step 3: Configure Build Settings

In the configuration screen, fill in:

#### Site Settings
- **Team:** Developer (select from dropdown)
- **Branch to deploy:** `main`

#### Build Settings
- **Base directory:** (leave empty)
- **Build command:** `npm run build`
- **Publish directory:** `dist/spa`
- **Functions directory:** `netlify/functions` (or leave default)

#### Environment Variables (Optional)
- Click **"Add environment variables"**
- Add `VITE_API_BASE_URL` if needed (see Environment Variables section above)

#### Advanced Settings (Optional)
Leave default unless you need specific Node.js version

---

### Step 4: Deploy!

1. Review your settings
2. Click **"Deploy ldoia"** button
3. Wait for build to complete (2-5 minutes)
4. You'll get a temporary URL like: `https://random-name-123.netlify.app`

---

### Step 5: Configure Custom Domain

1. **In Netlify Dashboard:**
   - Go to **Site settings** → **Domain management**
   - Click **"Add custom domain"**

2. **Add Primary Domain:**
   - Enter: `ldoia.com`
   - Click **"Verify"**
   - Click **"Add domain"**
   - Netlify will show DNS configuration instructions

3. **Add www Subdomain:**
   - Click **"Add domain alias"**
   - Enter: `www.ldoia.com`
   - Click **"Add domain"**

---

### Step 6: Configure DNS

Choose one of these methods:

#### Method A: Use Netlify DNS (Recommended - Easiest)

1. In Domain management, click **"Set up Netlify DNS"**
2. Netlify will show nameservers like:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
3. **Go to your domain registrar** (GoDaddy, Namecheap, etc.)
4. Update nameservers to the ones provided by Netlify
5. Wait 24-48 hours for DNS propagation

#### Method B: Use External DNS

At your domain registrar, add these DNS records:

```
Type    Name    Value                           TTL
A       @       75.2.60.5                       3600
CNAME   www     your-site-name.netlify.app      3600
```

Replace `your-site-name.netlify.app` with your actual Netlify site URL.

---

### Step 7: Enable HTTPS

1. After DNS is configured, go to **Domain management**
2. Under **HTTPS**, click **"Verify DNS configuration"**
3. Click **"Provision certificate"**
4. Wait a few minutes for SSL certificate to be issued
5. Enable **"Force HTTPS"** to redirect all HTTP to HTTPS

---

## 🔄 CONTINUOUS DEPLOYMENT

Netlify will automatically rebuild and deploy whenever you push to the `main` branch!

**To trigger a deployment:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify will detect the push and start building automatically.

---

## 🎯 SUPER ADMIN DEPLOYMENT (Separate Site)

For deploying the super admin panel to `admin.ldoia.com`:

### Create Second Netlify Site

1. **Create New Site** (same as Step 2)
2. **Select Same Repository:** `Muskaan786/ldoia`

### Configure Build Settings

- **Team:** Developer
- **Branch:** `main`
- **Base directory:** `super-admin`
- **Build command:** (leave empty - it's static HTML)
- **Publish directory:** `.` (dot = current directory)

### Add Subdomain

1. Go to **Domain management**
2. Click **"Add custom domain"**
3. Enter: `admin.ldoia.com`
4. Add DNS record at your registrar:
   ```
   Type    Name     Value
   CNAME   admin    your-admin-site-name.netlify.app
   ```

---

## ✅ POST-DEPLOYMENT CHECKLIST

After deployment, verify:

- [ ] Main site accessible at `https://ldoia.com`
- [ ] www redirect works: `https://www.ldoia.com`
- [ ] HTTPS is enabled (green lock icon)
- [ ] Registration form works
- [ ] Gallery loads images
- [ ] Language switching works
- [ ] Contact form submits
- [ ] API calls to backend work
- [ ] Super admin panel at `https://admin.ldoia.com`
- [ ] Admin panel can fetch applications
- [ ] Admin can approve applications

---

## 🐛 TROUBLESHOOTING

### Build Fails

**Error:** `Command failed with exit code 1`

**Solution:**
- Check build logs in Netlify dashboard
- Ensure `package.json` has correct scripts
- Verify Node.js version compatibility

### API Calls Fail (CORS Error)

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
- Update CORS settings in backend to include your Netlify URL
- In backend, add:
  ```javascript
  origin: [
    'https://ldoia.com',
    'https://www.ldoia.com',
    'https://your-site.netlify.app'
  ]
  ```

### Site Not Loading

**Error:** Blank page or 404

**Solution:**
- Verify publish directory is `dist`
- Check that `npm run build` works locally
- Ensure `netlify.toml` redirect rule is present

### Domain Not Working

**Error:** DNS not resolving

**Solution:**
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Use `dig ldoia.com` to check DNS

---

## 📞 SUPPORT

- **Netlify Docs:** https://docs.netlify.com
- **Netlify Support:** https://www.netlify.com/support
- **GitHub Issues:** https://github.com/Muskaan786/ldoia/issues

---

**Last Updated:** October 8, 2025
