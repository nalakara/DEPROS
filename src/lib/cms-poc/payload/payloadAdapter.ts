import { CanonicalPortfolioEntry, CanonicalMediaItem, ClientItem } from "@/lib/types";
import { PayloadProjectDocument, PayloadClientDocument, PayloadProjectMediaItem, PayloadMediaUpload } from "./types";

/**
 * Normalizes a raw Payload Media Item into CanonicalMediaItem.
 * Extracts intrinsic width and height from asset upload object to preserve zero CLS.
 */
export function normalizePayloadMedia(item: PayloadProjectMediaItem): CanonicalMediaItem {
  const asset = typeof item.asset === "object" ? (item.asset as PayloadMediaUpload) : null;
  const width = asset?.width || 1200;
  const height = asset?.height || 800;
  const aspectRatio = width / height;

  let orientation: CanonicalMediaItem["orientation"] = "landscape";
  if (aspectRatio > 2.0) orientation = "panoramic";
  else if (aspectRatio >= 1.15) orientation = "landscape";
  else if (aspectRatio <= 0.88) orientation = "portrait";
  else orientation = "square";

  return {
    src: asset?.url || "",
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
 * Adapts a raw Payload Client document into Canonical ClientItem.
 */
export function adaptPayloadClient(doc: PayloadClientDocument): ClientItem {
  return {
    id: doc.id.replace(/^client-/, ""),
    name: doc.name,
    scope: doc.scope,
    industry: doc.industry,
    location: doc.location,
  };
}

/**
 * Normalizes a raw Payload Project document into CanonicalPortfolioEntry.
 * Guarantees zero vendor-specific types leak into frontend components.
 */
export function adaptPayloadProject(doc: PayloadProjectDocument): CanonicalPortfolioEntry {
  if (!doc.title || !doc.slug || !doc.category) {
    throw new Error(`Invalid Payload project document: Missing mandatory fields in ${doc.id}`);
  }

  const media = (doc.media || []).map(normalizePayloadMedia);
  const primaryMedia = media.find((m) => m.role === "primary" || m.role === "composite") || media[0];

  // Resolve client attribution from populated relationship or string
  let clientName: string | undefined;
  if (doc.client) {
    if (typeof doc.client === "object" && "name" in doc.client) {
      clientName = doc.client.name;
    } else if (typeof doc.client === "string") {
      clientName = doc.client;
    }
  }

  // Parse scope array of items
  const scope = doc.scope ? doc.scope.map((s) => s.item) : undefined;

  // Parse editorial rows if stringified JSON
  let editorialRows: number[][] | undefined;
  if (doc.framingConfig?.editorialRows) {
    if (typeof doc.framingConfig.editorialRows === "string") {
      try {
        editorialRows = JSON.parse(doc.framingConfig.editorialRows);
      } catch {
        editorialRows = undefined;
      }
    } else if (Array.isArray(doc.framingConfig.editorialRows)) {
      editorialRows = doc.framingConfig.editorialRows;
    }
  }

  const isPublished = doc._status ? doc._status === "published" : doc.published !== false;

  return {
    id: doc.slug, // Use stable canonical slug as id
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle,
    category: doc.category,
    categorySlug: doc.category,
    presentationType: doc.presentationType || "standalone",
    contentSubtype: doc.contentSubtype,
    client: clientName,
    clientDisplayName: doc.clientDisplayName || clientName,
    description: doc.description,
    scope,
    year: doc.year,
    media,
    // Compatibility accessors for rendering components:
    images: media,
    image: primaryMedia?.src || "",
    featured: Boolean(doc.featured),
    published: isPublished,
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
