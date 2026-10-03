/**
 * Payload CMS 3.x Raw Data Types (Vendor-Specific API Contract)
 * Represents the raw JSON returned from Payload Local API or REST endpoints.
 */

export interface PayloadMediaUpload {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadProjectMediaItem {
  id?: string;
  asset: PayloadMediaUpload | string; // Populated or ID reference
  alt: string;
  role: "primary" | "detail" | "supporting" | "composite";
  caption?: string;
}

export interface PayloadClientDocument {
  id: string;
  name: string;
  scope: string;
  industry: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadFramingConfig {
  layoutMode?: "auto" | "editorial";
  editorialRows?: string; // JSON string or array
  gap?: "none" | "hairline" | "sm" | "md";
  mobileStack?: boolean;
}

export interface PayloadProvenance {
  sourceDocument?: string;
  sourcePage?: number;
  sourceCategory?: string;
  sourceTitle?: string;
  sourceSubtitle?: string;
  sourceClient?: string;
}

export interface PayloadProjectDocument {
  id: string;
  title: string;
  slug: string;
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
  client?: PayloadClientDocument | string; // Populated or ID
  clientDisplayName?: string;
  description?: string;
  scope?: { id?: string; item: string }[];
  year?: string;
  media: PayloadProjectMediaItem[];
  featured?: boolean;
  _status?: "draft" | "published";
  published?: boolean;
  order?: number;
  framingConfig?: PayloadFramingConfig;
  provenance?: PayloadProvenance;
  createdAt: string;
  updatedAt: string;
}
