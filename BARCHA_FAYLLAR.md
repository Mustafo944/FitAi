# FitAI — Barcha fayllar tayyor! 🎉

## Fayl strukturasi (nusxa ko'chiring):

```
fitai/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ✅ Landing page
│   │   ├── layout.tsx                  ✅ Root layout
│   │   ├── globals.css                 ✅ Styles
│   │   ├── auth/page.tsx               ✅ Login/Register
│   │   ├── onboarding/page.tsx         ✅ 3 qadam + AI tahlil
│   │   ├── dashboard/
│   │   │   ├── page.tsx                ✅ Bosh dashboard
│   │   │   ├── diet/page.tsx           ✅ Dieta + retseptlar
│   │   │   ├── workout/page.tsx        ✅ Mashq + timer
│   │   │   └── progress/page.tsx       ✅ Grafik
│   │   └── api/
│   │       ├── analyze/route.ts        ✅ AI rasm tahlili
│   │       ├── diet/route.ts           ✅ Dieta generator
│   │       └── workout/route.ts        ✅ Mashq generator
│   ├── lib/
│   │   ├── supabase.ts                 ✅ Browser client
│   │   └── supabase-server.ts          ✅ Server client
│   ├── middleware.ts                   ✅ Auth himoya
│   ├── store/userStore.ts              ✅ Zustand state
│   └── types/index.ts                  ✅ TypeScript types
```

## .env.local (loyiha root ga):

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Supabase Dashboard da:

1. Authentication → Email qo'shing
2. SQL Editor da quyidagi jadvallarni yarating:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  height INTEGER, weight DECIMAL, age INTEGER,
  gender TEXT, goal TEXT, body_type TEXT,
  bmi DECIMAL, fat_percentage DECIMAL,
  plan_type TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  bmi DECIMAL, fat_percentage DECIMAL,
  body_type TEXT, ai_summary TEXT,
  weight_loss_estimate DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS yoqing
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Foydalanuvchi o'z profilini ko'radi"
  ON profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Foydalanuvchi o'z tahlilini ko'radi"
  ON analyses FOR ALL USING (auth.uid() = user_id);
```

## O'rnatish va ishga tushirish:

```bash
# 1. Loyiha yarating
npx create-next-app@latest fitai --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd fitai

# 2. Paketlar
npm install @anthropic-ai/sdk @supabase/supabase-js @supabase/ssr zustand react-dropzone recharts react-hot-toast lucide-react

# 3. Fayllarni nusxa ko'chiring (yuqoridagi strukturaga ko'ra)

# 4. .env.local yarating va kalitlarni qo'ying

# 5. Ishga tushiring
npm run dev
```

## Vercel deploy:

```bash
npm install -g vercel
vercel
# Environment variables ni Vercel dashboard da ham qo'shing
```

## Keyingi qadamlar (kelajak):
- [ ] Stripe to'lov tizimi ($4.99/oy)
- [ ] 30 kunlik reja generatsiya (Pro users)
- [ ] Haftalik progress rasm yuklash
- [ ] Push notifications (Vercel Edge)
- [ ] React Native app (Expo)
