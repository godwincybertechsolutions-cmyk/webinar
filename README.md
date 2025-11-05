# AI Webinar Platform

A production-ready, full-stack AI-powered webinar web application that allows users to host, join, and interact in live webinars enhanced by AI features like live transcription, summarization, and Q&A assistance.

## Features

### Core Features

- **Authentication**: Email/password and Google OAuth login using Supabase Auth
- **Role-Based Access**: Host and Attendee roles with different permissions
- **Webinar Management**: Hosts can create, edit, and delete webinars
- **Live Streaming**: Real-time video and audio using LiveKit
- **Real-Time Chat**: Live chat using Supabase Realtime
- **AI Transcription**: Live captions powered by OpenAI Whisper
- **AI Summarization**: Real-time and post-event summaries using GPT-4
- **AI Q&A Assistant**: Natural language Q&A using GPT-4
- **Dashboards**: Separate dashboards for hosts and attendees
- **Modern UI**: Responsive design with dark/light theme toggle and smooth animations

### Bonus Features

- Email notifications for webinar reminders
- AI-powered topic tagging and keyword extraction
- Export webinar summaries as PDF/Markdown

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Realtime)
- **AI APIs**: OpenAI (GPT-4o-mini + Whisper)
- **Video Streaming**: LiveKit
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- OpenAI API key
- LiveKit account (or self-hosted instance)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-webinar-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Get your Supabase URL and anon key from Settings > API
4. Get your service role key from Settings > API (keep this secret!)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# LiveKit Configuration
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-instance.com
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4. Configure Supabase Authentication

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Email provider
3. Enable Google OAuth and configure:
   - Add your Google OAuth credentials
   - Set redirect URL to: `http://localhost:3000/auth/callback` (for dev)
   - For production: `https://your-domain.com/auth/callback`

### 5. Run Database Migrations

The schema is provided in `supabase/schema.sql`. Run it in your Supabase SQL Editor.

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Update Supabase Redirect URLs

After deployment, update your Supabase auth redirect URLs:
- Go to Authentication > URL Configuration
- Add your production URL: `https://your-domain.com/auth/callback`

### LiveKit Setup

#### Option 1: Use LiveKit Cloud

1. Sign up at [livekit.io](https://livekit.io)
2. Create a project and get your API key and secret
3. Use the provided WebSocket URL

#### Option 2: Self-Host LiveKit

Follow the [LiveKit deployment guide](https://docs.livekit.io/deploy/) for self-hosting.

### Production Checklist

- [ ] Set all environment variables in Vercel
- [ ] Update Supabase redirect URLs
- [ ] Configure Google OAuth for production domain
- [ ] Set up LiveKit (cloud or self-hosted)
- [ ] Test all features end-to-end
- [ ] Set up monitoring and error tracking
- [ ] Configure email service for notifications (optional)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── ai/           # AI endpoints (transcribe, summarize, answer)
│   │   └── livekit/      # LiveKit token generation
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   ├── webinar/          # Webinar room and summary pages
│   └── webinars/         # Webinar listing and creation
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── providers/        # Context providers
│   ├── ui/              # Reusable UI components
│   └── webinar/         # Webinar room components
├── lib/                  # Utility functions
│   ├── openai.ts        # OpenAI client
│   ├── livekit.ts       # LiveKit utilities
│   └── supabase/        # Supabase clients
├── supabase/             # Database schema
│   └── schema.sql       # Database schema and migrations
└── middleware.ts        # Next.js middleware for auth
```

## Usage Guide

### For Hosts

1. **Create Account**: Sign up and select "Host webinars"
2. **Create Webinar**: Go to Dashboard > Create Webinar
3. **Start Webinar**: When it's time, click "Join Live" on your webinar
4. **Manage**: Edit or delete webinars from your dashboard
5. **View Analytics**: Check stats and summaries after webinars

### For Attendees

1. **Browse Webinars**: Visit the webinars page to see available webinars
2. **Register**: Click "Register" on any upcoming webinar
3. **Join**: When live, click "Join Live" to enter the webinar room
4. **Interact**: Use chat, ask questions, view transcripts
5. **View Summary**: After completion, view AI-generated summaries

## API Endpoints

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/register` - Create account
- `GET /auth/callback` - OAuth callback

### Webinars
- `GET /webinars` - List all webinars
- `POST /webinars/create` - Create new webinar (host only)
- `GET /webinar/[id]` - Join webinar room
- `GET /webinar/[id]/summary` - View webinar summary

### API Routes
- `POST /api/livekit/token` - Generate LiveKit access token
- `POST /api/ai/transcribe` - Transcribe audio using Whisper
- `POST /api/ai/summarize` - Generate webinar summary
- `POST /api/ai/answer` - Get AI answer to question

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles with roles
- `webinars` - Webinar metadata
- `webinar_registrations` - User registrations
- `chat_messages` - Real-time chat messages
- `transcripts` - AI-generated transcripts
- `ai_summaries` - AI-generated summaries
- `qa_questions` - Q&A questions and answers
- `webinar_analytics` - Analytics data

See `supabase/schema.sql` for complete schema.

## Troubleshooting

### Common Issues

1. **LiveKit Connection Failed**
   - Check your LiveKit URL and credentials
   - Ensure WebSocket connections are allowed

2. **Supabase Auth Errors**
   - Verify redirect URLs are configured correctly
   - Check that OAuth providers are enabled

3. **AI Features Not Working**
   - Verify OpenAI API key is set correctly
   - Check API usage limits

4. **Real-time Updates Not Working**
   - Ensure Supabase Realtime is enabled
   - Check that RLS policies allow subscriptions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and OpenAI

