# TravailLog Vercel Deployment Guide

This guide will walk you through deploying TravailLog to Vercel, a platform optimized for Next.js applications.

## Prerequisites

1. A [GitHub](https://github.com) account (you already have this)
2. A [Vercel](https://vercel.com) account (free tier is sufficient)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended for First-Time Deployment)

1. **Create a Vercel Account**
   - Go to [https://vercel.com/signup](https://vercel.com/signup)
   - Sign up with your GitHub account (recommended for seamless integration)

2. **Import Your Repository**
   - Once logged in, click the **"Add New..."** button
   - Select **"Project"**
   - Click **"Import Git Repository"**
   - Find and select your `Rong-Zhou-FR/TravailLog` repository
   - Click **"Import"**

3. **Configure Your Project**
   - **Framework Preset**: Vercel should auto-detect "Next.js" ✅
   - **Root Directory**: Leave as `./` (default)
   - **Build and Output Settings**: 
     - Build Command: `npm run build` (auto-detected)
     - Output Directory: `.next` (auto-detected)
     - Install Command: `npm install` (auto-detected)
   - **Environment Variables**: None required (this app uses only localStorage)
   
4. **Deploy**
   - Click the **"Deploy"** button
   - Wait for the build to complete (usually takes 1-2 minutes)
   - Once deployed, you'll receive a production URL (e.g., `https://travail-log.vercel.app`)

5. **Configure Custom Domain (Optional)**
   - Go to your project settings in Vercel
   - Navigate to the **"Domains"** tab
   - Add your custom domain and follow the DNS configuration instructions

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**
   ```bash
   cd /path/to/TravailLog
   vercel
   ```
   
   Follow the prompts:
   - **Set up and deploy**: Yes
   - **Which scope**: Select your account
   - **Link to existing project**: No (for first deployment)
   - **Project name**: travaillog (or your preferred name)
   - **Directory**: `./` (just press Enter)
   - **Override settings**: No (unless you have specific needs)

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 3: Deploy via GitHub Integration (Continuous Deployment)

Once you've completed Option 1 or 2:

1. **Automatic Deployments**
   - Every push to your `main` branch will trigger a production deployment
   - Every pull request will create a preview deployment
   - No additional configuration needed!

2. **Configure Deployment Branches (Optional)**
   - Go to your project settings in Vercel
   - Navigate to **"Git"** section
   - Configure which branches trigger production deployments

## Post-Deployment Configuration

### Verify Your Deployment

1. Visit your deployed URL
2. Test the following features:
   - ✅ Add a shift to a day
   - ✅ Navigate between months
   - ✅ Export data as JSON
   - ✅ Import previously exported data
   - ✅ View statistics updates
   - ✅ Dark mode toggle (if implemented)

### Performance Optimization

Your app is already optimized for Vercel with:
- ✅ Next.js 16 with Turbopack
- ✅ Static generation for optimal performance
- ✅ Automatic code splitting
- ✅ Edge network delivery

### Environment Variables

TravailLog doesn't require any environment variables because:
- All data is stored in the browser's localStorage
- No backend or API keys needed
- No server-side processing

However, if you want to disable Turbopack disk cache (optional):
1. Go to your project settings in Vercel
2. Navigate to **"Environment Variables"**
3. Add: `NEXT_PRIVATE_SKIP_DISK_CACHE` = `1`

## Monitoring and Analytics

### Vercel Analytics (Optional)

1. Go to your project in Vercel dashboard
2. Navigate to **"Analytics"** tab
3. Enable **Vercel Analytics** for insights on:
   - Page views
   - Performance metrics
   - User traffic

**Note**: TravailLog is privacy-focused, so avoid third-party analytics unless necessary.

### Error Monitoring

Vercel automatically provides:
- Build error logs
- Runtime error logs (accessible in the "Logs" tab)
- Performance insights

## Troubleshooting

### Build Failures

**Issue**: Build fails with Turbopack errors
**Solution**: 
```bash
# Add to Vercel environment variables:
NEXT_PRIVATE_SKIP_DISK_CACHE=1
```

**Issue**: Missing dependencies
**Solution**: Ensure `package.json` is committed and up to date

**Issue**: TypeScript errors
**Solution**: Run locally first:
```bash
npm run build
```
Fix any errors before deploying.

### Runtime Issues

**Issue**: Data not persisting between sessions
**Solution**: This is expected behavior - data is stored in browser localStorage, not on the server. Users need to export/import their data when changing browsers.

**Issue**: Dark mode not working
**Solution**: Clear browser cache and localStorage, then reload the page.

## Maintenance

### Updating Your Deployment

**Via Git (Automatic)**:
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Vercel will automatically detect and deploy the changes.

**Via CLI**:
```bash
vercel --prod
```

### Rollback to Previous Deployment

1. Go to your project in Vercel dashboard
2. Navigate to **"Deployments"** tab
3. Find a previous successful deployment
4. Click the three dots menu (**...**) 
5. Select **"Promote to Production"**

## Security Considerations

✅ **HTTPS**: Vercel provides automatic HTTPS for all deployments
✅ **No Secrets**: This app doesn't require any API keys or secrets
✅ **Privacy**: All user data stays in the browser (localStorage)
✅ **No Backend**: Reduces attack surface significantly

## Cost

- **Free Tier**: Suitable for personal use and moderate traffic
  - 100 GB bandwidth per month
  - Unlimited deployments
  - Automatic HTTPS
  
- **Pro Tier** ($20/month): For higher traffic or team collaboration
  - 1 TB bandwidth per month
  - Advanced analytics
  - Team collaboration features

For TravailLog, the **free tier is more than sufficient** for most users.

## Support

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **TravailLog Issues**: [https://github.com/Rong-Zhou-FR/TravailLog/issues](https://github.com/Rong-Zhou-FR/TravailLog/issues)

## Quick Reference

| Action | Command/URL |
|--------|-------------|
| Deploy to Vercel | Push to `main` branch or run `vercel --prod` |
| View deployment | Check Vercel dashboard or deployment URL |
| View logs | Vercel Dashboard → Project → Logs |
| Rollback | Vercel Dashboard → Deployments → Promote |
| Custom domain | Vercel Dashboard → Project → Domains |

## Deployment Checklist

Before deploying, ensure:
- [x] All code is committed and pushed to GitHub
- [x] `npm run build` succeeds locally
- [x] `npx eslint .` passes without errors
- [x] Environment variables configured (if any)
- [x] Custom domain DNS configured (if using custom domain)

After deployment, verify:
- [ ] Site loads correctly at deployment URL
- [ ] All features work (shift management, import/export, navigation)
- [ ] Dark mode works (if applicable)
- [ ] Mobile responsiveness is maintained
- [ ] No console errors in browser DevTools

---

**Congratulations!** 🎉 Your TravailLog app is now live on Vercel!
