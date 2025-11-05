# Push to GitHub - Local Git Commands

Follow these steps to push your project to GitHub using Git from your local terminal.

## 📋 Step-by-Step Commands

### Step 1: Check Current Status

First, see what files you have:

```bash
git status
```

If you see "not a git repository", proceed to Step 2. If you already have a git repo, skip to Step 3.

### Step 2: Initialize Git Repository

```bash
git init
```

This creates a new Git repository in your current directory.

### Step 3: Verify .gitignore is Working

Check that your `.gitignore` file exists and is working:

```bash
# Check if .env.local is ignored (should NOT appear)
git status
```

You should **NOT** see:
- `.env.local`
- `node_modules/`
- `.next/`

If you see `.env.local` in the list, make sure it's in your `.gitignore` file.

### Step 4: Stage All Files

Add all files to Git (except those in `.gitignore`):

```bash
git add .
```

### Step 5: Verify What Will Be Committed

Check what files are staged:

```bash
git status
```

You should see:
- ✅ All your source code files
- ✅ Config files (package.json, tsconfig.json, etc.)
- ✅ Documentation files
- ❌ NO `.env.local`
- ❌ NO `node_modules/`
- ❌ NO `.next/`

### Step 6: Create First Commit

```bash
git commit -m "Initial commit: AI Webinar Platform"
```

### Step 7: Create GitHub Repository

**Option A: Using GitHub Website** (Recommended for beginners)

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in top right → **"New repository"**
3. Repository name: `ai-webinar-app` (or your preferred name)
4. Description: "AI-powered webinar platform"
5. Choose **Public** or **Private**
6. **⚠️ IMPORTANT**: Do NOT check "Add a README file" (you already have one)
7. Do NOT add .gitignore or license (you already have them)
8. Click **"Create repository"**

**Option B: Using GitHub CLI** (If you have `gh` installed)

```bash
gh repo create ai-webinar-app --public --source=. --remote=origin --push
```

### Step 8: Connect Local Repo to GitHub

After creating the repository on GitHub, connect your local repo:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git

# Verify remote was added
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/ai-webinar-app.git (fetch)
origin  https://github.com/YOUR_USERNAME/ai-webinar-app.git (push)
```

### Step 9: Rename Branch to Main (if needed)

```bash
git branch -M main
```

### Step 10: Push to GitHub

```bash
git push -u origin main
```

You'll be prompted for:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (NOT your GitHub password)

**If you don't have a Personal Access Token:**

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it: "AI Webinar App"
4. Select scopes: Check `repo` (full control)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

### Step 11: Verify Push

Go to your GitHub repository page and verify:
- ✅ All files are there
- ✅ No `.env.local` file
- ✅ README.md is visible
- ✅ All folders are present

---

## 🔄 Future Updates

After making changes, push updates with:

```bash
# Stage changes
git add .

# Commit changes
git commit -m "Your commit message here"

# Push to GitHub
git push
```

---

## 🐛 Troubleshooting

### "fatal: remote origin already exists"

If you already have a remote, remove it first:

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git
```

### "error: failed to push some refs"

If GitHub repository has different history:

```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### "Authentication failed"

- Make sure you're using a Personal Access Token, not password
- Check token has `repo` scope
- Try using SSH instead (see below)

### "Permission denied"

Check your GitHub username and repository name are correct:

```bash
git remote -v
```

---

## 🔐 Alternative: Using SSH (Recommended for Frequent Pushes)

If you prefer SSH authentication:

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub**:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste key and save

3. **Use SSH URL**:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/ai-webinar-app.git
   git push -u origin main
   ```

---

## ✅ Quick Reference

**Complete commands (copy and paste, replace YOUR_USERNAME):**

```bash
# Initialize
git init

# Stage files
git add .

# Commit
git commit -m "Initial commit: AI Webinar Platform"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git

# Set branch name
git branch -M main

# Push
git push -u origin main
```

---

## 📝 What Gets Pushed?

✅ **These files WILL be pushed:**
- All source code (`app/`, `components/`, `lib/`)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Documentation (`README.md`, etc.)
- Database schema (`supabase/schema.sql`)

❌ **These files will NOT be pushed** (thanks to `.gitignore`):
- `.env.local` (contains secrets)
- `node_modules/` (dependencies)
- `.next/` (build output)
- `.vercel/` (deployment cache)

---

**Next Steps**: After pushing to GitHub, see `SETUP_GUIDE.md` Part 2 for Vercel deployment instructions.


