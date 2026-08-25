# Roast & Co. - Backend Setup Guide

## 🚀 Quick Setup Steps

### 1. Supabase Project Setup

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up / Sign in
   - Click "New Project"

2. **Create New Project**
   - Organization: Select or create one
   - Name: `roast-and-co` (or any name)
   - Database Password: Create a strong password
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for project to be ready

3. **Get API Credentials**
   - Once project is ready, go to **Settings** (gear icon in left sidebar)
   - Click **API** section
   - You'll see three important values:
     - **Project URL** - Copy this
     - **anon/public key** - Copy this (click "Copy" button)
     - **service_role key** - Click "Reveal" then copy this (⚠️ Keep secret!)

4. **Add Credentials to .env.local**
   - Open `frontend/.env.local` file
   - Replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-secret-key-here
   ```

### 2. Database Setup

1. **Open SQL Editor**
   - In Supabase dashboard, click **SQL Editor** in left sidebar
   - Click **New Query**

2. **Run Database Schema**
   - Open the file: `frontend/database/schema.sql`
   - Copy ALL the content
   - Paste into Supabase SQL Editor
   - Click **Run** (or press Ctrl/Cmd + Enter)
   - Wait for "Success. No rows returned" message

3. **Verify Tables Created**
   - Click **Table Editor** in left sidebar
   - You should see these tables:
     - `admin_users`
     - `products`
     - `customers`
     - `orders`
     - `newsletter_leads`
     - `contact_leads`

### 3. Create Admin User (Important!)

Since the default password hash in schema.sql is a placeholder, you need to create a real admin user:

1. **Go to SQL Editor**
2. **Run this query** (change the email/password if you want):
   ```sql
   INSERT INTO admin_users (email, password_hash, name) 
   VALUES ('admin@roastandco.pk', 'admin123', 'Admin User');
   ```
   
   ⚠️ **Note:** In production, passwords should be hashed with bcrypt. For now, we're using plain text for simplicity.

3. **Login Credentials:**
   - Email: `admin@roastandco.pk`
   - Password: `admin123`

### 4. Start Development Server

```bash
cd frontend
npm run dev
```

Your app will be running at: http://localhost:3000

### 5. Test the Setup

1. **Go to Admin Login:**
   - Visit: http://localhost:3000/admin/login
   - Enter credentials: `admin@roastandco.pk` / `admin123`
   - Should redirect to dashboard

2. **Check API Connection:**
   - Open browser console (F12)
   - Look for any errors
   - If you see "Server configuration error", check your .env.local file

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── api/                      # Backend APIs
│   │   ├── auth/login/           # Login authentication
│   │   ├── products/             # Products CRUD
│   │   ├── orders/               # Orders management
│   │   ├── leads/                # Newsletter & Contact
│   │   ├── customers/            # Customer data
│   │   └── dashboard/stats/      # Analytics
│   ├── admin/                    # Admin dashboard
│   └── page.tsx                  # Customer website
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── auth.ts                   # Auth utilities
├── database/
│   └── schema.sql                # Database schema
└── .env.local                    # Environment variables (SECRET!)

```

---

## 🔐 Security Notes

- **NEVER** commit `.env.local` to git
- The `.env.local` file is already in `.gitignore`
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret
- In production, use proper password hashing (bcrypt)

---

## 🛠️ Available APIs

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Delete order

### Leads
- `GET /api/leads/newsletter` - Get newsletter subscribers
- `POST /api/leads/newsletter` - Subscribe to newsletter
- `GET /api/leads/contact` - Get contact submissions
- `POST /api/leads/contact` - Submit contact form

### Customers
- `GET /api/customers` - Get all customers

### Dashboard
- `GET /api/dashboard/stats` - Get analytics data

---

## 🐛 Troubleshooting

### Error: "Server configuration error"
- Check if `.env.local` exists and has correct values
- Restart dev server after changing `.env.local`

### Error: "Failed to fetch products"
- Make sure you ran the `schema.sql` in Supabase
- Check if tables exist in Table Editor
- Verify API keys are correct

### Login not working
- Make sure you created admin user in database
- Check browser console for errors
- Verify Supabase project is active

---

## ✅ Next Steps

After setup is complete:
1. ✅ Login to admin dashboard
2. ✅ Add some products
3. ✅ Test order creation
4. ✅ Check analytics dashboard
5. ✅ Connect customer website to APIs

---

## 📞 Support

If you encounter any issues, check:
1. Browser console for errors
2. Network tab in DevTools
3. Supabase dashboard logs
