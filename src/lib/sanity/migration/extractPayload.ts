import { CANONICAL_PORTFOLIO_ENTRIES, NOTABLE_CLIENTS } from "@/lib/data";
import { CanonicalPortfolioEntry, ClientItem } from "@/lib/types";
import { SanityProjectDocument, SanityClientDocument, SanityMediaItem } from "../types";

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Builds the complete unified list of unique Client entities.
 * Combines NOTABLE_CLIENTS (12) with any additional clients referenced by projects.
 */
export function extractUniqueClients(): SanityClientDocument[] {
  const clientMap = new Map<string, SanityClientDocument>();

  // 1. Ingest notable clients
  NOTABLE_CLIENTS.forEach((c) => {
    const slug = slugify(c.name);
    const docId = `client-${slug}`;
    clientMap.set(c.name.toLowerCase(), {
      _id: docId,
      _type: "client",
      name: c.name,
      scope: c.scope,
      industry: c.industry,
      location: c.location,
    });
  });

  // 2. Ingest project-referenced clients
  const projectClientDefaults: Record<string, { scope: string; industry: string; location: string }> = {
    "locale brewery": {
      scope: "Brand Development & Packaging",
      industry: "Brewery / Hospitality",
      location: "Bali, Indonesia",
    },
    "gumindo bogamanis": {
      scope: "Packaging Design",
      industry: "Food & Beverage",
      location: "Indonesia",
    },
    "arin": {
      scope: "Liqueur Label & Packaging",
      industry: "Distillery",
      location: "Bali, Indonesia",
    },
    "kapal api": {
      scope: "Brand Identity",
      industry: "Beverage / FMCG",
      location: "Indonesia",
    },
    "whysuper / millimeter": {
      scope: "Corporate Identity & Branding",
      industry: "Creative Studio",
      location: "Indonesia",
    },
    "eco mailing": {
      scope: "Digital Marketing Kit",
      industry: "Eco Packaging",
      location: "Indonesia",
    },
    "suit solution group": {
      scope: "Sales Tools & Presentation System",
      industry: "Apparel & B2B Solutions",
      location: "Indonesia",
    },
    "kopi tungku": {
      scope: "Social Media Story Content",
      industry: "Coffee / F&B",
      location: "Bali, Indonesia",
    },
  };

  CANONICAL_PORTFOLIO_ENTRIES.forEach((p) => {
    if (p.client) {
      const key = p.client.toLowerCase();
      if (!clientMap.has(key)) {
        const slug = slugify(p.client);
        const defaults = projectClientDefaults[key] || {
          scope: "Design & Identity",
          industry: "General Industry",
          location: "Indonesia",
        };
        clientMap.set(key, {
          _id: `client-${slug}`,
          _type: "client",
          name: p.client,
          scope: defaults.scope,
          industry: defaults.industry,
          location: defaults.location,
        });
      }
    }
  });

  return Array.from(clientMap.values());
}

/**
 * Transforms a CanonicalPortfolioEntry into a deterministic SanityProjectDocument.
 */
export function mapCanonicalToSanityProject(
  entry: CanonicalPortfolioEntry,
  clientDocs: SanityClientDocument[]
): SanityProjectDocument {
  let clientRef: SanityClientDocument | undefined;
  if (entry.client) {
    const key = entry.client.toLowerCase();
    clientRef = clientDocs.find((c) => c.name.toLowerCase() === key);
  }

  const media: SanityMediaItem[] = entry.media.map((m, idx) => ({
    _key: `asset-${idx + 1}-${slugify(m.alt.slice(0, 30))}`,
    alt: m.alt,
    role: m.role || "primary",
    caption: m.caption,
    orientation: m.orientation,
    asset: {
      _id: `image-asset-${entry.slug}-${idx + 1}`,
      url: m.src,
      mimeType: "image/png",
      metadata: {
        dimensions: {
          width: m.width || 1200,
          height: m.height || 800,
          aspectRatio: m.aspectRatio || (m.width && m.height ? m.width / m.height : 1.5),
        },
      },
    },
  }));

  return {
    _id: `project-${entry.slug}`,
    _type: "project",
    _createdAt: "2026-10-01T12:00:00Z",
    _updatedAt: "2026-10-02T12:00:00Z",
    id: entry.id,
    title: entry.title,
    slug: {
      _type: "slug",
      current: entry.slug,
    },
    subtitle: entry.subtitle,
    category: entry.category,
    presentationType: entry.presentationType,
    contentSubtype: entry.contentSubtype,
    client: clientRef,
    clientDisplayName: entry.clientDisplayName,
    description: entry.description,
    scope: entry.scope,
    year: entry.year,
    media,
    featured: entry.featured,
    published: entry.published,
    order: entry.order,
    framingConfig: entry.framingConfig
      ? {
          layoutMode: entry.framingConfig.layoutMode || "auto",
          editorialRows: entry.framingConfig.editorialRows,
          gap: entry.framingConfig.gap || "hairline",
          mobileStack: entry.framingConfig.mobileStack !== false,
        }
      : undefined,
    provenance: entry.provenance,
  };
}

export interface MigrationPayload {
  clients: SanityClientDocument[];
  projects: SanityProjectDocument[];
  totalMediaAssets: number;
}

/**
 * Extracts and prepares the complete migration payload for all 16 canonical projects
 * and all unique client entities.
 */
export function buildMigrationPayload(): MigrationPayload {
  const clients = extractUniqueClients();
  const projects = CANONICAL_PORTFOLIO_ENTRIES.map((p) =>
    mapCanonicalToSanityProject(p, clients)
  );

  const totalMediaAssets = projects.reduce(
    (acc, p) => acc + (p.media?.length || 0),
    0
  );

  return {
    clients,
    projects,
    totalMediaAssets,
  };
}
