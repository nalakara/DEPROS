import {
  CanonicalPortfolioEntry,
  CanonicalMediaItem,
  ClientItem,
  SemanticCategoryId,
  FramingConfig,
} from "@/lib/types";
import {
  DatabaseClientRow,
  DatabaseProjectMediaRow,
  SupabaseProjectDTO,
} from "./types";

/**
 * Normalizes a raw Supabase project_media row into CanonicalMediaItem.
 * Ensures zero Cumulative Layout Shift (CLS) by preserving intrinsic dimensions.
 */
export function adaptSupabaseMedia(
  row: DatabaseProjectMediaRow
): CanonicalMediaItem {
  if (!row.src) {
    throw new Error("Cannot normalize media item: missing 'src' URL.");
  }

  const width = Number(row.width);
  const height = Number(row.height);

  if (!width || !height || isNaN(width) || isNaN(height)) {
    throw new Error(
      `Cannot normalize media item (${row.src}): missing valid intrinsic width or height.`
    );
  }

  const aspectRatio =
    typeof row.aspect_ratio === "number"
      ? row.aspect_ratio
      : Number(row.aspect_ratio) || width / height;

  let orientation = row.orientation;
  if (!orientation) {
    if (aspectRatio > 2.0) {
      orientation = "panoramic";
    } else if (aspectRatio >= 1.05) {
      orientation = "landscape";
    } else if (aspectRatio <= 0.95) {
      orientation = "portrait";
    } else {
      orientation = "square";
    }
  }

  return {
    src: row.src,
    alt: row.alt || "",
    width,
    height,
    aspectRatio: Number(aspectRatio.toFixed(3)),
    orientation,
    role: row.role || "primary",
    caption: row.caption || undefined,
  };
}

/**
 * Adapts a raw Supabase clients row into canonical ClientItem.
 */
export function adaptSupabaseClient(row: DatabaseClientRow): ClientItem {
  return {
    id: row.slug || row.id,
    name: row.name,
    scope: row.scope || "",
    industry: row.industry || "",
    location: row.location || "",
  };
}

/**
 * Adapts a SupabaseProjectDTO (with joined media and client) into CanonicalPortfolioEntry.
 *
 * Guarantees that:
 * 1. Output adheres strictly to the canonical contract.
 * 2. Media items are sorted by display_order.
 * 3. Client references and editorial overrides are properly resolved.
 * 4. Framing configurations are cleanly parsed and preserved.
 * 5. Backwards-compatible fields (images, image, categorySlug, order, published) are present.
 */
export function adaptSupabaseProject(
  dto: SupabaseProjectDTO
): CanonicalPortfolioEntry {
  if (!dto.slug) {
    throw new Error(`Invalid project: missing slug for project ID ${dto.id}`);
  }
  if (!dto.title) {
    throw new Error(`Invalid project: missing title for project ${dto.slug}`);
  }

  // Sort and normalize media assets
  const rawMedia = Array.isArray(dto.media) ? [...dto.media] : [];
  rawMedia.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const media: CanonicalMediaItem[] = rawMedia.map(adaptSupabaseMedia);

  const primaryMedia =
    media.find((m) => m.role === "primary" || m.role === "composite") ||
    media[0];

  // Resolve client name
  const clientName = dto.client?.name || undefined;

  // Normalize framing configuration
  let framingConfig: FramingConfig | undefined;
  if (dto.framing_config) {
    const raw = dto.framing_config;
    const layoutMode = raw.layoutMode || raw.mode || "auto";
    framingConfig = {
      layoutMode,
      mode: layoutMode,
      editorialRows: Array.isArray(raw.editorialRows)
        ? raw.editorialRows
        : undefined,
      gap: raw.gap || "hairline",
      mobileStack: raw.mobileStack !== false,
      aspectRatio: raw.aspectRatio,
    };
  }

  return {
    id: dto.slug, // Canonical ID matches slug in portfolio
    slug: dto.slug,
    title: dto.title,
    subtitle: dto.subtitle || undefined,
    category: dto.category as SemanticCategoryId,
    categorySlug: dto.category,
    presentationType: dto.presentation_type || "standalone",
    contentSubtype: dto.content_subtype || undefined,
    client: clientName,
    clientDisplayName: dto.client_display_name || undefined,
    description: dto.description || undefined,
    scope: Array.isArray(dto.scope) ? dto.scope : undefined,
    year: dto.year || undefined,
    media,
    // Compatibility accessors for existing rendering components:
    images: media,
    image: primaryMedia?.src || "",
    featured: Boolean(dto.featured),
    published: dto.status === "published",
    order: dto.display_order,
    framingConfig,
    provenance: dto.provenance || undefined,
  };
}

/**
 * Normalizes an array of Supabase project DTOs into CanonicalPortfolioEntry[].
 */
export function adaptSupabaseProjects(
  dtos: SupabaseProjectDTO[]
): CanonicalPortfolioEntry[] {
  return dtos.map(adaptSupabaseProject);
}
