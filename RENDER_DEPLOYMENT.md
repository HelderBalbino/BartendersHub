# Render.com Backend Deployment Configuration

## Service Type: Web Service

### Build & Start Commands:

```bash
# Build Command (if needed):
npm install

# Start Command:
npm start
```

### Environment Variables Required:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bartendershub

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-for-production
JWT_EXPIRE=7d

# CORS & Frontend
FRONTEND_URL=https://your-vercel-app.vercel.app

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (Optional - for caching)
REDIS_URL=redis://your-redis-instance

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15
MAX_FILE_SIZE=5000000

# Node Environment
NODE_ENV=production
PORT=10000
```

### Health Check Endpoint:

```
/api/health
```

### Root Directory:

```
backend
```

## Deployment Steps:

1. **Create Render Account**: Sign up at render.com
2. **Connect GitHub**: Link your BartendersHub repository
3. **Create Web Service**:
    - Choose "Build and deploy from a Git repository"
    - Select your repository
    - Set root directory to `backend`
4. **Configure Build Settings**:
    - Build Command: `npm install`
    - Start Command: `npm start`
5. **Set Environment Variables**: Add all variables listed above
6. **Deploy**: Render will automatically build and deploy

## Important Notes:

-   Render provides HTTPS automatically
-   Health checks will use `/api/health` endpoint
-   Logs are available in Render dashboard
-   Auto-deploys on git push to main branch
