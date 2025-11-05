# Complete Setup Guide: GitHub, Vercel & Supabase

This guide will walk you through:
1. Which files to push to GitHub
2. Connecting to Vercel for deployment
3. Complete Supabase setup and integration

---

## 📁 Part 1: Files to Push to GitHub

### ✅ Files and Folders TO Push

```
ai-webinar-app/
├── app/                          ✅ Push (all application code)
├── components/                  ✅ Push (all React components)
├── lib/                          ✅ Push (utility functions)
├── types/                        ✅ Push (TypeScript types)
├── supabase/                    ✅ Push (database schema)
├── middleware.ts                 ✅ Push
├── next.config.mjs              ✅ Push
├── package.json                  ✅ Push
├── package-lock.json             ✅ Push (if exists)
├── postcss.config.mjs           ✅ Push
├── tailwind.config.ts           ✅ Push
├── tsconfig.json                 ✅ Push
├── .eslintrc.json                ✅ Push
├── .gitignore                    ✅ Push
├── README.md                     ✅ Push
├── DEPLOYMENT.md                 ✅ Push
├── CONTRIBUTING.md               ✅ Push
├── SETUP_GUIDE.md                ✅ Push (this file)
├── PROJECT_SUMMARY.md            ✅ Push
└── LICENSE                       ✅ Push
```

### ❌ Files and Folders NOT to Push

```
ai-webinar-app/
├── .env.local                    ❌ NEVER push (contains secrets)
├── .env                          ❌ NEVER push
├── .env.*.local                  ❌ NEVER push
├── node_modules/                 ❌ NEVER push (in .gitignore)
├── .next/                        ❌ NEVER push (in .gitignore)
├── .vercel/                      ❌ NEVER push (in .gitignore)
└── *.log                         ❌ NEVER push (in .gitignore)
```

### 📝 Your `.gitignore` Should Include

Check that your `.gitignore` contains:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

---

## 🚀 Part 2: Connect to Vercel for Deployment

### Step 1: Push Code to GitHub

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Webinar Platform"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it: `ai-webinar-app` (or your preferred name)
   - Choose Public or Private
   - **DO NOT** initialize with README (you already have one)
   - Click "Create repository"

3. **Connect and Push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign Up/Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (recommended)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `ai-webinar-app` repository

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables** (IMPORTANT - Do this BEFORE deploying):
   
   Click "Environment Variables" and add these one by one:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```

   ⚠️ **Note**: You'll get `NEXT_PUBLIC_APP_URL` after first deployment, but you can update it later.

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Your app will be live at: `https://your-project.vercel.app`

6. **Update Environment Variables** (after first deploy):
   - Go to Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
   - Redeploy if needed

### Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

---

## 🗄️ Part 3: Complete Supabase Setup

### Step 1: Create Supabase Project

1. **Sign Up/Login**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up or login with GitHub (recommended)

2. **Create New Project**:
   - Click "New Project"
   - **Organization**: Create or select one
   - **Name**: `ai-webinar-app` (or your choice)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier works for development
   - Click "Create new project"
   - Wait 2-3 minutes for project to provision

### Step 2: Set Up Database Schema

1. **Open SQL Editor**:
   - In Supabase Dashboard, go to "SQL Editor"
   - Click "New query"

2. **Run Schema**:
   - Open `supabase/schema.sql` from your project
   - Copy the ENTIRE contents
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Wait for "Success" message

3. **Verify Tables**:
   - Go to "Table Editor"
   - You should see these tables:
     - `profiles`
     - `webinars`
     - `webinar_registrations`
     - `chat_messages`
     - `transcripts`
     - `ai_summaries`
     - `qa_questions`
     - `webinar_analytics`

### Step 3: Get API Credentials

1. **Go to Settings → API**:
   - In Supabase Dashboard, click "Settings" (gear icon)
   - Click "API" in sidebar

2. **Copy These Values**:
   - **Project URL**: `https://xxxxx.supabase.co`
     - This is your `NEXT_PUBLIC_SUPABASE_URL`
   
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Safe to expose in frontend code
   
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - This is your `SUPABASE_SERVICE_ROLE_KEY`
     - ⚠️ **KEEP SECRET** - Never expose in frontend!

### Step 4: Configure Authentication

1. **Enable Email Provider**:
   - Go to "Authentication" → "Providers"
   - Find "Email" provider
   - Ensure it's enabled
   - Click "Save"

