/**
 * DEPROS Sanity Data Layer & Adapter Boundary
 *
 * This module is the sole boundary between Sanity Content Lake and DEPROS.
 * It provides canonical data fetchers, document adapters, and schema validation.
 */

export { sanityClient, getSanityClient } from "./client";
export type { SanityClientOptions } from "./client";
export {
  ALL_PORTFOLIO_ENTRIES_QUERY,
  ALL_PREVIEW_PORTFOLIO_ENTRIES_QUERY,
  PORTFOLIO_ENTRY_BY_SLUG_QUERY,
  PREVIEW_PORTFOLIO_ENTRY_BY_SLUG_QUERY,
  ALL_CLIENTS_QUERY,
  PROJECT_PROJECTION,
} from "./queries";
export {
  adaptSanityProject,
  adaptSanityProjects,
  adaptSanityClient,
  normalizeSanityMedia,
} from "./adapter";
export {
  validateSanityProject,
  validateSanityClient,
  validateSanityMedia,
  SanityValidationError,
} from "./validation";
export {
  getPortfolioEntries,
  getPortfolioEntryBySlug,
  getClientItems,
} from "./fetchers";
export type { FetchPortfolioOptions } from "./fetchers";
export type {
  SanityProjectDocument,
  SanityClientDocument,
  SanityMediaItem,
  SanityImageAsset,
  SanityAssetMetadataDimensions,
  SanityFramingConfig,
  SanityProvenance,
} from "./types";
