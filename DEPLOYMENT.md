# Deployment Guide - Vercel

## 🚀 Quick Deployment Steps

Your TaskFlow app is **ready for deployment** to Vercel!

### ✅ Pre-deployment Checklist

- ✅ `vercel.json` configuration file created
- ✅ Build script configured in `package.json`
- ✅ Vite build configuration set up
- ✅ Environment variable support added
- ✅ README updated with deployment instructions

### 📦 Build Information

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: Latest LTS (auto-detected by Vercel)

### 🌐 Deployment Options

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Create Git Repository** (if not already done):
   ```bash
   cd Zylntrex_frotned/zylentrex
   git init
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Push to GitHub/GitLab/Bitbucket**:
   - Create a new repository on your preferred platform
   - Push your code

3. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect the Vite configuration
   - Click "Deploy"

4. **Configure Environment Variables** (Optional):
   - After deployment, go to Project Settings → Environment Variables
   - Add: `VITE_GEMINI_API_KEY` = `AIzaSyB38iiitB0SPujfTggC5UFEgG-jXLd7UOE`
   - Redeploy to apply changes

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project**:
   ```bash
   cd Zylntrex_frotned/zylentrex
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name? (choose a name)
   - Directory? (press Enter)
   - Override settings? **N**

5. **Production deployment**:
   ```bash
   vercel --prod
   ```

### 🔧 Post-Deployment Configuration

1. **Environment Variables** (optional):
   - The Gemini API key is already set with a fallback
   - You can override it in Vercel dashboard if needed

2. **Custom Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain

3. **Analytics** (optional):
   - Enable Vercel Analytics in Project Settings
   - Track your app's performance

### 🐛 Troubleshooting

**Build Fails**:
- Ensure all dependencies are in `package.json`
- Check that `vercel.json` is in the root directory
- Review build logs in Vercel dashboard

**Routes Not Working**:
- Verify `vercel.json` has SPA rewrite rules
- Ensure React Router is configured correctly

**Environment Variables**:
- Check that variables are prefixed with `VITE_`
- Redeploy after adding/changing variables

### 📊 Build Output

After deployment, your app will be available at:
- **Staging**: `https://your-project.vercel.app`
- **Production**: `https://your-project.vercel.app` (after `vercel --prod`)

### 🔄 Automatic Deployments

Vercel will automatically deploy on:
- Every push to main branch (production)
- Every push to other branches (preview deployments)
- Pull requests (preview deployments)

### 📝 Next Steps

1. Test your deployed app
2. Share the link with your team
3. Set up custom domain (optional)
4. Enable analytics (optional)
5. Configure CORS if needed for backend API

### 🎉 Success!

Your TaskFlow app should now be live on Vercel with:
- ✅ Fast global CDN
- ✅ Automatic HTTPS
- ✅ Serverless functions support
- ✅ Preview deployments for PRs
- ✅ Automatic builds from Git

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html

