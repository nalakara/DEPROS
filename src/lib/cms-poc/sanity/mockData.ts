import { SanityProjectDocument, SanityClientDocument } from "./types";

export const mockSanityClient: SanityClientDocument = {
  _id: "client-locale-brewery",
  _type: "client",
  name: "Locale Brewery",
  scope: "Brand Development & Packaging",
  industry: "Brewery / Hospitality",
  location: "Bali, Indonesia",
};

export const mockSanityJanusPublished: SanityProjectDocument = {
  _id: "project-janus-bifrous",
  _type: "project",
  _createdAt: "2026-10-01T10:00:00Z",
  _updatedAt: "2026-10-02T14:30:00Z",
  title: "JANUS BIFROUS",
  slug: {
    _type: "slug",
    current: "janus-bifrous",
  },
  subtitle: "Artisan Beer",
  category: "product-design",
  presentationType: "standalone",
  client: mockSanityClient,
  clientDisplayName: "Locale Brewery",
  description:
    "A dual-faced artisan beer packaging design exploring symmetry, mythology, and botanical textures. Built with tactile label materials and bespoke heraldic illustration.",
  scope: ["Label Design", "Illustration", "Print Production", "Brand Identity"],
  year: "2024",
  featured: true,
  published: true,
  order: 1,
  media: [
    {
      _key: "media-01",
      alt: "JANUS BIFROUS - Bottle Front View on Warm Beige",
      role: "primary",
      asset: {
        _id: "image-asset-01",
        url: "/images/projects/janus-bifrous/bottle-left.png",
        mimeType: "image/png",
        metadata: {
          dimensions: {
            width: 714,
            height: 795,
            aspectRatio: 714 / 795,
          },
          lqip: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA...",
        },
      },
    },
    {
      _key: "media-02",
      alt: "JANUS BIFROUS - Brand Identity Emblem & Geometric Detail",
      role: "detail",
      caption: "Bespoke heraldic badge and geometric embossing.",
      asset: {
        _id: "image-asset-02",
        url: "/images/projects/janus-bifrous/circle-detail.png",
        mimeType: "image/png",
        metadata: {
          dimensions: {
            width: 595,
            height: 795,
            aspectRatio: 595 / 795,
          },
        },
      },
    },
    {
      _key: "media-03",
      alt: "JANUS BIFROUS - Bottle Angled View on Obsidian Black",
      role: "supporting",
      asset: {
        _id: "image-asset-03",
        url: "/images/projects/janus-bifrous/bottle-right.png",
        mimeType: "image/png",
        metadata: {
          dimensions: {
            width: 595,
            height: 795,
            aspectRatio: 595 / 795,
          },
        },
      },
    },
  ],
  framingConfig: {
    layoutMode: "editorial",
    editorialRows: [[0], [1, 2]],
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
};

export const mockSanityDraftProject: SanityProjectDocument = {
  _id: "drafts.project-seasonal-cider",
  _type: "project",
  title: "SEASONAL HARVEST CIDER",
  slug: {
    _type: "slug",
    current: "seasonal-harvest-cider",
  },
  subtitle: "Cider Series",
  category: "product-design",
  presentationType: "standalone",
  featured: false,
  published: false,
  order: 99,
  media: [
    {
      _key: "media-draft-01",
      alt: "Work in progress draft cider render",
      role: "primary",
      asset: {
        _id: "image-draft-01",
        url: "/images/projects/janus-bifrous/bottle-left.png",
        mimeType: "image/png",
        metadata: {
          dimensions: {
            width: 714,
            height: 795,
            aspectRatio: 714 / 795,
          },
        },
      },
    },
  ],
};
