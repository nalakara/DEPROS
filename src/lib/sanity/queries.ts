/**
 * GROQ Query Layer for DEPROS Portfolio
 *
 * Explicit GROQ queries projecting only required canonical fields.
 * Eliminates unneeded vendor payload while extracting intrinsic image metadata
 * directly from Sanity asset records.
 */

export const PROJECT_PROJECTION = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  id,
  title,
  slug,
  subtitle,
  category,
  presentationType,
  contentSubtype,
  "client": client->{
    _id,
    _type,
    name,
    scope,
    industry,
    location
  },
  clientDisplayName,
  description,
  scope,
  year,
  featured,
  published,
  order,
  media[] {
    _key,
    alt,
    role,
    caption,
    asset-> {
      _id,
      url,
      mimeType,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        },
        lqip
      }
    }
  },
  framingConfig {
    layoutMode,
    editorialRows,
    gap,
    mobileStack
  },
  provenance {
    sourceDocument,
    sourcePage,
    sourceCategory,
    sourceTitle,
    sourceSubtitle,
    sourceClient
  }
`;

/**
 * Query all published portfolio projects ordered by editorial sort priority.
 * Excludes drafts and unpublished records.
 */
export const ALL_PORTFOLIO_ENTRIES_QUERY = `
  *[_type == "project" && defined(slug.current) && published != false && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
    ${PROJECT_PROJECTION}
  }
`;

/**
 * Query all portfolio projects for preview mode (includes drafts and unpublished records).
 */
export const ALL_PREVIEW_PORTFOLIO_ENTRIES_QUERY = `
  *[_type == "project" && defined(slug.current)] | order(order asc, _createdAt desc) {
    ${PROJECT_PROJECTION}
  }
`;

/**
 * Query a single published portfolio project by URL slug.
 */
export const PORTFOLIO_ENTRY_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug && published != false && !(_id in path("drafts.**"))][0] {
    ${PROJECT_PROJECTION}
  }
`;

/**
 * Query a single portfolio project by URL slug for preview mode (supports drafts & unpublished state).
 */
export const PREVIEW_PORTFOLIO_ENTRY_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    ${PROJECT_PROJECTION}
  }
`;

/**
 * Query all published Client documents.
 */
export const ALL_CLIENTS_QUERY = `
  *[_type == "client" && !(_id in path("drafts.**"))] | order(name asc) {
    _id,
    _type,
    name,
    scope,
    industry,
    location
  }
`;
