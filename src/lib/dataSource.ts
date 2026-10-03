import { CanonicalPortfolioEntry, ClientItem } from "@/lib/types";
import { CANONICAL_PORTFOLIO_ENTRIES, NOTABLE_CLIENTS } from "@/lib/data";
import {
  getPortfolioEntries as getSanityPortfolioEntries,
  getPortfolioEntryBySlug as getSanityPortfolioEntryBySlug,
  getClientItems as getSanityClientItems,
  FetchPortfolioOptions,
} from "@/lib/sanity/fetchers";

/**
 * Checks whether the application is configured to consume portfolio data
 * from Sanity CMS or fallback to the local canonical data store.
 *
 * Environment Variable:
 * - `ENABLE_SANITY_CMS="true"` -> Read from Sanity Content Lake via Sanity Adapter
 * - `ENABLE_SANITY_CMS="false"` (or unset) -> Read from local canonical data.ts
 */
export function isSanityEnabled(): boolean {
  return process.env.ENABLE_SANITY_CMS === "true";
}

/**
 * Unified application-facing accessor to retrieve all published portfolio presentation units.
 *
 * Directs queries to Sanity CMS when `ENABLE_SANITY_CMS="true"` or local canonical
 * dataset when disabled. Supports Next.js Draft Mode preview when `options.isDraftMode` is true.
 *
 * @param options Query and preview configuration
 * @returns Array of validated, canonical portfolio entries
 */
export async function getPortfolioEntries(
  options: FetchPortfolioOptions = {}
): Promise<CanonicalPortfolioEntry[]> {
  if (isSanityEnabled()) {
    try {
      return await getSanityPortfolioEntries(options);
    } catch (error) {
      console.error(
        "[DEPROS Data Boundary] Error fetching entries from Sanity CMS:",
        error
      );
      throw error;
    }
  }

  // Local Canonical Data Path (Rollback / Default)
  const entries = CANONICAL_PORTFOLIO_ENTRIES;
  if (options.isDraftMode) {
    return entries;
  }
  return entries.filter((p) => p.published !== false);
}

/**
 * Unified application-facing accessor to retrieve a single portfolio entry by slug.
 *
 * @param slug Project URL slug (e.g. "janus-bifrous")
 * @param options Query and preview configuration
 * @returns Validated canonical portfolio entry or null if not found
 */
export async function getPortfolioEntryBySlug(
  slug: string,
  options: FetchPortfolioOptions = {}
): Promise<CanonicalPortfolioEntry | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  if (isSanityEnabled()) {
    try {
      return await getSanityPortfolioEntryBySlug(slug, options);
    } catch (error) {
      console.error(
        `[DEPROS Data Boundary] Error fetching entry "${slug}" from Sanity CMS:`,
        error
      );
      throw error;
    }
  }

  // Local Canonical Data Path (Rollback / Default)
  const entry = CANONICAL_PORTFOLIO_ENTRIES.find((p) => p.slug === slug);
  if (!entry) {
    return null;
  }
  if (!options.isDraftMode && entry.published === false) {
    return null;
  }
  return entry;
}

/**
 * Unified application-facing accessor to retrieve notable client roster.
 *
 * @param options Query and preview configuration
 * @returns Array of validated client items
 */
export async function getClientItems(
  options: FetchPortfolioOptions = {}
): Promise<ClientItem[]> {
  if (isSanityEnabled()) {
    try {
      return await getSanityClientItems(options);
    } catch (error) {
      console.error(
        "[DEPROS Data Boundary] Error fetching clients from Sanity CMS:",
        error
      );
      throw error;
    }
  }

  // Local Canonical Data Path (Rollback / Default)
  return NOTABLE_CLIENTS;
}
