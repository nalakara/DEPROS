/**
 * Supabase Environment Configuration & Boundary Protection
 *
 * Rules:
 * 1. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are safe for browser use.
 * 2. SUPABASE_SERVICE_ROLE_KEY is SERVER-ONLY and must NEVER be prefixed with NEXT_PUBLIC_
 *    or exported to client bundles.
 */

export interface SupabasePublicConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export interface SupabaseServerConfig extends SupabasePublicConfig {
  supabaseServiceRoleKey?: string;
}

/**
 * Returns public Supabase configuration or null if not yet configured.
 * Does not throw by default to permit graceful fallback during POC/pre-provisioning.
 */
export function getPublicSupabaseConfig(): SupabasePublicConfig | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

/**
 * Asserts that server-only privileged configuration is accessed only on the server.
 */
export function getServerSupabaseConfig(): SupabaseServerConfig {
  if (typeof window !== "undefined") {
    throw new Error(
      "CRITICAL SECURITY VIOLATION: getServerSupabaseConfig() must NEVER be called in the browser!"
    );
  }

  const publicConfig = getPublicSupabaseConfig();
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!publicConfig) {
    throw new Error(
      "Supabase configuration missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required."
    );
  }

  return {
    ...publicConfig,
    supabaseServiceRoleKey,
  };
}
