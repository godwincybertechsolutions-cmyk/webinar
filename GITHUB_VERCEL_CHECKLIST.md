# GitHub & Vercel Deployment Checklist

## 📋 Step-by-Step Checklist

### ✅ Phase 1: Prepare Code for GitHub

- [ ] **Verify `.gitignore` is correct**
  - Should exclude: `.env.local`, `node_modules/`, `.next/`, `.vercel/`
  - See `.gitignore` file in project root

- [ ] **Check files to commit**:
  ```bash
  git status
  ```
  - Should NOT see: `.env.local`, `node_modules/`, `.next/`
  - Should see: All source code files, config files, documentation

- [ ] **Files that MUST be committed**:
  - ✅ `app/` folder (all files)
  - ✅ `components/` folder (all files)
  - ✅ `lib/` folder (all files)
  - ✅ `types/` folder (all files)
  - ✅ `supabase/` folder (schema.sql)
  - ✅ `package.json`
  - ✅ `tsconfig.json`
  - ✅ `tailwind.config.ts`
  - ✅ `next.config.mjs`
  - ✅ `middleware.ts`
  - ✅ `.gitignore`
  - ✅ `README.md`
  - ✅ All documentation files

### ✅ Phase 2: Push to GitHub

1. **Initialize Git** (if not done):
   ```bash
   git init
   ```

2. **Stage all files**:
   ```bash
   git add .
   ```

3. **Verify what will be committed**:
   ```bash
   git status
   ```
   - Double-check NO `.env.local` or secrets are included

4. **Create first commit**:
   ```bash
   git commit -m "Initial commit: AI Webinar Platform"
   ```

5. **Create GitHub repository**:
   - Go to github.com
   - Click "New repository"
   - Name: `ai-webinar-app`
   - Description: "AI-powered webinar platform"
   - Choose Public or Private
   - **DO NOT** initialize with README (you have one)
   - Click "Create repository"

6. **Connect and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git
   git branch -M main
   git push -u origin main
   ```

### ✅ Phase 3: Deploy to Vercel

1. **Sign up/Login to Vercel**:
   - Go to vercel.com
   - Sign up with GitHub (recommended for easy connection)

2. **Import project**:
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select `ai-webinar-app` repository
   - Click "Import"

3. **Configure build settings** (usually auto-detected):
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **⚠️ IMPORTANT: Add Environment Variables BEFORE Deploying**

   Click "Environment Variables" and add:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: (your Supabase project URL)
   Environments: Production, Preview, Development
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: (your Supabase anon key)
   Environments: Production, Preview, Development
   
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: (your Supabase service role key)
   Environments: Production, Preview, Development
   
   Name: OPENAI_API_KEY
   Value: (your OpenAI API key)
   Environments: Production, Preview, Development
   
   Name: NEXT_PUBLIC_LIVEKIT_URL
   Value: wss://your-livekit-url
   Environments: Production, Preview, Development
   
   Name: LIVEKIT_API_KEY
   Value: (your LiveKit API key)
   Environments: Production, Preview, Development
   
   Name: LIVEKIT_API_SECRET
   Value: (your LiveKit API secret)
   Environments: Production, Preview, Development
   
   Name: NEXT_PUBLIC_APP_URL
   Value: https://your-project.vercel.app
   Note: You'll get this URL after first deploy, update it then
   Environments: Production, Preview, Development
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-5 minutes
   - Watch build logs for any errors

6. **After first deploy**:
   - Copy your Vercel URL: `https://your-project.vercel.app`
   - Update `NEXT_PUBLIC_APP_URL` environment variable
   - Redeploy if needed

### ✅ Phase 4: Verify Deployment

- [ ] App loads at Vercel URL
- [ ] No console errors in browser
- [ ] Can access login/register pages
- [ ] Environment variables are set correctly
- [ ] Build completed without errors

---

## 🚨 Common Mistakes to Avoid

1. **❌ NEVER commit `.env.local`**
   - Check `git status` before committing
   - If you see `.env.local`, add it to `.gitignore` first

2. **❌ Don't forget environment variables in Vercel**
   - Set them BEFORE first deploy
   - Use same values as your local `.env.local`

3. **❌ Don't use localhost URLs in production**
   - Update `NEXT_PUBLIC_APP_URL` after deploy
   - Update Supabase redirect URLs

4. **❌ Don't skip Supabase setup**
   - Database schema must be run first
   - Authentication must be configured

---

## 📝 Quick Reference

### Files Structure for GitHub

```
✅ Push to GitHub:
├── app/                    ✅
├── components/             ✅
├── lib/                    ✅
├── types/                  ✅
├── supabase/              ✅
├── package.json            ✅
├── tsconfig.json           ✅
├── tailwind.config.ts      ✅
├── next.config.mjs         ✅
├── middleware.ts            ✅
├── .gitignore              ✅
└── *.md                    ✅

❌ DO NOT Push:
├── .env.local              ❌
├── node_modules/           ❌
├── .next/                  ❌
└── .vercel/                ❌
```

### Environment Variables Template

Copy these to Vercel (fill in your actual values):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_LIVEKIT_URL=wss://xxxxx.livekit.cloud
LIVEKIT_API_KEY=xxxxx
LIVEKIT_API_SECRET=xxxxx
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

---

**Need detailed Supabase setup?** See `SETUP_GUIDE.md` Part 3.


