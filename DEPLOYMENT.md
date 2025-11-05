# Deployment Guide

This guide will walk you through deploying the AI Webinar Platform to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- OpenAI API account with credits
- LiveKit account or self-hosted instance

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for database to be provisioned

2. **Run Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the SQL script

3. **Configure Authentication**
   - Go to Authentication > Providers
   - Enable Email provider
   - Enable Google OAuth:
     - Create OAuth credentials in Google Cloud Console
     - Add authorized redirect URI: `https://your-domain.com/auth/callback`
     - Add credentials to Supabase

4. **Get API Keys**
   - Go to Settings > API
   - Copy your Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Copy your anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Copy your service_role key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

### 3. Set Up LiveKit

#### Option A: LiveKit Cloud (Recommended for beginners)

1. Sign up at [livekit.io](https://livekit.io)
2. Create a new project
3. Get your API key and secret
4. Use the provided WebSocket URL

#### Option B: Self-Host LiveKit

1. Follow the [LiveKit deployment guide](https://docs.livekit.io/deploy/)
2. Deploy to your preferred cloud provider (AWS, GCP, Azure, etc.)
3. Get your WebSocket URL and API credentials

### 4. Deploy to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   Add all these in Vercel's environment variables section:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-instance.com
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### 5. Update Supabase Redirect URLs

After deployment, update your Supabase auth configuration:

1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your production URL to Site URL: `https://your-domain.com`
3. Add redirect URL: `https://your-domain.com/auth/callback`

### 6. Test Your Deployment

1. Visit your deployed site
2. Test user registration
3. Test Google OAuth login
4. Create a test webinar
5. Test joining a webinar (if LiveKit is configured)
6. Test AI features (Q&A, summaries)

### 7. Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Go to Settings > Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update Supabase redirect URLs with your custom domain

## Production Optimizations

### Performance

1. **Enable Image Optimization**
   - Already configured in `next.config.mjs`
   - Consider using Supabase Storage for webinar thumbnails

2. **Enable Caching**
   - Vercel automatically handles caching
   - Consider adding Redis for additional caching if needed

### Security

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use Vercel's environment variables for secrets
   - Rotate API keys regularly

2. **Supabase RLS**
   - Review Row Level Security policies
   - Test with different user roles
   - Ensure proper access control

3. **Rate Limiting**
   - Consider adding rate limiting for API routes
   - Use Vercel's built-in rate limiting or middleware

### Monitoring

1. **Error Tracking**
   - Set up Sentry or similar service
   - Monitor API errors
   - Track user-reported issues

2. **Analytics**
   - Add analytics (Google Analytics, Plausible, etc.)
   - Track webinar engagement metrics
   - Monitor API usage (OpenAI, LiveKit)

### Email Notifications (Optional)

To enable email notifications:

1. **Set Up Email Service**
   - Choose a service: SendGrid, Resend, Mailgun, etc.
   - Get API credentials

2. **Update API Route**
   - Modify `app/api/webinars/[id]/notify/route.ts`
   - Add email service integration
   - Send reminder emails to registered users

3. **Add Environment Variables**
   ```
   EMAIL_API_KEY=your_email_api_key
   EMAIL_FROM=noreply@yourdomain.com
   ```

## Troubleshooting

### Build Errors

- **Module not found**: Check all dependencies are in `package.json`
- **Type errors**: Run `npm run build` locally to catch TypeScript errors
- **Environment variables**: Ensure all required vars are set in Vercel

### Runtime Errors

- **Supabase connection**: Verify URLs and keys are correct
- **LiveKit connection**: Check WebSocket URL and credentials
- **OpenAI API**: Verify API key and check usage limits

### Database Issues

- **RLS policies**: Review and test policies
- **Missing tables**: Re-run schema.sql
- **Permissions**: Check user roles and permissions

## Scaling Considerations

### Database

- Monitor Supabase usage
- Consider upgrading plan if needed
- Optimize queries and add indexes

### Video Streaming

- Monitor LiveKit usage
- Consider scaling LiveKit instances
- Implement participant limits per webinar

### AI Features

- Monitor OpenAI API usage and costs
- Implement caching for summaries
- Consider rate limiting for AI endpoints

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Check browser console for errors
4. Open an issue on GitHub

---

**Need Help?** Check the main README.md for more information or open an issue on GitHub.

