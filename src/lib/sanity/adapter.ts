import {
  CanonicalPortfolioEntry,
  CanonicalMediaItem,
  ClientItem,
  SemanticCategoryId,
  FramingConfig,
} from "@/lib/types";
import {
  SanityProjectDocument,
  SanityClientDocument,
  SanityMediaItem,
} from "./types";
import {
  validateSanityProject,
  validateSanityClient,
  validateSanityMedia,
} from "./validation";

/**
 * Normalizes a raw Sanity media asset object into a CanonicalMediaItem.
 * Derives orientation and guarantees zero Cumulative Layout Shift (CLS)
 * by preserving intrinsic width, height, and aspect ratio.
 */
export function normalizeSanityMedia(item: SanityMediaItem): CanonicalMediaItem {
  const dims = item.asset?.metadata?.dimensions;
  const width = dims?.width;
  const height = dims?.height;

  if (!width || !height) {
    throw new Error("Cannot normalize media item: missing intrinsic width or height dimensions.");
  }

  const aspectRatio = dims?.aspectRatio ?? width / height;

  let orientation: CanonicalMediaItem["orientation"] = "landscape";
  if (aspectRatio > 2.0) {
    orientation = "panoramic";
  } else if (aspectRatio >= 1.05) {
    orientation = "landscape";
  } else if (aspectRatio <= 0.95) {
    orientation = "portrait";
  } else {
    orientation = "square";
  }

  return {
    src: item.asset.url,
    alt: item.alt,
    width,
    height,
    aspectRatio,
    orientation,
    role: item.role || "primary",
    caption: item.caption,
  };
}

/**
 * Adapts a raw Sanity Client document into the canonical ClientItem model.
 */
export function adaptSanityClient(doc: SanityClientDocument): ClientItem {
  validateSanityClient(doc);

  return {
    id: doc._id.replace(/^client-/, "").replace(/^drafts\./, ""),
    name: doc.name,
    scope: doc.scope || "",
    industry: doc.industry || "",
    location: doc.location || "",
  };
}

/**
 * Normalizes a raw Sanity Project document into a CanonicalPortfolioEntry.
 *
 * Guarantees that:
 * 1. Output adheres strictly to the canonical contract.
 * 2. No Sanity-specific types, reference pointers, or internal properties leak into the frontend.
 * 3. Client references and editorial overrides are properly resolved.
 * 4. Framing configurations are cleanly parsed and preserved.
 */
export function adaptSanityProject(doc: SanityProjectDocument): CanonicalPortfolioEntry {
  // Validate schema constraints
  validateSanityProject(doc);

  // Normalize media visual assets
  const media: CanonicalMediaItem[] = doc.media.map((item, idx) => {
    validateSanityMedia(item, doc._id, idx);
    return normalizeSanityMedia(item);
  });

  const primaryMedia =
    media.find((m) => m.role === "primary" || m.role === "composite") || media[0];

  // Resolve Client attribution
  let clientName: string | undefined;
  if (doc.client && typeof doc.client === "object" && "name" in doc.client) {
    clientName = (doc.client as { name: string }).name;
  }

  // Parse Framing Configuration
  let framingConfig: FramingConfig | undefined;
  if (doc.framingConfig) {
    let editorialRows: number[][] | undefined;
    if (Array.isArray(doc.framingConfig.editorialRows)) {
      editorialRows = doc.framingConfig.editorialRows;
    } else if (typeof doc.framingConfig.editorialRows === "string") {
      try {
        const parsed = JSON.parse(doc.framingConfig.editorialRows);
        if (Array.isArray(parsed)) {
          editorialRows = parsed;
        }
      } catch {
        editorialRows = undefined;
      }
    }

    const layoutMode = doc.framingConfig.layoutMode || "auto";
    framingConfig = {
      layoutMode,
      mode: layoutMode,
      editorialRows,
      gap: doc.framingConfig.gap || "hairline",
      mobileStack: doc.framingConfig.mobileStack !== false,
    };
  }

  // Determine canonical identity vs slug
  const canonicalId =
    doc.id || doc._id.replace(/^project-/, "").replace(/^drafts\./, "");
  const canonicalSlug = doc.slug.current;

  return {
    id: canonicalId,
    slug: canonicalSlug,
    title: doc.title,
    subtitle: doc.subtitle,
    category: doc.category as SemanticCategoryId,
    categorySlug: doc.category,
    presentationType: doc.presentationType || "standalone",
    contentSubtype: doc.contentSubtype,
    client: clientName,
    clientDisplayName: doc.clientDisplayName || undefined,
    description: doc.description,
    scope: doc.scope,
    year: doc.year,
    media,
    // Compatibility accessors for existing rendering components:
    images: media,
    image: primaryMedia?.src || "",
    featured: Boolean(doc.featured),
    published: doc.published !== false && !doc._id.startsWith("drafts."),
    order: doc.order,
    framingConfig,
    provenance: doc.provenance,
  };
}

/**
 * Normalizes an array of Sanity Project documents into CanonicalPortfolioEntry[].
 */
export function adaptSanityProjects(
  docs: SanityProjectDocument[]
): CanonicalPortfolioEntry[] {
  return docs.map(adaptSanityProject);
}
