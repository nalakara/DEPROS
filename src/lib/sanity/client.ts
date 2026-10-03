import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Default Server-Side Sanity Read Client (Published Documents)
 *
 * Configured with `perspective: "published"` to guarantee that only published
 * production documents are queried during standard page rendering and SSG builds.
 */
export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

export interface SanityClientOptions {
  isDraftMode?: boolean;
  token?: string;
}

/**
 * Returns a configured Sanity client instance.
 *
 * When `isDraftMode` is true:
 * - Configures `perspective: "previewDrafts"` to return unpublished drafts and staged edits.
 * - Disables CDN caching (`useCdn: false`) for real-time live preview.
 * - Injects the privileged `SANITY_API_READ_TOKEN` on the server to read draft documents.
 */
export function getSanityClient(options: SanityClientOptions = {}): SanityClient {
  const { isDraftMode = false, token } = options;

  if (isDraftMode) {
    const readToken = token || process.env.SANITY_API_READ_TOKEN;
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "previewDrafts",
      token: readToken,
    });
  }

  return sanityClient;
}
