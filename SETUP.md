# FitAI — Next.js Loyiha Setup

## 1. Loyiha yaratish

```bash
npx create-next-app@latest fitai --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd fitai
```

## 2. Kerakli paketlar o'rnatish

```bash
npm install @anthropic-ai/sdk
npm install @supabase/supabase-js @supabase/ssr
npm install zustand
npm install react-dropzone
npm install recharts
npm install react-hot-toast
npm install lucide-react
```

## 3. .env.local fayl

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. Loyiha strukturasi

```
fitai/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles
│   │   ├── onboarding/
│   │   │   └── page.tsx        # Onboarding flow
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Dashboard (1 kunlik reja)
│   │   │   ├── diet/page.tsx   # Dieta sahifasi
│   │   │   └── workout/page.tsx # Mashq sahifasi
│   │   └── api/
│   │       ├── analyze/route.ts    # AI rasm tahlili
│   │       ├── diet/route.ts       # Dieta generatsiya
│   │       └── workout/route.ts    # Mashq generatsiya
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── landing/            # Landing page components
│   │   ├── onboarding/         # Onboarding steps
│   │   └── dashboard/          # Dashboard components
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── anthropic.ts        # Claude client
│   │   └── utils.ts            # Helper functions
│   ├── store/
│   │   └── userStore.ts        # Zustand global state
│   └── types/
│       └── index.ts            # TypeScript types
```

## 5. Supabase jadvallar

```sql
-- Foydalanuvchilar profili
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  height INTEGER,
  weight DECIMAL,
  age INTEGER,
  gender TEXT,
  goal TEXT,
  body_type TEXT,
  bmi DECIMAL,
  fat_percentage DECIMAL,
  plan_type TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tahlil natijalari
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  image_url TEXT,
  bmi DECIMAL,
  fat_percentage DECIMAL,
  body_type TEXT,
  ai_summary TEXT,
  weight_loss_estimate DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dieta rejalari
CREATE TABLE diet_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  day INTEGER,
  meals JSONB,
  total_calories INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mashq rejalari
CREATE TABLE workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  day INTEGER,
  exercises JSONB,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 6. Ishga tushirish

```bash
npm run dev
```

http://localhost:3000 da oching.
