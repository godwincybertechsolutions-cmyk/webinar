-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('host', 'attendee')) DEFAULT 'attendee',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webinars table
CREATE TABLE IF NOT EXISTS public.webinars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')) DEFAULT 'upcoming',
  room_name TEXT UNIQUE NOT NULL,
  max_participants INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webinar registrations table
CREATE TABLE IF NOT EXISTS public.webinar_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(webinar_id, user_id)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcripts table
CREATE TABLE IF NOT EXISTS public.transcripts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  speaker TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI summaries table
CREATE TABLE IF NOT EXISTS public.ai_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE NOT NULL,
  summary_type TEXT CHECK (summary_type IN ('realtime', 'final')) NOT NULL,
  content TEXT NOT NULL,
  key_points JSONB,
  topics JSONB,
  keywords JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Q&A table
CREATE TABLE IF NOT EXISTS public.qa_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webinar analytics table
CREATE TABLE IF NOT EXISTS public.webinar_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  webinar_id UUID REFERENCES public.webinars(id) ON DELETE CASCADE NOT NULL,
  total_viewers INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  average_watch_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_webinars_host_id ON public.webinars(host_id);
CREATE INDEX IF NOT EXISTS idx_webinars_scheduled_at ON public.webinars(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON public.webinars(status);
CREATE INDEX IF NOT EXISTS idx_registrations_webinar_id ON public.webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.webinar_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_webinar_id ON public.chat_messages(webinar_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_webinar_id ON public.transcripts(webinar_id);
CREATE INDEX IF NOT EXISTS idx_qa_webinar_id ON public.qa_questions(webinar_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for webinars
CREATE POLICY "Anyone can view webinars" ON public.webinars
  FOR SELECT USING (true);

CREATE POLICY "Hosts can create webinars" ON public.webinars
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update own webinars" ON public.webinars
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete own webinars" ON public.webinars
  FOR DELETE USING (auth.uid() = host_id);

-- RLS Policies for registrations
CREATE POLICY "Users can view registrations" ON public.webinar_registrations
  FOR SELECT USING (true);

CREATE POLICY "Users can register for webinars" ON public.webinar_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own registrations" ON public.webinar_registrations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat messages
CREATE POLICY "Anyone can view chat messages" ON public.chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transcripts
CREATE POLICY "Anyone can view transcripts" ON public.transcripts
  FOR SELECT USING (true);

CREATE POLICY "System can insert transcripts" ON public.transcripts
  FOR INSERT WITH CHECK (true);

-- RLS Policies for AI summaries
CREATE POLICY "Anyone can view summaries" ON public.ai_summaries
  FOR SELECT USING (true);

CREATE POLICY "System can insert summaries" ON public.ai_summaries
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Q&A
CREATE POLICY "Anyone can view questions" ON public.qa_questions
  FOR SELECT USING (true);

CREATE POLICY "Users can ask questions" ON public.qa_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for analytics
CREATE POLICY "Anyone can view analytics" ON public.webinar_analytics
  FOR SELECT USING (true);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webinars_updated_at BEFORE UPDATE ON public.webinars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON public.webinar_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

