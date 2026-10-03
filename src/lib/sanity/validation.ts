import { SemanticCategoryId, PresentationType, ContentSubtype, MediaRole } from "@/lib/types";
import { SanityProjectDocument, SanityMediaItem, SanityClientDocument } from "./types";

const VALID_CATEGORIES: ReadonlySet<string> = new Set<SemanticCategoryId>([
  "product-design",
  "brand-identity",
  "logos",
  "corporate-identity",
  "marketing-kit",
  "graphic-visual",
  "social-media-content",
]);

const VALID_PRESENTATION_TYPES: ReadonlySet<string> = new Set<PresentationType>([
  "standalone",
  "grouped",
]);

const VALID_CONTENT_SUBTYPES: ReadonlySet<string> = new Set<ContentSubtype>([
  "marketing-kit",
  "sales-tools",
]);

const VALID_MEDIA_ROLES: ReadonlySet<string> = new Set<MediaRole>([
  "primary",
  "detail",
  "supporting",
  "composite",
]);

/**
 * Custom error class for Sanity document validation failures.
 */
export class SanityValidationError extends Error {
  readonly documentId: string;
  readonly fieldPath: string;

  constructor(documentId: string, fieldPath: string, message: string) {
    super(`[SanityValidationError] Document "${documentId}" at field "${fieldPath}": ${message}`);
    this.name = "SanityValidationError";
    this.documentId = documentId;
    this.fieldPath = fieldPath;
  }
}

/**
 * Validates a single media item against canonical visual requirements.
 */
export function validateSanityMedia(
  item: unknown,
  docId: string,
  index: number
): asserts item is SanityMediaItem {
  const prefix = `media[${index}]`;

  if (!item || typeof item !== "object") {
    throw new SanityValidationError(docId, prefix, "Media item must be a non-null object.");
  }

  const media = item as Record<string, unknown>;

  if (!media.alt || typeof media.alt !== "string" || media.alt.trim() === "") {
    throw new SanityValidationError(docId, `${prefix}.alt`, "Media item requires a non-empty alt text string.");
  }

  if (!media.role || typeof media.role !== "string" || !VALID_MEDIA_ROLES.has(media.role)) {
    throw new SanityValidationError(
      docId,
      `${prefix}.role`,
      `Invalid media role "${String(media.role)}". Expected one of: ${Array.from(VALID_MEDIA_ROLES).join(", ")}`
    );
  }

  if (!media.asset || typeof media.asset !== "object") {
    throw new SanityValidationError(docId, `${prefix}.asset`, "Media item is missing image asset reference.");
  }

  const asset = media.asset as Record<string, unknown>;

  if (!asset.url || typeof asset.url !== "string" || asset.url.trim() === "") {
    throw new SanityValidationError(docId, `${prefix}.asset.url`, "Media asset is missing a valid URL string.");
  }

  const metadata = asset.metadata as Record<string, unknown> | undefined;
  const dimensions = metadata?.dimensions as Record<string, unknown> | undefined;

  if (
    !dimensions ||
    typeof dimensions.width !== "number" ||
    dimensions.width <= 0 ||
    typeof dimensions.height !== "number" ||
    dimensions.height <= 0
  ) {
    throw new SanityValidationError(
      docId,
      `${prefix}.asset.metadata.dimensions`,
      "Media asset is missing valid intrinsic dimensions (positive width and height required for zero CLS)."
    );
  }
}

/**
 * Validates a raw Sanity Client document.
 */
export function validateSanityClient(doc: unknown): asserts doc is SanityClientDocument {
  if (!doc || typeof doc !== "object") {
    throw new SanityValidationError("unknown", "client", "Client document must be a non-null object.");
  }

  const client = doc as Record<string, unknown>;
  const id = String(client._id || "unknown");

  if (!client.name || typeof client.name !== "string" || client.name.trim() === "") {
    throw new SanityValidationError(id, "name", "Client requires a non-empty name string.");
  }
}

/**
 * Validates a raw Sanity Project document against the canonical portfolio schema contract.
 */
export function validateSanityProject(doc: unknown): asserts doc is SanityProjectDocument {
  if (!doc || typeof doc !== "object") {
    throw new SanityValidationError("unknown", "project", "Project document must be a non-null object.");
  }

  const project = doc as Record<string, unknown>;
  const docId = String(project._id || "unknown");

  // Title validation
  if (!project.title || typeof project.title !== "string" || project.title.trim() === "") {
    throw new SanityValidationError(docId, "title", "Project requires a non-empty title string.");
  }

  // Slug validation
  const slugObj = project.slug as Record<string, unknown> | undefined;
  if (!slugObj || typeof slugObj.current !== "string" || slugObj.current.trim() === "") {
    throw new SanityValidationError(docId, "slug.current", "Project requires a non-empty URL slug.");
  }

  // Category validation
  if (
    !project.category ||
    typeof project.category !== "string" ||
    !VALID_CATEGORIES.has(project.category)
  ) {
    throw new SanityValidationError(
      docId,
      "category",
      `Invalid category "${String(project.category)}". Expected one of: ${Array.from(VALID_CATEGORIES).join(", ")}`
    );
  }

  // PresentationType validation
  if (
    project.presentationType &&
    (typeof project.presentationType !== "string" || !VALID_PRESENTATION_TYPES.has(project.presentationType))
  ) {
    throw new SanityValidationError(
      docId,
      "presentationType",
      `Invalid presentationType "${String(project.presentationType)}". Expected "standalone" or "grouped".`
    );
  }

  // ContentSubtype validation
  if (
    project.contentSubtype &&
    (typeof project.contentSubtype !== "string" || !VALID_CONTENT_SUBTYPES.has(project.contentSubtype))
  ) {
    throw new SanityValidationError(
      docId,
      "contentSubtype",
      `Invalid contentSubtype "${String(project.contentSubtype)}". Expected "marketing-kit" or "sales-tools".`
    );
  }

  // Media collection validation
  if (!Array.isArray(project.media) || project.media.length === 0) {
    throw new SanityValidationError(docId, "media", "Project requires an array of at least 1 media item.");
  }

  project.media.forEach((item, index) => {
    validateSanityMedia(item, docId, index);
  });
}
