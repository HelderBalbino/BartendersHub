# BartendersHub Backend Deployment Guide - Render -

## Step-by-Step Guide to Deploy Your Backend on Render -

### Important Prerequisites -

-   ✅ GitHub account with your code pushed
-   ✅ MongoDB Atlas account (for production database)
-   ✅ Cloudinary account (for image storage)
-   ✅ Email service credentials (Gmail/SendGrid)

---

## 🚀 **Step 1: Prepare Your Repository**

### 1.1 Push Your Code to GitHub -

```bash
# If not already done, initialize git and push to GitHub
cd /path/to/your/BartendersHub
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### 1.2 Verify Backend Structure -

Ensure your backend folder has:

-   ✅ `package.json` with proper start script
-   ✅ `render.yaml` (already created)
-   ✅ `.env.example` file
-   ✅ All source code in `src/` directory

---

## 🗄️ **Step 2: Set Up MongoDB Atlas (Production Database)**

### 2.1 Create MongoDB Atlas Account -

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up or log in
3. Create a new project: "BartendersHub"

### 2.2 Create Database Cluster

1. Click "Build a Database"
2. Choose **M0 Sandbox** (Free tier)
3. Select your preferred region
4. Name your cluster: `bartendershub-cluster`
5. Click "Create"

### 2.3 Configure Database Access

1. Go to "Database Access" in sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `bartendershub-admin`
5. Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 2.4 Configure Network Access

1. Go to "Network Access" in sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 2.5 Get Connection String

1. Go to "Database" in sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Save this connection string for later

**Example connection string:**

```
mongodb+srv://bartendershub-admin:YOUR_PASSWORD@bartendershub-cluster.xxxxx.mongodb.net/bartendershub?retryWrites=true&w=majority
```

---

## 🖼️ **Step 3: Set Up Cloudinary (Image Storage)**

### 3.1 Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Complete verification

### 3.2 Get API Credentials

1. Go to Dashboard
2. Note down:
    - **Cloud Name**
    - **API Key**
    - **API Secret**
3. Save these for environment variables

### 3.3 Create Upload Presets

1. Go to Settings → Upload
2. Click "Add upload preset"
3. Name: `bartendershub_uploads`
4. Signing Mode: "Unsigned"
5. Folder: `bartendershub`
6. Save

---

## 📧 **Step 4: Set Up Email Service (Optional)**

### 4.1 Gmail App Password (Recommended)

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Save the 16-character password

### 4.2 Alternative: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API key
3. Verify sender identity

---

## ☁️ **Step 5: Deploy to Render**

### 5.1 Create Render Account

1. Go to [Render](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### 5.2 Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your `BartendersHub` repository
4. Configure deployment settings:

**Basic Settings:**

-   **Name**: `bartendershub-backend`
-   **Branch**: `main`
-   **Root Directory**: `backend`
-   **Environment**: `Node`
-   **Region**: Choose closest to your users
-   **Instance Type**: `Starter` (Free tier)

**Build & Deploy:**

-   **Build Command**: `npm install`
-   **Start Command**: `npm start`

### 5.3 Configure Environment Variables

In the Render dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=10000

# Database (from Step 2)
MONGODB_URI=mongodb+srv://bartendershub-admin:YOUR_PASSWORD@bartendershub-cluster.xxxxx.mongodb.net/bartendershub?retryWrites=true&w=majority

# JWT (Generate a strong 32+ character secret)
JWT_SECRET=your-super-secure-32-plus-character-secret-for-production-use-only
JWT_EXPIRE=7d

# Cloudinary (from Step 3)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (from Step 4)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# CORS (Update with your frontend URL)
FRONTEND_URL=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads/
```

### 5.4 Deploy

1. Click "Create Web Service"
2. Render will automatically:
    - Clone your repository
    - Install dependencies
    - Start your application
3. Monitor the deployment logs

---

## 🔧 **Step 6: Post-Deployment Configuration**

