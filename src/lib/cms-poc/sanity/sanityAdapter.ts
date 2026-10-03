import { CanonicalPortfolioEntry, CanonicalMediaItem, ClientItem } from "@/lib/types";
import { SanityProjectDocument, SanityClientDocument, SanityMediaItem } from "./types";

/**
 * Normalizes a raw Sanity Media Item into a CanonicalMediaItem.
 * Extracts intrinsic width and height from asset metadata to preserve zero CLS.
 */
export function normalizeSanityMedia(item: SanityMediaItem): CanonicalMediaItem {
  const dims = item.asset?.metadata?.dimensions;
  const width = dims?.width || 1200;
  const height = dims?.height || 800;
  const aspectRatio = dims?.aspectRatio || width / height;

  let orientation: CanonicalMediaItem["orientation"] = "landscape";
  if (aspectRatio > 2.0) orientation = "panoramic";
  else if (aspectRatio >= 1.15) orientation = "landscape";
  else if (aspectRatio <= 0.88) orientation = "portrait";
  else orientation = "square";

  return {
    src: item.asset?.url || "",
    alt: item.alt || "DEPROS portfolio artwork",
    width,
    height,
    aspectRatio,
    orientation,
    role: item.role || "primary",
    caption: item.caption,
  };
}

/**
 * Adapts a raw Sanity Client document into Canonical ClientItem.
 */
export function adaptSanityClient(doc: SanityClientDocument): ClientItem {
  return {
    id: doc._id.replace(/^client-/, ""),
    name: doc.name,
    scope: doc.scope,
    industry: doc.industry,
    location: doc.location,
  };
}

/**
 * Normalizes a raw Sanity Project document into CanonicalPortfolioEntry.
 * Guarantees zero vendor-specific types leak into frontend components.
 */
export function adaptSanityProject(doc: SanityProjectDocument): CanonicalPortfolioEntry {
  if (!doc.title || !doc.slug?.current || !doc.category) {
    throw new Error(`Invalid Sanity project document: Missing mandatory fields in ${doc._id}`);
  }

  const media = (doc.media || []).map(normalizeSanityMedia);
  const primaryMedia = media.find((m) => m.role === "primary" || m.role === "composite") || media[0];

  // Resolve client attribution from expanded document reference or string
  let clientName: string | undefined;
  if (doc.client) {
    if (typeof doc.client === "object" && "name" in doc.client) {
      clientName = doc.client.name;
    }
  }

  // Parse editorial rows if stringified JSON
  let editorialRows: number[][] | undefined = doc.framingConfig?.editorialRows;
  if (typeof editorialRows === "string") {
    try {
      editorialRows = JSON.parse(editorialRows);
    } catch {
      editorialRows = undefined;
    }
  }

  return {
    id: doc._id.replace(/^project-/, "").replace(/^drafts\./, ""),
    slug: doc.slug.current,
    title: doc.title,
    subtitle: doc.subtitle,
    category: doc.category,
    categorySlug: doc.category,
    presentationType: doc.presentationType || "standalone",
    contentSubtype: doc.contentSubtype,
    client: clientName,
    clientDisplayName: doc.clientDisplayName || clientName,
    description: doc.description,
    scope: doc.scope,
    year: doc.year,
    media,
    // Compatibility accessors for rendering components:
    images: media,
    image: primaryMedia?.src || "",
    featured: Boolean(doc.featured),
    published: doc.published !== false && !doc._id.startsWith("drafts."),
    order: doc.order,
    framingConfig: doc.framingConfig
      ? {
          layoutMode: doc.framingConfig.layoutMode || "auto",
          mode: doc.framingConfig.layoutMode || "auto",
          editorialRows,
          gap: doc.framingConfig.gap || "hairline",
          mobileStack: doc.framingConfig.mobileStack !== false,
        }
      : undefined,
    provenance: doc.provenance,
  };
}
