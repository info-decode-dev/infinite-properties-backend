# Railway Deployment Guide

This guide will help you deploy the Infinite Properties Backend API to Railway.

## Prerequisites

- GitHub account with the repository: `info-decode-dev/infinite-properties-backend`
- Railway account (sign up at [railway.app](https://railway.app))
- Supabase project set up (for database and storage)

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account if prompted
5. Select the repository: `info-decode-dev/infinite-properties-backend`
6. Click "Deploy Now"

## Step 2: Configure Environment Variables

In your Railway project dashboard, go to **Variables** tab and add:

### Required Variables

```env
NODE_ENV=production
PORT=5000

# Database - Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS - Update with your frontend URL after deployment
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Supabase Storage Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_STORAGE_BUCKET=uploads
```

### How to Get Values

1. **DATABASE_URL**: 
   - Supabase Dashboard → Settings → Database → Connection string → URI
   - Replace `[YOUR-PASSWORD]` with your database password
   - Replace `[PROJECT-REF]` with your project reference

2. **SUPABASE_URL**:
   - Supabase Dashboard → Settings → API → Project URL

3. **SUPABASE_SERVICE_ROLE_KEY**:
   - Supabase Dashboard → Settings → API → Service Role Key (keep secret!)

4. **CORS_ORIGIN**:
   - Update this after deploying your frontend
   - Should match your frontend URL (e.g., `https://your-app.vercel.app`)

## Step 3: Configure Build Settings

Railway should auto-detect Node.js, but verify these settings:

1. Go to **Settings** → **Build & Deploy**
2. **Root Directory**: Leave empty (or set to `/` if needed)
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Watch Paths**: Leave default

## Step 4: Deploy

1. Railway will automatically start building and deploying
2. Watch the build logs in the **Deployments** tab
3. Once deployed, Railway will provide a URL like: `https://your-app.railway.app`

## Step 5: Verify Deployment

1. **Health Check**: Visit `https://your-app.railway.app/health`
   - Should return: `{"success":true,"message":"Server is running","database":"connected"}`

2. **Test API Endpoint**: 
   ```bash
   curl https://your-app.railway.app/api/properties/public
   ```

## Step 6: Update Frontend

Update your frontend environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

## Step 7: Configure Custom Domain (Optional)

1. In Railway dashboard, go to **Settings** → **Networking**
2. Click "Generate Domain" or add your custom domain
3. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails

- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if connection string includes `?pgbouncer=true&connection_limit=1`
- Ensure Supabase database is accessible

### CORS Errors

- Update `CORS_ORIGIN` to match your frontend URL exactly
- Include protocol (`https://`) and no trailing slash
- Restart deployment after updating

### File Upload Issues

- Verify Supabase Storage bucket exists and is public
- Check `SUPABASE_SERVICE_ROLE_KEY` has correct permissions
- Ensure `SUPABASE_STORAGE_BUCKET` matches bucket name

## Monitoring

- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: Check CPU, Memory, and Network usage
- **Deployments**: View deployment history and rollback if needed

## Environment-Specific Notes

### Production

- Use strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- Set `NODE_ENV=production`
- Enable monitoring and alerts
- Set up backups for Supabase database

### Development

- Use separate Supabase project for development
- Set `NODE_ENV=development` for detailed logs
- Use local database for testing

## Next Steps

1. Deploy frontend to Vercel/Netlify
2. Update `CORS_ORIGIN` with frontend URL
3. Test full application flow
4. Set up monitoring and alerts
5. Configure custom domain

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Supabase Docs: https://supabase.com/docs