2. **Configure Google OAuth** (Optional but recommended):

   a. **Create Google OAuth Credentials**:
      - Go to [Google Cloud Console](https://console.cloud.google.com)
      - Create a new project or select existing
      - Go to "APIs & Services" → "Credentials"
      - Click "Create Credentials" → "OAuth client ID"
      - Application type: "Web application"
      - Name: "AI Webinar App"
      - Authorized redirect URIs:
        - Development: `http://localhost:3000/auth/callback`
        - Production: `https://your-domain.com/auth/callback`
      - Click "Create"
      - Copy "Client ID" and "Client secret"

   b. **Add to Supabase**:
      - In Supabase Dashboard → "Authentication" → "Providers"
      - Find "Google" provider
      - Enable it
      - Paste "Client ID" and "Client secret"
      - Click "Save"

3. **Configure Redirect URLs**:
   - Go to "Authentication" → "URL Configuration"
   - **Site URL**: 
     - Development: `http://localhost:3000`
     - Production: `https://your-vercel-app.vercel.app`
   - **Redirect URLs**: Add these:
     - `http://localhost:3000/auth/callback`
     - `https://your-vercel-app.vercel.app/auth/callback`
     - `https://your-custom-domain.com/auth/callback` (if using custom domain)

### Step 5: Enable Realtime (for Chat)

1. **Go to Database → Replication**:
   - In Supabase Dashboard, click "Database"
   - Click "Replication" in sidebar
   - Enable replication for:
     - `chat_messages`
     - `transcripts`
     - `qa_questions`

2. **Or Use SQL** (Alternative):
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
   ALTER PUBLICATION supabase_realtime ADD TABLE transcripts;
   ALTER PUBLICATION supabase_realtime ADD TABLE qa_questions;
   ```

### Step 6: Test Database Connection

1. **Create Local `.env.local` File**:
   ```bash
   # In your project root
   cp .env.local.example .env.local
   ```

2. **Fill in Values**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Test Connection**:
   ```bash
   npm run dev
   ```
   - Visit `http://localhost:3000`
   - Try to register a new account
   - Check Supabase Dashboard → "Authentication" → "Users"
   - You should see your new user!

---

## 🔗 Part 4: Connect Supabase to Vercel

### Step 1: Add Supabase Credentials to Vercel

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Environment Variables"

2. **Add These Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
   SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
   ```

3. **Select Environments**:
   - Check "Production"
   - Check "Preview"
   - Check "Development" (optional)

4. **Click "Save"**

### Step 2: Update Supabase Redirect URLs

1. **In Supabase Dashboard**:
   - Go to "Authentication" → "URL Configuration"
   - Add your Vercel URL to "Redirect URLs":
     - `https://your-project.vercel.app/auth/callback`

2. **Update Site URL**:
   - Change "Site URL" to your Vercel URL
   - Click "Save"

### Step 3: Redeploy Vercel

1. **Trigger Redeploy**:
   - Go to Vercel Dashboard → Your Project
   - Click "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"

   OR

   - Push a new commit to GitHub:
     ```bash
     git commit --allow-empty -m "Trigger redeploy"
     git push
     ```

---

## ✅ Verification Checklist

After setup, verify everything works:

### Local Development
- [ ] `npm run dev` starts without errors
- [ ] Can register new account
- [ ] Can login with email/password
- [ ] Can login with Google (if configured)
- [ ] Can create webinar (as host)
- [ ] Can browse webinars
- [ ] Database tables exist in Supabase

### Vercel Deployment
- [ ] Build completes successfully
- [ ] App loads at Vercel URL
- [ ] Authentication works
- [ ] Can access Supabase from production
- [ ] Environment variables are set correctly

### Supabase
- [ ] Database schema is applied
- [ ] Authentication providers are enabled
- [ ] Redirect URLs are configured
- [ ] Realtime is enabled for chat tables
- [ ] RLS policies are active

---

## 🐛 Troubleshooting

### "Failed to connect to Supabase"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Verify Supabase project is active

### "Authentication failed"
- Check redirect URLs in Supabase
- Verify OAuth credentials (if using Google)
- Check Site URL matches your app URL

### "Build failed on Vercel"
- Check all environment variables are set
- Verify `package.json` has all dependencies
- Check build logs in Vercel dashboard

### "Database errors"
- Verify schema was run successfully
- Check RLS policies allow your operations
- Verify user has correct role in `profiles` table

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [LiveKit Documentation](https://docs.livekit.io)

---

## 🎯 Quick Reference

### Environment Variables Needed

**Local Development** (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Vercel Production** (Set in Vercel Dashboard):
```
Same as above, but NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### Important URLs

- **Supabase Dashboard**: `https://app.supabase.com`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Your App**: `https://your-project.vercel.app`

---

**Need Help?** Check the main `README.md` or open an issue on GitHub.

