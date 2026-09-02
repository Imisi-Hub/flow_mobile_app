-- ─── Flow — Supabase Database Schema ────────────────────────────────────────
-- Draft schema. DO NOT run directly against production.
-- Review all RLS policies before applying via Supabase dashboard or CLI:
--   supabase db push   (or paste into Supabase SQL editor)
--
-- Notes:
--   - auth.users is managed by Supabase Auth (not defined here).
--   - All tables have RLS enabled and policies scoped to auth.uid() = user_id.
--   - encrypted_content stores AES-256-GCM ciphertext for Vault items.
--   - UUIDs use gen_random_uuid() (available in Postgres 13+ / Supabase).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid() on older PG

-- ── Domains ──────────────────────────────────────────────────────────────────
-- Work / Personal / Family buckets per user.
-- Users can have custom domains in addition to the three defaults.

CREATE TABLE IF NOT EXISTS public.domains (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,                       -- e.g. "Work", "Personal", "Family"
  color       TEXT,                                -- hex color for UI theming
  icon        TEXT,                                -- icon key for UI
  is_default  BOOLEAN NOT NULL DEFAULT FALSE,      -- system-seeded domains
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, name)
);

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

-- RLS Policies — domains
CREATE POLICY "Users can view their own domains"
  ON public.domains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own domains"
  ON public.domains FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domains"
  ON public.domains FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own domains"
  ON public.domains FOR DELETE
  USING (auth.uid() = user_id);


-- ── Tasks ─────────────────────────────────────────────────────────────────────
-- Core task entity. Quadrant maps to the Eisenhower Priority Matrix:
--   Q1 = Urgent + Important (Do Now)
--   Q2 = Not Urgent + Important (Schedule)
--   Q3 = Urgent + Not Important (Delegate)
--   Q4 = Not Urgent + Not Important (Eliminate)

CREATE TABLE IF NOT EXISTS public.tasks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_id         UUID REFERENCES public.domains(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  notes             TEXT,
  quadrant          TEXT CHECK (quadrant IN ('Q1', 'Q2', 'Q3', 'Q4')),
  status            TEXT NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'completed', 'archived', 'deleted')),
  priority          INTEGER NOT NULL DEFAULT 0,    -- manual sort within quadrant
  due_date          DATE,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Vault: AES-256-GCM encrypted blob (key stored in device SecureStore, not here)
  encrypted_content TEXT,
  encryption_iv     TEXT                           -- IV for AES-GCM (base64)
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies — tasks
CREATE POLICY "Users can view their own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- ── Focus Sessions ────────────────────────────────────────────────────────────
-- Records each deep-work timer session.

CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id     UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  duration    INTEGER NOT NULL DEFAULT 0,          -- actual seconds elapsed
  target_duration INTEGER,                         -- planned session length (seconds)
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at    TIMESTAMPTZ,
  interrupted BOOLEAN NOT NULL DEFAULT FALSE,      -- was the session cut short?
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own focus sessions"
  ON public.focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own focus sessions"
  ON public.focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own focus sessions"
  ON public.focus_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own focus sessions"
  ON public.focus_sessions FOR DELETE
  USING (auth.uid() = user_id);


-- ── Streaks ───────────────────────────────────────────────────────────────────
-- Tracks daily consistency streaks per type:
--   'focus'     — completed at least one focus session today
--   'tasks'     — completed at least one task today
--   'health'    — synced at least one health metric today (HealthKit / Google Fit)
--   'login'     — opened the app today

CREATE TABLE IF NOT EXISTS public.streaks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('focus', 'tasks', 'health', 'login')),
  count         INTEGER NOT NULL DEFAULT 0,        -- current consecutive days
  longest       INTEGER NOT NULL DEFAULT 0,        -- all-time longest streak
  last_updated  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, type)
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks"
  ON public.streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON public.streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.streaks FOR UPDATE
  USING (auth.uid() = user_id);


-- ── Achievements ──────────────────────────────────────────────────────────────
-- Gamification layer. achievement_key maps to a client-side enum.
-- Examples: 'first_focus', '7_day_streak', 'q2_master', 'vault_first_entry'

CREATE TABLE IF NOT EXISTS public.achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  progress        INTEGER NOT NULL DEFAULT 0,       -- 0–100 for partial progress
  metadata        JSONB,                            -- extra context (e.g. streak count at unlock)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, achievement_key)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON public.achievements FOR UPDATE
  USING (auth.uid() = user_id);


-- ── Seed: Default Domains ─────────────────────────────────────────────────────
-- These are inserted per-user via a trigger on auth.users insert,
-- so every new signup automatically gets the three domain buckets.

CREATE OR REPLACE FUNCTION public.seed_default_domains()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.domains (user_id, name, color, icon, is_default, sort_order)
  VALUES
    (NEW.id, 'Work',     '#C0603C', 'briefcase', TRUE, 0),
    (NEW.id, 'Personal', '#7A9E7E', 'person',    TRUE, 1),
    (NEW.id, 'Family',   '#C49A6C', 'people',    TRUE, 2);

  INSERT INTO public.streaks (user_id, type)
  VALUES
    (NEW.id, 'focus'),
    (NEW.id, 'tasks'),
    (NEW.id, 'health'),
    (NEW.id, 'login');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.seed_default_domains();
