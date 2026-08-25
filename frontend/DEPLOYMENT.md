# Roast & Co. - Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### ✅ Database Setup
- [ ] Supabase project created and configured
- [ ] All database tables created (run SQL files in `/database` folder)
- [ ] Row Level Security (RLS) policies enabled
- [ ] Backup strategy configured
- [ ] Database indexes optimized for queries

### ✅ Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all Supabase credentials
- [ ] Set production domain URL
- [ ] Change default admin password
- [ ] Configure SMTP for email notifications (optional)

### ✅ Security
- [ ] Change admin default credentials in production
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure Content Security Policy (already in next.config.ts)
- [ ] Set up rate limiting on API routes
- [ ] Add input validation and sanitization
- [ ] Enable Supabase Row Level Security

### ✅ SEO & Performance
- [ ] Create favicon (favicon.ico, 16x16 & 32x32)
- [ ] Create app icons (icon-192x192.png, icon-512x512.png)
- [ ] Create Open Graph image (og-image.jpg, 1200x630)
- [ ] Add Google Analytics tracking code
- [ ] Submit sitemap to Google Search Console
- [ ] Verify site ownership in Google Search Console
- [ ] Test mobile responsiveness on real devices
- [ ] Run Lighthouse audit (target: 90+ score)

### ✅ Content
- [ ] Upload hero images through admin dashboard
- [ ] Add all products with images and descriptions
- [ ] Configure site settings (address, hours, contact)
- [ ] Test complete order flow
- [ ] Add social media links in footer

### ✅ Testing
- [ ] Test all forms (contact, newsletter, checkout)
- [ ] Test admin login and all CRUD operations
- [ ] Test image uploads (hero images, products)
- [ ] Test mobile view on multiple devices
- [ ] Test checkout and order creation
- [ ] Verify email notifications work
- [ ] Test database backups

## 📦 Deployment Steps

### Option 1: Vercel (Recommended - Easiest)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Production ready"
   git branch -M main
   git remote add origin https://github.com/yourusername/roast-and-co.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., roastandco.pk)
   - Update DNS records as instructed

### Option 2: Self-Hosted VPS

1. **Server Requirements**
   - Ubuntu 22.04 LTS
   - Node.js 18+
   - PM2 for process management
   - Nginx as reverse proxy
   - SSL certificate (Let's Encrypt)

2. **Setup Commands**
   ```bash
   # Install dependencies
   npm install

   # Build production
   npm run build

   # Start with PM2
   pm2 start npm --name "roast-and-co" -- start
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name roastandco.pk;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Post-Deployment Security

1. **Change Admin Credentials**
   - Login to `/admin/login`
   - Update default username/password immediately

2. **Configure Supabase Security**
   - Enable RLS on all tables
   - Set up API rate limiting
   - Monitor database logs

3. **Regular Backups**
   - Enable Supabase automatic backups
   - Test backup restoration process
   - Store backups in multiple locations

## 📊 Monitoring & Analytics

1. **Setup Google Analytics**
   - Add tracking ID to environment variables
   - Verify data collection in GA dashboard

2. **Error Monitoring** (Recommended: Sentry)
   ```bash
   npm install @sentry/nextjs
   # Follow Sentry Next.js setup guide
   ```

3. **Uptime Monitoring**
   - Use services like UptimeRobot or Pingdom
   - Set up alerts for downtime

## 🚨 Important Notes

- **Admin Password**: The default admin credentials should be changed immediately after first login
- **Database Backups**: Set up daily automated backups
- **SSL Certificate**: Always use HTTPS in production
- **Environment Variables**: Never commit `.env.local` to Git
- **Image Optimization**: Next.js handles this automatically
- **API Rate Limiting**: Consider adding rate limiting middleware for production

## 📞 Support

For issues or questions:
- Check logs: `pm2 logs roast-and-co` (if using PM2)
- Database logs: Supabase Dashboard → Database → Logs
- Contact: your-email@roastandco.pk