### 6.1 Verify Deployment

1. Check deployment logs for errors
2. Visit your service URL: `https://bartendershub-backend.onrender.com`
3. Test health endpoint: `https://bartendershub-backend.onrender.com/api/health`

### 6.2 Update Frontend Configuration

Update your frontend's API URL to point to Render:

```javascript
// In your frontend .env file
VITE_API_URL=https://bartendershub-backend.onrender.com/api
```

### 6.3 Test API Endpoints

Test key endpoints:

-   `GET /api/health` - Health check
-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `GET /api/cocktails` - Get cocktails

---

## 🔒 **Step 7: Security & Production Setup**

### 7.1 Environment Security

-   ✅ Strong JWT secret (32+ characters)
-   ✅ Secure database credentials
-   ✅ Proper CORS configuration
-   ✅ Rate limiting enabled

### 7.2 Enable Auto-Deploy

1. In Render dashboard, go to Settings
2. Enable "Auto-Deploy" from GitHub
3. Every push to main will trigger deployment

### 7.3 Set Up Health Checks

Render automatically monitors your `/api/health` endpoint

### 7.4 Configure Custom Domain (Optional)

1. Go to Settings → Custom Domains
2. Add your domain
3. Configure DNS records as instructed

---

## 📊 **Step 8: Monitoring & Maintenance**

### 8.1 Monitor Logs

-   Access logs via Render dashboard
-   Set up log alerts for errors

### 8.2 Database Monitoring

-   Monitor MongoDB Atlas metrics
-   Set up alerts for connection issues

### 8.3 Performance Monitoring

-   Monitor response times
-   Track error rates
-   Monitor memory usage

---

## 🚨 **Common Issues & Troubleshooting**

### Issue 1: Build Failures

**Solution:**

-   Check Node.js version compatibility
-   Verify package.json scripts
-   Check dependency versions

### Issue 2: Database Connection Errors

**Solution:**

-   Verify MongoDB connection string
-   Check network access settings
-   Ensure database user has proper permissions

### Issue 3: Environment Variable Issues

**Solution:**

-   Double-check all environment variables
-   Ensure no extra spaces or quotes
-   Verify sensitive values are correct

### Issue 4: CORS Errors

**Solution:**

-   Update FRONTEND_URL environment variable
-   Ensure correct frontend domain

### Issue 5: File Upload Issues

**Solution:**

-   Verify Cloudinary credentials
-   Check upload directory permissions
-   Monitor file size limits

---

## 🔄 **Deployment Commands Summary**

```bash
# Local development
npm run dev

# Production start (Render uses this)
npm start

# Database seeding (run once after deployment)
npm run seed

# Testing
npm test
```

---

## 📞 **Getting Help**

### Render Support

-   [Render Documentation](https://render.com/docs)
-   [Render Community](https://community.render.com)
-   [Render Status](https://status.render.com)

### MongoDB Atlas Support

-   [MongoDB Documentation](https://docs.atlas.mongodb.com)
-   [MongoDB Community](https://developer.mongodb.com/community/forums)

### Your Service URLs

After deployment, save these URLs:

-   **Backend API**: `https://bartendershub-backend.onrender.com`
-   **Health Check**: `https://bartendershub-backend.onrender.com/api/health`
-   **API Documentation**: `https://bartendershub-backend.onrender.com/api`

---

## ✅ **Deployment Checklist**

-   [ ] Code pushed to GitHub
-   [ ] MongoDB Atlas cluster created and configured
-   [ ] Cloudinary account set up
-   [ ] Email service configured
-   [ ] Render web service created
-   [ ] Environment variables configured
-   [ ] Deployment successful
-   [ ] Health check passing
-   [ ] API endpoints tested
-   [ ] Frontend updated with new API URL
-   [ ] CORS configured properly
-   [ ] Auto-deploy enabled

**Congratulations! Your BartendersHub backend is now live on Render! 🎉**
