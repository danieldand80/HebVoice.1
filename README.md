# HebVoice - המרת טקסט לדיבור בעברית

Text-to-Speech tool для израильского рынка, использующий Google AI Studio.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your credentials to `.env`:
- Supabase URL and Anon Key
- Google AI Studio API Key

4. Setup Supabase database:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### TTS Requests Table
```sql
CREATE TABLE tts_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  voice TEXT NOT NULL,
  speed DECIMAL NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

5. Run development server:
```bash
npm run dev
```

## Features

- ✅ Landing page с описанием
- ✅ Демо форма для TTS
- ✅ Google OAuth authentication (через Supabase)
- ✅ Выбор голоса и скорости
- ✅ Google AI Studio integration
- ✅ Tracking использования в БД
- ✅ Modern UI (inspired by elevenlabs)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- Google AI Studio (TTS)

## TODO

- [ ] Add Google API Key
- [ ] Configure Supabase project
- [ ] Test TTS generation
- [ ] Deploy to Vercel



