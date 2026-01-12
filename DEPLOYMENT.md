# 🚀 Deployment Guide - Live Sync Classroom

This guide covers how to deploy the Live Sync Classroom application to various platforms.

## Local Development

### Prerequisites
- Node.js v14+
- npm or yarn

### Setup

```bash
# 1. Clone the repository
cd The-Live-Sync-Classroom

# 2. Install dependencies
npm install

# 3. Start development servers
npm run dev
```

Visit `http://localhost:5173` to access the application.

---

## Deployment Options

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Steps

```bash
# 1. Create Heroku app
heroku create your-app-name

# 2. Create Procfile in root
echo "web: npm start" > Procfile

# 3. Update package.json start script to run both server and client
# Modify package.json:
{
  "scripts": {
    "start": "node server/index.js",
    "build": "cd client && npm install && npm run build",
    "postbuild": "npm install --prefix server"
  }
}

# 4. Deploy
git push heroku main

# 5. Serve built client from Express
```

#### Updated server/index.js (for production)

Add this to serve the static client:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ... existing code ...

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// ... socket.io setup ...
```

---

### Option 2: Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy server
COPY server/ server/

# Copy client
COPY client/ client/

# Install client dependencies and build
WORKDIR /app/client
RUN npm install && npm run build

# Go back to app root
WORKDIR /app

# Install server dependencies explicitly
RUN cd server && npm install

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  live-sync:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    restart: always
```

#### Build and Run

```bash
# Build image
docker build -t live-sync-classroom .

# Run container
docker run -p 3001:3001 live-sync-classroom

# Or use docker-compose
docker-compose up -d
```

---

### Option 3: AWS Deployment (EC2 + Nginx)

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04)
- Domain name (optional)

#### Steps

```bash
# 1. SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Nginx
sudo apt-get install -y nginx

# 4. Clone repository
git clone your-repo-url
cd The-Live-Sync-Classroom

# 5. Install and build
npm install
npm run build

# 6. Install PM2 for process management
sudo npm install -g pm2

# 7. Start server with PM2
pm2 start npm --name "live-sync" -- start

# 8. Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

#### Nginx Configuration

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    # Serve static files
    location / {
        root /home/ubuntu/The-Live-Sync-Classroom/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket proxy
    location /socket.io {
        proxy_pass http://localhost:3001/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# 9. Test Nginx configuration
sudo nginx -t

# 10. Restart Nginx
sudo systemctl restart nginx

# 11. Enable PM2 to start on reboot
pm2 startup
pm2 save
```

---

### Option 4: DigitalOcean App Platform

#### Steps

1. Push code to GitHub
2. Connect GitHub account to DigitalOcean
3. Create new App
4. Choose The-Live-Sync-Classroom repository
5. Configure build settings:
   - Build command: `npm install && npm run build`
   - Run command: `npm start`
6. Add environment variables if needed
7. Deploy

---

### Option 5: Vercel + Custom Server

#### Client Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy client
cd client
vercel
```

#### Server Deployment (Render.com)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
   - Build command: `npm install && cd server && npm install`
   - Start command: `npm start`
6. Add environment variable:
   - `VITE_API_URL=https://your-render-url.com`
7. Deploy

---

## Environment Variables

Create `.env.production` for production deployment:

```env
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Update server/index.js to use environment variables:

```javascript
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Update Nginx for HTTPS

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs live-sync

# Monitor in real-time
pm2 monit

# Restart app
pm2 restart live-sync
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Performance Optimization

### Enable Gzip Compression

In Nginx configuration:

```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
            application/x-javascript application/xml+rss 
            application/json application/javascript;
gzip_min_length 1000;
```

### Enable Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Troubleshooting

### WebSocket Connection Issues

Check that your firewall/proxy allows WebSocket connections:

```bash
# Test WebSocket
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  https://yourdomain.com/socket.io
```

### CORS Errors

Ensure `ALLOWED_ORIGINS` includes your frontend domain:

```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'http://localhost:5173', // development
];
```

---

## Backup & Recovery

### Database Backup (if using persistent storage)

```bash
# Regular backups
0 2 * * * /path/to/backup-script.sh
```

### Application Backup

```bash
# Backup important data
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/app
```

---

**For production use, consider adding:**
- Database persistence (MongoDB, PostgreSQL)
- Redis for session management
- CDN for static assets
- Automated testing & CI/CD
- Error tracking (Sentry)
- Analytics
- Rate limiting
