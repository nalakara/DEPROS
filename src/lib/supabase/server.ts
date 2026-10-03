import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getServerSupabaseConfig } from "./env";

/**
 * Creates a server-side Supabase client.
 *
 * Options:
 * - privileged: boolean (default false)
 *   If true, uses SUPABASE_SERVICE_ROLE_KEY to bypass RLS.
 *   If false, uses NEXT_PUBLIC_SUPABASE_ANON_KEY to enforce public RLS policies.
 */
export function getSupabaseServerClient(options?: {
  privileged?: boolean;
}): SupabaseClient {
  const config = getServerSupabaseConfig();

  const apiKey =
    options?.privileged && config.supabaseServiceRoleKey
      ? config.supabaseServiceRoleKey
      : config.supabaseAnonKey;

  return createClient(config.supabaseUrl, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
