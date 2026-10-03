import { adaptSupabaseProject, adaptSupabaseClient, adaptSupabaseProjects } from "../adapter";
import { CANONICAL_PORTFOLIO_ENTRIES } from "../../data";
import { computeFramingRows } from "../../framing";
import { DatabaseClientRow, DatabaseProjectMediaRow, SupabaseProjectDTO } from "../types";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ""}`);
    failedCount++;
  }
}

console.log("\n========================================================");
console.log(" CMS-13: SUPABASE DATA ADAPTER & PARITY TEST HARNESS");
console.log("========================================================\n");

// ── FIXTURES FOR JANUS BIFROUS & LOCALE BREWERY ──────────────────────
const mockClientRow: DatabaseClientRow = {
  id: "c0000000-0000-0000-0000-000000000001",
  slug: "locale-brewery",
  name: "Locale Brewery",
  scope: "Brand Development & Packaging",
  industry: "Brewery / Hospitality",
  location: "Bali, Indonesia",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const mockJanusMediaRows: DatabaseProjectMediaRow[] = [
  {
    id: "m0000000-0000-0000-0000-000000000001",
    project_id: "p0000000-0000-0000-0000-000000000001",
    src: "/images/projects/janus-bifrous/bottle-left.png",
    alt: "JANUS BIFROUS - Bottle Front View on Warm Beige",
    role: "primary",
    width: 714,
    height: 795,
    aspect_ratio: 714 / 795,
    orientation: "portrait",
    caption: null,
    display_order: 0,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "m0000000-0000-0000-0000-000000000002",
    project_id: "p0000000-0000-0000-0000-000000000001",
    src: "/images/projects/janus-bifrous/circle-detail.png",
    alt: "JANUS BIFROUS - Brand Identity Emblem & Geometric Detail",
    role: "detail",
    width: 595,
    height: 795,
    aspect_ratio: 595 / 795,
    orientation: "portrait",
    caption: "Bespoke heraldic badge and geometric embossing.",
    display_order: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "m0000000-0000-0000-0000-000000000003",
    project_id: "p0000000-0000-0000-0000-000000000001",
    src: "/images/projects/janus-bifrous/bottle-right.png",
    alt: "JANUS BIFROUS - Bottle Angled View on Obsidian Black",
    role: "supporting",
    width: 595,
    height: 795,
    aspect_ratio: 595 / 795,
    orientation: "portrait",
    caption: null,
    display_order: 2,
    created_at: "2024-01-01T00:00:00Z",
  },
];

const mockJanusDTO: SupabaseProjectDTO = {
  id: "p0000000-0000-0000-0000-000000000001",
  slug: "janus-bifrous",
  title: "JANUS BIFROUS",
  subtitle: "Artisan Beer",
  category: "product-design",
  presentation_type: "standalone",
  content_subtype: null,
  client_id: mockClientRow.id,
  client_display_name: null,
  description:
    "A dual-faced artisan beer packaging design exploring symmetry, mythology, and botanical textures. Built with tactile label materials and bespoke heraldic illustration.",
  scope: ["Label Design", "Illustration", "Print Production", "Brand Identity"],
  year: "2024",
  featured: true,
  status: "published",
  display_order: 1,
  framing_config: {
    layoutMode: "auto",
    gap: "md",
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
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  client: mockClientRow,
  media: mockJanusMediaRows,
};

// ── PART 1: JANUS CANONICAL SEMANTIC PARITY ──────────────────────────
console.log("► [Part 1] Janus Canonical Semantic Parity Test");
const canonicalJanus = CANONICAL_PORTFOLIO_ENTRIES.find((p) => p.slug === "janus-bifrous")!;
const adaptedJanus = adaptSupabaseProject(mockJanusDTO);

assert(adaptedJanus.id === canonicalJanus.id, "Identity matches ('janus-bifrous')");
assert(adaptedJanus.slug === canonicalJanus.slug, "Slug matches ('janus-bifrous')");
assert(adaptedJanus.title === canonicalJanus.title, "Title matches ('JANUS BIFROUS')");
assert(adaptedJanus.subtitle === canonicalJanus.subtitle, "Subtitle matches ('Artisan Beer')");
assert(adaptedJanus.category === canonicalJanus.category, "Category matches ('product-design')");
assert(adaptedJanus.presentationType === canonicalJanus.presentationType, "Presentation type matches ('standalone')");
assert(adaptedJanus.client === canonicalJanus.client, "Client attribution matches ('Locale Brewery')");
assert(adaptedJanus.year === canonicalJanus.year, "Year matches ('2024')");
assert(adaptedJanus.featured === canonicalJanus.featured, "Featured status matches (true)");
assert(adaptedJanus.published === canonicalJanus.published, "Published status matches (true)");
assert(adaptedJanus.order === canonicalJanus.order, "Order matches (1)");
assert(JSON.stringify(adaptedJanus.scope) === JSON.stringify(canonicalJanus.scope), "Scope array matches");

// Media verification
assert(adaptedJanus.media.length === canonicalJanus.media.length, "Media count matches (3 assets)");
adaptedJanus.media.forEach((m, idx) => {
  const c = canonicalJanus.media[idx];
  assert(m.src === c.src, `Media [${idx}] URL matches (${m.src})`);
  assert(m.alt === c.alt, `Media [${idx}] Alt text matches`);
  assert(m.role === c.role, `Media [${idx}] Role matches (${m.role})`);
  assert(m.width === c.width, `Media [${idx}] Width matches (${m.width})`);
  assert(m.height === c.height, `Media [${idx}] Height matches (${m.height})`);
  assert(Math.abs((m.aspectRatio || 0) - (c.aspectRatio || 0)) < 0.001, `Media [${idx}] Aspect ratio matches`);
  assert(m.orientation === c.orientation, `Media [${idx}] Orientation matches (${m.orientation})`);
});

// Framing config verification
assert(adaptedJanus.framingConfig?.layoutMode === canonicalJanus.framingConfig?.layoutMode, "Framing layoutMode matches ('auto')");
assert(adaptedJanus.framingConfig?.gap === canonicalJanus.framingConfig?.gap, "Framing gap matches ('md')");
assert(adaptedJanus.framingConfig?.mobileStack === canonicalJanus.framingConfig?.mobileStack, "Framing mobileStack matches (true)");

// ── PART 2: FRAMING ENGINE INTEROPERABILITY ──────────────────────────
console.log("\n► [Part 2] Framing Engine Interoperability");
const framingRows = computeFramingRows(adaptedJanus.media, adaptedJanus.framingConfig);
assert(framingRows.length > 0, "Framing engine computed rows for adapted Supabase project");
assert(framingRows[0].images.length > 0, "First framing row contains valid image items");
assert(framingRows[0].images[0].src === canonicalJanus.media[0].src, "Framing row preserves primary asset source");

// ── PART 3: CLIENT ADAPTATION & OVERRIDES ───────────────────────────
console.log("\n► [Part 3] Client Adaptation & Override Tests");
const adaptedClient = adaptSupabaseClient(mockClientRow);
assert(adaptedClient.id === "locale-brewery", "Client slug mapped to ID");
assert(adaptedClient.name === "Locale Brewery", "Client name matches");
assert(adaptedClient.industry === "Brewery / Hospitality", "Client industry matches");

const overrideDTO: SupabaseProjectDTO = {
  ...mockJanusDTO,
  client_display_name: "Locale Brewery International",
};
const adaptedOverride = adaptSupabaseProject(overrideDTO);
assert(adaptedOverride.clientDisplayName === "Locale Brewery International", "Client display name override preserved");

// ── PART 4: DRAFT ISOLATION ──────────────────────────────────────────
console.log("\n► [Part 4] Draft vs Published Isolation");
const draftDTO: SupabaseProjectDTO = {
  ...mockJanusDTO,
  status: "draft",
};
const adaptedDraft = adaptSupabaseProject(draftDTO);
assert(adaptedDraft.published === false, "Draft project maps to published: false");

const publishedDTO: SupabaseProjectDTO = {
  ...mockJanusDTO,
  status: "published",
};
const adaptedPublished = adaptSupabaseProject(publishedDTO);
assert(adaptedPublished.published === true, "Published project maps to published: true");

// ── PART 5: ERROR HANDLING & CONTRACT VALIDATION ─────────────────────
console.log("\n► [Part 5] Error Handling & Edge Cases");

// Missing slug
{
  let errorCaught = false;
  try {
    const invalidDTO = { ...mockJanusDTO, slug: "" };
    adaptSupabaseProject(invalidDTO as unknown as SupabaseProjectDTO);
  } catch {
    errorCaught = true;
  }
  assert(errorCaught, "Missing slug throws error");
}

// Missing title
{
  let errorCaught = false;
  try {
    const invalidDTO = { ...mockJanusDTO, title: "" };
    adaptSupabaseProject(invalidDTO as unknown as SupabaseProjectDTO);
  } catch {
    errorCaught = true;
  }
  assert(errorCaught, "Missing title throws error");
}

// Array adaptation
{
  const list = adaptSupabaseProjects([mockJanusDTO, overrideDTO]);
  assert(list.length === 2, "adaptSupabaseProjects converts multiple project DTOs");
  assert(list[0].slug === "janus-bifrous" && list[1].slug === "janus-bifrous", "List preserves individual project properties");
}

console.log("\n========================================================");
console.log(` SUMMARY: ${passedCount} passed, ${failedCount} failed`);
console.log("========================================================\n");

if (failedCount > 0) {
  process.exit(1);
}
