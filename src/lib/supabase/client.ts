import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "./env";

let browserClient: SupabaseClient | null = null;

/**
 * Creates or retrieves a singleton browser-safe Supabase client.
 * Uses public anon key with Row Level Security (RLS) enforcement.
 * Returns null if Supabase environment variables are not yet configured.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (browserClient) return browserClient;

  const config = getPublicSupabaseConfig();
  if (!config) return null;

  browserClient = createClient(
    config.supabaseUrl,
    config.supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );

  return browserClient;
}
