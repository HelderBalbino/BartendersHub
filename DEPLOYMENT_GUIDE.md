# 🚀 BartendersHub Deployment Guide

## **Architecture Overview**

-   **Frontend**: React/Vite app hosted on Vercel
-   **Backend**: Node.js/Express API hosted on Render
-   **Database**: MongoDB Atlas (cloud)
-   **Storage**: Cloudinary (images)

---

## **Step-by-Step Deployment Process**

### **Phase 1: Deploy Backend to Render** 🖥️

1. **Create Render Account**

    - Go to [render.com](https://render.com)
    - Sign up with GitHub account

2. **Create New Web Service**

    - Click "New +" → "Web Service"
    - Connect your GitHub repository
    - Select "BartendersHub" repository

3. **Configure Service Settings**

    ```
    Name: bartendershub-backend (or your preferred name)
    Root Directory: backend
    Build Command: npm install
    Start Command: npm start
    ```

4. **Set Environment Variables** Copy these variables in Render dashboard:

    ```bash
    NODE_ENV=production
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bartendershub
    JWT_SECRET=your-super-secure-jwt-secret-for-production
    JWT_EXPIRE=7d
    FRONTEND_URL=https://your-vercel-app.vercel.app
    PORT=10000
    ```

5. **Deploy Backend**
    - Click "Create Web Service"
    - Wait for deployment (5-10 minutes)
    - Copy the provided URL (e.g., `https://bartendershub-backend.onrender.com`)

### **Phase 2: Update Frontend Configuration** ⚛️

1. **Update Production Environment** Edit `.env.production`:

    ```bash
    VITE_API_URL=https://your-actual-render-url.onrender.com/api
    ```

2. **Update Vercel Environment Variables** In Vercel dashboard, set:
    ```bash
    VITE_API_URL=https://your-actual-render-url.onrender.com/api
    VITE_APP_NAME=BartendersHub
    VITE_APP_VERSION=1.0.0
    ```

### **Phase 3: Deploy Frontend to Vercel** 🌐

1. **Connect Vercel to GitHub**

    - Go to [vercel.com](https://vercel.com)
    - Import your GitHub repository

2. **Configure Project Settings**

    ```
    Framework Preset: Vite
    Root Directory: ./ (leave blank for root)
    Build Command: npm run build
    Output Directory: dist
    Install Command: npm install
    ```

3. **Set Environment Variables** Add the environment variables from step 2 above

4. **Deploy**
    - Click "Deploy"
    - Update `FRONTEND_URL` in Render with your Vercel URL

---

## **Environment Variables Checklist** ✅

### **Render Backend Variables:**

-   [ ] `NODE_ENV=production`
-   [ ] `MONGODB_URI` (MongoDB Atlas connection string)
-   [ ] `JWT_SECRET` (generate a secure random string)
-   [ ] `JWT_EXPIRE=7d`
-   [ ] `FRONTEND_URL` (your Vercel app URL)
-   [ ] `PORT=10000`

### **Vercel Frontend Variables:**

-   [ ] `VITE_API_URL` (your Render backend URL + /api)
-   [ ] `VITE_APP_NAME=BartendersHub`
-   [ ] `VITE_APP_VERSION=1.0.0`

---

## **Post-Deployment Steps** 🔧

1. **Test API Connection**

    - Visit your Vercel frontend
    - Try logging in/signing up
    - Check browser console for API errors

2. **Update CORS Settings** If you get CORS errors, update backend
   `FRONTEND_URL` environment variable

3. **Monitor Logs**
    - Render: Check deployment logs for backend errors
    - Vercel: Check function logs for frontend issues

---

## **Troubleshooting** 🛠️

### **Common Issues:**

**Backend not starting:**

-   Check Render logs for missing environment variables
-   Verify MongoDB connection string
-   Ensure `npm start` command works locally

**Frontend can't reach backend:**

-   Verify `VITE_API_URL` environment variable
-   Check if Render backend is running
-   Verify CORS configuration

**Database connection issues:**

-   Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
-   Verify connection string credentials
-   Test connection locally first

---

## **URLs After Deployment** 🌍

-   **Frontend**: `https://your-app.vercel.app`
-   **Backend**: `https://your-backend.onrender.com`
-   **API Base**: `https://your-backend.onrender.com/api`

---

## **Performance Notes** ⚡

-   Render free tier may have cold starts (30 seconds)
-   Consider upgrading to paid tier for production
-   Vercel provides excellent frontend performance
-   All performance optimizations are already implemented
