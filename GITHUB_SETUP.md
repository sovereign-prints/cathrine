# GitHub Setup & Deployment Guide

## Step 1: Create GitHub Account

1. Go to https://github.com/signup
2. Create account with your email
3. Verify email
4. Done!

## Step 2: Create a New Repository

1. Go to https://github.com/new
2. **Repository name:** `sovereign-prints` (or any name you prefer)
3. **Description:** "Custom printing and branding website"
4. **Public or Private:** Public (easier to deploy)
5. Click **Create repository**

## Step 3: Upload Code to GitHub

### Option A: Using Git Command Line (Recommended)

If you have Git installed:

```bash
cd sovereign-prints

git init
git add .
git commit -m "Initial commit: Complete Sovereign Prints website with admin dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sovereign-prints.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Option B: Using GitHub Desktop (Easier)

1. Download GitHub Desktop: https://desktop.github.com
2. Install it
3. Click "Add" → "Add Existing Repository"
4. Choose the `sovereign-prints` folder
5. Click "Publish Repository"
6. Name it `sovereign-prints`
7. Make it Public
8. Click "Publish Repository"

### Option C: Using GitHub Web Interface (Simplest)

1. Go to your newly created repository
2. Click "uploading an existing file"
3. Drag and drop all files from `sovereign-prints` folder
4. Write commit message: "Initial commit: Sovereign Prints website"
5. Click "Commit changes"

## Step 4: Deploy to Render (5 minutes)

### 4.1 Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Use GitHub to sign up (easier!)
4. Authorize GitHub

### 4.2 Deploy

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `sovereign-prints` repository
4. **Name:** sovereign-prints
5. **Environment:** Node
6. **Build Command:** `npm install`
7. **Start Command:** `npm start`
8. **Plan:** Free (or paid if you want more uptime)
9. Click "Create Web Service"
10. Wait 2-3 minutes for deployment
11. Your URL will appear: `https://sovereign-prints-xxx.onrender.com`

### 4.3 Add Environment Variables

1. In Render dashboard, go to "Environment"
2. Add these variables:
   - `NODE_ENV` = `production`
   - `ADMIN_PASSWORD` = YOUR_STRONG_PASSWORD
   - `PORT` = Leave blank (Render sets this)
3. Click "Save"
4. Render will redeploy automatically

## Step 5: Test Your Live Website

1. Visit your new URL: `https://sovereign-prints-xxx.onrender.com`
2. Website should load
3. Try submitting a quote
4. Go to admin: `/admin`
5. Login with password
6. Check if quote appears in dashboard

## Step 6: Set Up Custom Domain (Optional)

### If You Have Your Own Domain

1. In Render dashboard: "Settings" → "Custom Domains"
2. Add domain (e.g., sovereignprints.co.za)
3. Follow DNS instructions
4. Point domain to Render nameservers
5. Wait 24-48 hours for DNS to update

### If You Don't Have a Domain

1. Buy one from:
   - Namecheap.com
   - GoDaddy.com
   - RegisterCo.za (South African)
2. Point to Render
3. Add in Render dashboard

## Making Changes After Deployment

### Every Time You Change Code

1. Make changes locally
2. Test with `npm start`
3. Commit to GitHub:
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```
4. Render automatically redeploys within 1 minute
5. Changes go live!

### To Edit Files Directly

Option 1: Edit in GitHub website
- Go to file on GitHub
- Click pencil icon
- Make changes
- Commit
- Render redeploys

Option 2: Edit locally, push to GitHub
- Edit file on your computer
- Push to GitHub
- Render redeploys

## Troubleshooting Deployment

### Website says "Build Failed"

1. Check Render dashboard "Logs"
2. Look for error message
3. Usually missing dependency or syntax error
4. Fix and push again

### Website loads but admin doesn't work

1. Check admin password in Render environment variables
2. Make sure password is in .env on GitHub (it shouldn't be!)
3. Add password only in Render environment variables
4. Redeploy

### Port already in use error

1. Make sure .env has `PORT=3000`
2. Or just leave PORT blank - Render sets it
3. Redeploy

### Database seems empty after deployment

1. This is normal - SQLite database resets with each deploy
2. To keep data persistent:
   - Upgrade to file-based database
   - Or use PostgreSQL (easy to add)
   - See README.md for details

## Keeping Your GitHub Clean

### What Should Be on GitHub
- ✅ All source code
- ✅ Configuration (without passwords)
- ✅ README and documentation
- ✅ .gitignore file

### What Should NOT Be on GitHub
- ❌ node_modules/ (added to .gitignore automatically)
- ❌ .env file with passwords (added to .gitignore automatically)
- ❌ Database files
- ❌ Uploaded images
- ❌ Log files

### If You Accidentally Uploaded .env

1. Delete the file from GitHub web interface
2. Run: `git rm --cached .env`
3. Push: `git push`
4. .env is now removed but protected by .gitignore going forward

## Updates & Maintenance

### Weekly
- Check Render dashboard for errors
- Monitor website performance

### Monthly
- Review GitHub commits
- Test new features locally before pushing
- Check Render logs for warnings

### When Adding Features
1. Create a new "branch" for testing
2. Push branch to GitHub
3. Test on Render with that branch
4. Merge to "main" when working
5. Delete old branches

## Useful Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Description of what changed"

# Push to GitHub
git push

# See commit history
git log

# Undo last commit
git reset --soft HEAD~1

# See differences
git diff
```

## Support

### Render Help
- https://render.com/docs
- https://render.com/support

### GitHub Help
- https://docs.github.com
- https://github.com/support

### Contact
- If something breaks, check Render logs first
- If code issue, check GitHub commit diff
- Re-read error messages carefully

## Next Steps

1. ✅ Create GitHub account
2. ✅ Push code to GitHub
3. ✅ Deploy to Render
4. ✅ Test website live
5. ✅ Set custom domain (optional)
6. ✅ Update business info on live site
7. ✅ Announce to customers!

---

**You're now a web developer! 🚀**

Sovereign Prints | August 2026
