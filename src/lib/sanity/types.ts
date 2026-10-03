/**
 * Sanity Raw Document & GROQ Response Types
 * 
 * Represents the raw vendor contract returned from Sanity Content Lake via GROQ.
 * These types are strictly internal to the Sanity adapter boundary and MUST NEVER
 * leak into DEPROS frontend presentation components.
 */

export interface SanityAssetMetadataDimensions {
  width: number;
  height: number;
  aspectRatio?: number;
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  mimeType?: string;
  metadata?: {
    dimensions?: SanityAssetMetadataDimensions;
    lqip?: string;
  };
}

export interface SanityMediaItem {
  _key?: string;
  alt: string;
  role: "primary" | "detail" | "supporting" | "composite";
  caption?: string;
  asset: SanityImageAsset;
}

export interface SanityClientDocument {
  _id: string;
  _type: "client";
  name: string;
  scope: string;
  industry: string;
  location: string;
}

export interface SanityFramingConfig {
  layoutMode?: "auto" | "editorial";
  editorialRows?: number[][] | string;
  gap?: "none" | "hairline" | "sm" | "md";
  mobileStack?: boolean;
}

export interface SanityProvenance {
  sourceDocument?: string;
  sourcePage?: number;
  sourceCategory?: string;
  sourceTitle?: string;
  sourceSubtitle?: string;
  sourceClient?: string;
}

export interface SanityProjectDocument {
  _id: string;
  _type: "project";
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
  id?: string; // Canonical explicit ID if populated
  slug: {
    _type?: "slug";
    current: string;
  };
  title: string;
  subtitle?: string;
  category: string;
  presentationType: "standalone" | "grouped";
  contentSubtype?: "marketing-kit" | "sales-tools";
  client?: SanityClientDocument | { _ref: string; [key: string]: unknown };
  clientDisplayName?: string;
  description?: string;
  scope?: string[];
  year?: string;
  media: SanityMediaItem[];
  featured?: boolean;
  published?: boolean;
  order?: number;
  framingConfig?: SanityFramingConfig;
  provenance?: SanityProvenance;
}
