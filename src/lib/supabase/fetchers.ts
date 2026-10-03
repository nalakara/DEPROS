import { SupabaseClient } from "@supabase/supabase-js";
import { CanonicalPortfolioEntry, ClientItem } from "@/lib/types";
import { SupabaseProjectDTO } from "./types";
import {
  adaptSupabaseProject,
  adaptSupabaseProjects,
  adaptSupabaseClient,
} from "./adapter";

/**
 * Standard select query string for fetching projects with joined media and client.
 */
const PROJECT_SELECT_QUERY = `
  id,
  slug,
  title,
  subtitle,
  category,
  presentation_type,
  content_subtype,
  client_id,
  client_display_name,
  description,
  scope,
  year,
  featured,
  status,
  display_order,
  framing_config,
  provenance,
  created_at,
  updated_at,
  client:clients (
    id,
    slug,
    name,
    scope,
    industry,
    location,
    created_at,
    updated_at
  ),
  media:project_media (
    id,
    project_id,
    src,
    alt,
    role,
    width,
    height,
    aspect_ratio,
    orientation,
    caption,
    display_order,
    created_at
  )
`;

/**
 * Fetches all published projects from Supabase and adapts them into CanonicalPortfolioEntry[].
 */
export async function fetchSupabaseProjects(
  client: SupabaseClient
): Promise<CanonicalPortfolioEntry[]> {
  const { data, error } = await client
    .from("projects")
    .select(PROJECT_SELECT_QUERY)
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch Supabase projects: ${error.message}`);
  }

  const dtos = (data || []) as unknown as SupabaseProjectDTO[];
  return adaptSupabaseProjects(dtos);
}

/**
 * Fetches a single published project by slug from Supabase.
 */
export async function fetchSupabaseProjectBySlug(
  client: SupabaseClient,
  slug: string
): Promise<CanonicalPortfolioEntry | null> {
  const { data, error } = await client
    .from("projects")
    .select(PROJECT_SELECT_QUERY)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Postgres error code for 0 rows returned with .single()
      return null;
    }
    throw new Error(
      `Failed to fetch Supabase project by slug '${slug}': ${error.message}`
    );
  }

  if (!data) return null;

  const dto = data as unknown as SupabaseProjectDTO;
  return adaptSupabaseProject(dto);
}

/**
 * Fetches featured published projects from Supabase.
 */
export async function fetchSupabaseFeaturedProjects(
  client: SupabaseClient
): Promise<CanonicalPortfolioEntry[]> {
  const { data, error } = await client
    .from("projects")
    .select(PROJECT_SELECT_QUERY)
    .eq("status", "published")
    .eq("featured", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(
      `Failed to fetch Supabase featured projects: ${error.message}`
    );
  }

  const dtos = (data || []) as unknown as SupabaseProjectDTO[];
  return adaptSupabaseProjects(dtos);
}

/**
 * Fetches all clients from Supabase and adapts them into ClientItem[].
 */
export async function fetchSupabaseClients(
  client: SupabaseClient
): Promise<ClientItem[]> {
  const { data, error } = await client
    .from("clients")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch Supabase clients: ${error.message}`);
  }

  return (data || []).map(adaptSupabaseClient);
}
