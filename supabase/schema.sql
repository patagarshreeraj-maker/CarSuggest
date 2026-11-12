-- ============================================================
-- DriveAI — Supabase Database Schema
-- Run this in your Supabase SQL Editor or via the MCP tool.
-- ============================================================

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  full_name     TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. User Favorites (saved / shortlisted cars)
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  car_id      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, car_id)
);

-- 3. User Comparisons (up to 4 cars in compare queue)
CREATE TABLE IF NOT EXISTS public.user_comparisons (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  car_ids     JSONB DEFAULT '[]'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. User Preferences (AI finder wizard answers)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences  JSONB DEFAULT '{}'::jsonb,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_car  ON public.user_favorites(car_id);
