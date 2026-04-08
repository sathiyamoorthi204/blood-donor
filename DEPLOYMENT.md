# Deployment Guide - Blood Donor Management System

This guide covers deploying your full-stack application (React frontend + Node.js backend + MongoDB).

## Prerequisites

- Git account (GitHub, GitLab, or Bitbucket)
- Deployment platform account (Heroku, Vercel, Render, AWS, etc.)
- MongoDB Atlas account (already configured in `.env`)

---

## Option 1: Deploy on Heroku (Recommended for Beginners)

### Backend Deployment (Node.js/Express)

1. **Install Heroku CLI**
   ```bash
   # Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
   # Or use: choco install heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku login
   cd server
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set EMAIL="your_email"
   heroku config:set EMAIL_PASS="your_email_password"
   heroku config:set PORT=5000
   ```

4. **Create Procfile** (in server folder)
   ```
   web: node server.js
   ```

5. **Deploy**
   ```bash
   git push heroku main
   # or: git push heroku master (if using master branch)
   ```

### Frontend Deployment (React)

1. **Create Heroku App for Frontend**
   ```bash
   cd ../client
   heroku create your-client-app-name
   ```

2. **Set API URL Environment Variable**
   ```bash
   heroku config:set REACT_APP_API_URL="https://your-app-name.herokuapp.com"
   ```

3. **Create Procfile** (in client folder)
   ```
   web: npm start
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

---

## Option 2: Deploy on Vercel (Frontend) + Render (Backend)

### Backend on Render

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/blood-app.git
   git push -u origin main
   ```

2. **Create Render Service**
   - Go to https://render.com
   - Connect your GitHub repository
   - Select the `server` directory as root
   - Add environment variables (MONGO_URI, JWT_SECRET, etc.)
   - Deploy

3. **Get Backend URL** (e.g., `https://your-app.onrender.com`)

### Frontend on Vercel

1. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set root directory to `client`
   - Add environment variable: `REACT_APP_API_URL=https://your-app.onrender.com`
   - Deploy

---

## Option 3: Deploy on AWS (Full Control)

### Backend on EC2

1. **Create EC2 Instance**
   - AMI: Ubuntu 20.04 LTS
   - Instance type: t2.micro (free tier)

2. **Connect & Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install Git
   sudo apt install -y git
   
   # Clone repo
   git clone https://github.com/yourusername/blood-app.git
   cd blood-app/server
   
   # Install dependencies
   npm install
   
   # Create .env file
   sudo nano .env
   # Paste your environment variables
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   pm2 start server.js --name "blood-app"
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx -y
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80 default_server;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

### Frontend on S3 + CloudFront

1. **Build React App**
   ```bash
   cd client
   npm run build
   ```

2. **Upload to S3**
   - Create S3 bucket
   - Upload build folder contents
   - Enable static website hosting

3. **CloudFront Distribution**
   - Create distribution pointing to S3
   - Set origin domain to S3 bucket
   - Update React API URL environment variable

---

## Option 4: Docker Deployment

### Create Dockerfile for Backend

Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Create Dockerfile for Frontend

Create `client/Dockerfile`:
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=5000
    networks:
      - app-network

  frontend:
    build: ./client
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## Post-Deployment Checklist

- [ ] **Database**: Verify MongoDB Atlas connection is working
- [ ] **API**: Test API endpoints (GET /donors, POST /auth/login, etc.)
- [ ] **Frontend**: Test all pages and forms load correctly
- [ ] **Authentication**: Verify login/register works
- [ ] **Email**: Test email notifications are being sent
- [ ] **CORS**: Ensure frontend can communicate with backend
- [ ] **SSL/HTTPS**: Enable SSL certificate (free with Let's Encrypt on Heroku/Render)
- [ ] **Environment Variables**: Double-check all sensitive data is in `.env`

---

## Monitoring & Maintenance

### View Logs
```bash
# Heroku
heroku logs --tail

# Render
# View in dashboard

# AWS EC2
pm2 logs
journalctl -u nginx -f
```

### Update Deployment
```bash
# Pull latest changes
git pull origin main

# Redeploy (platform-specific)
# Heroku: git push heroku main
# AWS: git pull && pm2 restart all
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Add frontend URL to `cors` config in server.js |
| MongoDB connection fails | Verify MONGO_URI and IP whitelist in Atlas |
| Port already in use | Change PORT in `.env` |
| Email not sending | Verify SMTP credentials and 2FA disabled for Gmail |
| Static assets not loading | Check `PUBLIC_URL` or CloudFront configuration |

---

## Cost Estimates (Monthly)

- **Heroku**: $7-50+ (dyno hours)
- **Vercel**: Free-20+ (for frontend)
- **Render**: Free-10+ (for backend)
- **AWS EC2**: ~$10 (t2.micro eligible for free tier)
- **MongoDB Atlas**: Free-57+ (M0 free, M10 cluster higher)

**Recommended Budget Setup**: Render (free) + Vercel (free) + MongoDB Atlas Free = **$0/month**

---

## Quick Start: Deploy to Render + Vercel (Free)

1. Push to GitHub
2. Go to https://render.com → New Web Service → Connect GitHub (server folder)
3. Add environment variables
4. Go to https://vercel.com → Import GitHub → Select client folder
5. Set `REACT_APP_API_URL` to your Render URL
6. Done! Your app is live.

