/**
 * Sanity Raw Data Types (Vendor-Specific API Contract)
 * Represents the raw JSON returned from Sanity Content Lake via GROQ.
 */

export interface SanityAssetMetadataDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  mimeType: string;
  metadata: {
    dimensions: SanityAssetMetadataDimensions;
    lqip?: string;
  };
}

export interface SanityMediaItem {
  _key: string;
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
  editorialRows?: number[][];
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
  slug: {
    _type: "slug";
    current: string;
  };
  title: string;
  subtitle?: string;
  category:
    | "product-design"
    | "brand-identity"
    | "logos"
    | "corporate-identity"
    | "marketing-kit"
    | "graphic-visual"
    | "social-media-content";
  presentationType: "standalone" | "grouped";
  contentSubtype?: "marketing-kit" | "sales-tools";
  client?: SanityClientDocument | { _ref: string }; // Expanded or raw reference
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
