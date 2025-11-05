# Local Git Commands - Windows Command Prompt

Run these commands **one by one** in your Command Prompt or PowerShell.

## 📝 Step-by-Step Commands

### Step 1: Open Command Prompt in Your Project Folder

1. Press `Windows + R`
2. Type: `cmd` and press Enter
3. Navigate to your project:
   ```cmd
   cd "C:\Users\GKAY\Downloads\AI Webinar"
   ```

**OR** Right-click in your project folder → "Open in Terminal" or "Open PowerShell here"

---

### Step 2: Check if Git is Installed

```cmd
git --version
```

If you see a version number, Git is installed. If not, install Git from [git-scm.com](https://git-scm.com/download/win)

---

### Step 3: Initialize Git Repository (if not already done)

```cmd
git init
```

---

### Step 4: Check Current Status

```cmd
git status
```

You should see a list of files. Make sure `.env.local` is NOT in the list (it should be ignored).

---

### Step 5: Add All Files

```cmd
git add .
```

This stages all files for commit (except those in `.gitignore`).

---

### Step 6: Create Your First Commit

```cmd
git commit -m "Initial commit: AI Webinar Platform"
```

---

### Step 7: Create GitHub Repository (on GitHub Website)

1. Open your browser
2. Go to [github.com](https://github.com) and sign in
3. Click the **"+"** icon (top right) → **"New repository"**
4. Repository name: `ai-webinar-app`
5. Choose **Public** or **Private**
6. **⚠️ IMPORTANT**: Do NOT check "Add a README file"
7. Click **"Create repository"**

---

### Step 8: Connect to GitHub (Replace YOUR_USERNAME)

```cmd
git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git
```

**Example**: If your GitHub username is `johnsmith`, the command would be:
```cmd
git remote add origin https://github.com/johnsmith/ai-webinar-app.git
```

---

### Step 9: Rename Branch to Main

```cmd
git branch -M main
```

---

### Step 10: Push to GitHub

```cmd
git push -u origin main
```

**When prompted:**
- **Username**: Enter your GitHub username
- **Password**: Enter a **Personal Access Token** (NOT your GitHub password)

**To create a Personal Access Token:**
1. Go to GitHub.com → Click your profile picture → **Settings**
2. Scroll down → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Click **"Generate new token (classic)"**
4. Name: `AI Webinar App`
5. Check the box: **`repo`** (full control of private repositories)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)
8. Use this token as your password when pushing

---

## ✅ Verify It Worked

After pushing, go to your GitHub repository page:
- `https://github.com/YOUR_USERNAME/ai-webinar-app`

You should see all your files there!

---

## 🔄 Complete Command Sequence (Copy & Paste)

Run these commands one by one (replace `YOUR_USERNAME` with your actual GitHub username):

```cmd
cd "C:\Users\GKAY\Downloads\AI Webinar"
git init
git add .
git commit -m "Initial commit: AI Webinar Platform"
git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git
git branch -M main
git push -u origin main
```

---

## 🐛 Common Issues

### Issue: "fatal: remote origin already exists"

**Solution:**
```cmd
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ai-webinar-app.git
```

### Issue: "Authentication failed"

**Solution:** Make sure you're using a Personal Access Token, not your GitHub password.

### Issue: "error: src refspec main does not match any"

**Solution:**
```cmd
git branch -M main
git push -u origin main
```

### Issue: "Permission denied (publickey)"

**Solution:** You need to authenticate. Use Personal Access Token as password when prompted.

---

## 📋 Checklist

Before pushing, verify:

- [ ] `.gitignore` file exists in your project
- [ ] `.env.local` is NOT visible when you run `git status`
- [ ] GitHub repository is created (empty, no README)
- [ ] You have a Personal Access Token ready
- [ ] You know your GitHub username

---

## 🎯 Next Steps After Pushing

1. ✅ Your code is now on GitHub
2. Next: Connect to Vercel (see `SETUP_GUIDE.md` Part 2)
3. Then: Set up Supabase (see `SETUP_GUIDE.md` Part 3)

---

**Need help?** Check the error message and refer to the troubleshooting section above.


