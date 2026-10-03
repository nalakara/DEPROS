import { PayloadProjectDocument, PayloadClientDocument, PayloadMediaUpload } from "./types";

export const mockPayloadClient: PayloadClientDocument = {
  id: "client-locale-brewery",
  name: "Locale Brewery",
  scope: "Brand Development & Packaging",
  industry: "Brewery / Hospitality",
  location: "Bali, Indonesia",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
};

export const mockPayloadMedia1: PayloadMediaUpload = {
  id: "media-upload-01",
  url: "/images/projects/janus-bifrous/bottle-left.png",
  filename: "bottle-left.png",
  mimeType: "image/png",
  filesize: 842100,
  width: 714,
  height: 795,
  createdAt: "2026-10-01T10:05:00.000Z",
  updatedAt: "2026-10-01T10:05:00.000Z",
};

export const mockPayloadMedia2: PayloadMediaUpload = {
  id: "media-upload-02",
  url: "/images/projects/janus-bifrous/circle-detail.png",
  filename: "circle-detail.png",
  mimeType: "image/png",
  filesize: 654200,
  width: 595,
  height: 795,
  createdAt: "2026-10-01T10:06:00.000Z",
  updatedAt: "2026-10-01T10:06:00.000Z",
};

export const mockPayloadMedia3: PayloadMediaUpload = {
  id: "media-upload-03",
  url: "/images/projects/janus-bifrous/bottle-right.png",
  filename: "bottle-right.png",
  mimeType: "image/png",
  filesize: 712900,
  width: 595,
  height: 795,
  createdAt: "2026-10-01T10:07:00.000Z",
  updatedAt: "2026-10-01T10:07:00.000Z",
};

export const mockPayloadJanusPublished: PayloadProjectDocument = {
  id: "6701a2b3c4d5e6f7a8b9c0d1",
  title: "JANUS BIFROUS",
  slug: "janus-bifrous",
  subtitle: "Artisan Beer",
  category: "product-design",
  presentationType: "standalone",
  client: mockPayloadClient,
  clientDisplayName: "Locale Brewery",
  description:
    "A dual-faced artisan beer packaging design exploring symmetry, mythology, and botanical textures. Built with tactile label materials and bespoke heraldic illustration.",
  scope: [
    { id: "s1", item: "Label Design" },
    { id: "s2", item: "Illustration" },
    { id: "s3", item: "Print Production" },
    { id: "s4", item: "Brand Identity" },
  ],
  year: "2024",
  featured: true,
  published: true,
  _status: "published",
  order: 1,
  media: [
    {
      id: "pm-01",
      asset: mockPayloadMedia1,
      alt: "JANUS BIFROUS - Bottle Front View on Warm Beige",
      role: "primary",
    },
    {
      id: "pm-02",
      asset: mockPayloadMedia2,
      alt: "JANUS BIFROUS - Brand Identity Emblem & Geometric Detail",
      role: "detail",
      caption: "Bespoke heraldic badge and geometric embossing.",
    },
    {
      id: "pm-03",
      asset: mockPayloadMedia3,
      alt: "JANUS BIFROUS - Bottle Angled View on Obsidian Black",
      role: "supporting",
    },
  ],
  framingConfig: {
    layoutMode: "editorial",
    editorialRows: "[[0], [1, 2]]",
    gap: "hairline",
    mobileStack: true,
  },
  provenance: {
    sourceDocument: "PF DEPROS 2026_B.pdf",
    sourcePage: 5,
    sourceCategory: "01 / DEP ROS PRODUCT DESIGN",
    sourceTitle: "JANUS BIFROUS",
    sourceSubtitle: "Artisan Beer",
    sourceClient: "Locale Brewery",
  },
  createdAt: "2026-10-01T10:10:00.000Z",
  updatedAt: "2026-10-02T15:00:00.000Z",
};

export const mockPayloadDraftProject: PayloadProjectDocument = {
  id: "6701a2b3c4d5e6f7a8b9c0d2",
  title: "SEASONAL HARVEST CIDER",
  slug: "seasonal-harvest-cider",
  subtitle: "Cider Series",
  category: "product-design",
  presentationType: "standalone",
  featured: false,
  published: false,
  _status: "draft",
  order: 99,
  media: [
    {
      id: "pm-draft-01",
      asset: mockPayloadMedia1,
      alt: "Work in progress draft cider render",
      role: "primary",
    },
  ],
  createdAt: "2026-10-02T16:00:00.000Z",
  updatedAt: "2026-10-02T16:00:00.000Z",
};
