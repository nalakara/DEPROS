export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "depros-portfolio";

/**
 * Validates that projectId is present in production environments.
 */
export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
