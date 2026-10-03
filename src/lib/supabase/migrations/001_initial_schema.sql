-- =====================================================================
-- DEPROS Portfolio — Supabase PostgreSQL Schema & Security Policies
-- Migration: 001_initial_schema.sql
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- TABLE: clients
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  scope TEXT,
  industry TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_clients_slug ON public.clients(slug);

-- =====================================================================
-- TABLE: projects
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'product-design',
    'brand-identity',
    'logos',
    'corporate-identity',
    'marketing-kit',
    'graphic-visual',
    'social-media-content'
  )),
  presentation_type TEXT NOT NULL DEFAULT 'standalone' CHECK (presentation_type IN ('standalone', 'grouped')),
  content_subtype TEXT CHECK (content_subtype IN ('marketing-kit', 'sales-tools')),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  client_display_name TEXT,
  description TEXT,
  scope TEXT[] DEFAULT '{}',
  year TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 99,
  framing_config JSONB DEFAULT '{"layoutMode": "auto", "gap": "hairline", "mobileStack": true}'::jsonb,
  provenance JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance & filtering indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured_order ON public.projects(featured, display_order) WHERE status = 'published';

-- =====================================================================
-- TABLE: project_media
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  src TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'detail', 'supporting', 'composite')),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  aspect_ratio NUMERIC(6, 3) NOT NULL,
  orientation TEXT NOT NULL CHECK (orientation IN ('portrait', 'landscape', 'square', 'panoramic')),
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for ordering media assets per project
CREATE INDEX IF NOT EXISTS idx_project_media_project_order ON public.project_media(project_id, display_order);

-- =====================================================================
-- TRIGGER: updated_at auto-refresh
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_clients_updated
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_projects_updated
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- 2. Clients Table Policies
-- Public: Anyone can read client entities (for display on website)
CREATE POLICY "Public clients are viewable by everyone"
  ON public.clients
  FOR SELECT
  USING (true);

-- Authenticated Owner: Full access to insert, update, and delete
CREATE POLICY "Studio owner can manage clients"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Projects Table Policies
-- Public: Only published projects are viewable by unauthenticated users
CREATE POLICY "Public visitors can only view published projects"
  ON public.projects
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated Owner: Can view all projects (drafts, published, archived) and mutate
CREATE POLICY "Studio owner has full access to all projects"
  ON public.projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Project Media Table Policies
-- Public: Can only view media belonging to published projects
CREATE POLICY "Public visitors can view media for published projects"
  ON public.project_media
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE public.projects.id = public.project_media.project_id
        AND public.projects.status = 'published'
    )
  );

-- Authenticated Owner: Full access to project media
CREATE POLICY "Studio owner has full access to project media"
  ON public.project_media
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================================
-- SUPABASE STORAGE CONFIGURATION & POLICIES
-- =====================================================================

-- 1. Create Public Storage Bucket for Portfolio Media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800, -- 50MB per asset limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'];

-- 2. Storage Bucket Policies
-- Public: Anyone can view/download media assets
CREATE POLICY "Public can view portfolio media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-media');

-- Authenticated Owner: Upload, update, delete in portfolio-media bucket
CREATE POLICY "Studio owner can upload portfolio media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Studio owner can update portfolio media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-media');

CREATE POLICY "Studio owner can delete portfolio media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-media');
