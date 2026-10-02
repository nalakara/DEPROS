export type SemanticCategoryId =
  | "product-design"
  | "brand-identity"
  | "logos"
  | "corporate-identity"
  | "marketing-kit"
  | "graphic-visual"
  | "social-media-content";

export type ContentSubtype = "marketing-kit" | "sales-tools";

export type PresentationType = "standalone" | "grouped";

export type MediaRole = "primary" | "detail" | "supporting" | "composite";

export type MediaOrientation = "portrait" | "landscape" | "square" | "panoramic";

export interface CanonicalMediaItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  orientation?: MediaOrientation;
  role?: MediaRole;
  caption?: string;
}

export type ImageOrientation = MediaOrientation;
export type ProjectImage = CanonicalMediaItem;

export type FramingLayoutMode = "auto" | "editorial";

export interface FramingConfig {
  layoutMode?: FramingLayoutMode;
  mode?: "auto" | "editorial";
  editorialRows?: number[][]; // Array of image index groups per row, e.g. [[0], [1, 2]]
  gap?: "none" | "hairline" | "sm" | "md";
  aspectRatio?: string;
  mobileStack?: boolean;
}

export interface SourceProvenance {
  sourceDocument?: string;
  sourcePage?: number;
  sourceCategory?: string;
  sourceTitle?: string;
  sourceSubtitle?: string;
  sourceClient?: string;
}

export interface CanonicalPortfolioEntry {
  id: string;
  slug: string;
  title: string;
  category: SemanticCategoryId;
  presentationType: PresentationType;
  contentSubtype?: ContentSubtype;
  client?: string;
  clientDisplayName?: string;
  subtitle?: string;
  description?: string;
  scope?: string[];
  year?: string;
  media: CanonicalMediaItem[];
  // Compatibility accessors for existing rendering components:
  images?: CanonicalMediaItem[];
  image: string;
  number?: string;
  categorySlug?: string;
  featured?: boolean;
  published?: boolean;
  order?: number;
  framingConfig?: FramingConfig;
  provenance?: SourceProvenance;
}

export type Project = CanonicalPortfolioEntry;
export type ProjectCategory = SemanticCategoryId | string;

export interface ClientItem {
  id: string;
  name: string;
  scope: string;
  industry: string;
  location: string;
}

