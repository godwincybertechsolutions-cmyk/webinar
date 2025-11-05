# Quick Start Guide

## 🚀 Get Your App Running in 5 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor → Run `supabase/schema.sql`
4. Go to Settings → API → Copy your credentials

### Step 3: Configure Environment

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_LIVEKIT_URL=wss://your_livekit_url
LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Configure Authentication

In Supabase Dashboard:
- Authentication → Providers → Enable Email
- Authentication → URL Configuration → Add `http://localhost:3000/auth/callback`

### Step 5: Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📦 Deploy to Production

### GitHub + Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (same as `.env.local`)
   - Deploy!

3. **Update Supabase**:
   - Authentication → URL Configuration
   - Add your Vercel URL: `https://your-project.vercel.app/auth/callback`

---

## 📚 Full Documentation

- **Complete Setup**: See `SETUP_GUIDE.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Main Docs**: See `README.md`

---

**That's it!** Your AI Webinar Platform is ready to use. 🚀


