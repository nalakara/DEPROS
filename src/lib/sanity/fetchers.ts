import { CanonicalPortfolioEntry, ClientItem } from "@/lib/types";
import { getSanityClient, SanityClientOptions } from "./client";
import {
  ALL_PORTFOLIO_ENTRIES_QUERY,
  ALL_PREVIEW_PORTFOLIO_ENTRIES_QUERY,
  PORTFOLIO_ENTRY_BY_SLUG_QUERY,
  PREVIEW_PORTFOLIO_ENTRY_BY_SLUG_QUERY,
  ALL_CLIENTS_QUERY,
} from "./queries";
import { adaptSanityProject, adaptSanityProjects, adaptSanityClient } from "./adapter";
import { SanityProjectDocument, SanityClientDocument } from "./types";

export interface FetchPortfolioOptions extends SanityClientOptions {
  tags?: string[];
}

/**
 * Fetches portfolio entries from Sanity and normalizes them into canonical DEPROS data structures.
 *
 * Supports:
 * 1. Default static rendering / ISR caching with Next.js cache tags (`tags: ["portfolio"]`).
 * 2. Next.js Draft Mode preview queries with `perspective: "previewDrafts"`.
 *
 * @param options Configuration options including draft mode and custom tags
 * @returns Array of validated CanonicalPortfolioEntry objects
 */
export async function getPortfolioEntries(
  options: FetchPortfolioOptions = {}
): Promise<CanonicalPortfolioEntry[]> {
  const { isDraftMode = false, tags = ["portfolio"], token } = options;
  const client = getSanityClient({ isDraftMode, token });
  const query = isDraftMode
    ? ALL_PREVIEW_PORTFOLIO_ENTRIES_QUERY
    : ALL_PORTFOLIO_ENTRIES_QUERY;

  try {
    const rawProjects = await client.fetch<SanityProjectDocument[]>(
      query,
      {},
      isDraftMode
        ? { cache: "no-store" }
        : { next: { tags } }
    );

    if (!Array.isArray(rawProjects)) {
      return [];
    }

    return adaptSanityProjects(rawProjects);
  } catch (error) {
    console.error("[Sanity Data Layer] Failed to fetch portfolio entries:", error);
    throw error;
  }
}

/**
 * Fetches a single portfolio entry by its URL slug.
 *
 * When `isDraftMode` is active, resolves staged drafts and unpublished records.
 *
 * @param slug The project URL identifier (e.g. "janus-bifrous")
 * @param options Configuration options including draft mode
 * @returns Validated CanonicalPortfolioEntry or null if not found
 */
export async function getPortfolioEntryBySlug(
  slug: string,
  options: FetchPortfolioOptions = {}
): Promise<CanonicalPortfolioEntry | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  const { isDraftMode = false, tags = ["portfolio", `portfolio:${slug}`], token } = options;
  const client = getSanityClient({ isDraftMode, token });
  const query = isDraftMode
    ? PREVIEW_PORTFOLIO_ENTRY_BY_SLUG_QUERY
    : PORTFOLIO_ENTRY_BY_SLUG_QUERY;

  try {
    const rawProject = await client.fetch<SanityProjectDocument | null>(
      query,
      { slug },
      isDraftMode
        ? { cache: "no-store" }
        : { next: { tags } }
    );

    if (!rawProject) {
      return null;
    }

    return adaptSanityProject(rawProject);
  } catch (error) {
    console.error(`[Sanity Data Layer] Failed to fetch portfolio entry "${slug}":`, error);
    throw error;
  }
}

/**
 * Fetches all published Client documents.
 *
 * @param options Configuration options
 * @returns Array of validated ClientItem objects
 */
export async function getClientItems(
  options: FetchPortfolioOptions = {}
): Promise<ClientItem[]> {
  const { isDraftMode = false, tags = ["clients"], token } = options;
  const client = getSanityClient({ isDraftMode, token });

  try {
    const rawClients = await client.fetch<SanityClientDocument[]>(
      ALL_CLIENTS_QUERY,
      {},
      isDraftMode
        ? { cache: "no-store" }
        : { next: { tags } }
    );

    if (!Array.isArray(rawClients)) {
      return [];
    }

    return rawClients.map(adaptSanityClient);
  } catch (error) {
    console.error("[Sanity Data Layer] Failed to fetch clients:", error);
    throw error;
  }
}
