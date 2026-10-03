import { readFileSync } from "fs";
import { join } from "path";
import { adaptSanityProject, adaptSanityClient } from "../adapter";
import { computeFramingRows } from "../../framing";
import { CanonicalPortfolioEntry } from "@/lib/types";
import { SanityProjectDocument, SanityClientDocument } from "../types";

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

console.log("\n====================================================================");
console.log(" CMS-08: JANUS BIFROUS PILOT MIGRATION & END-TO-END PARITY TEST");
console.log("====================================================================\n");

// 1. Load Pre-Migration Canonical Snapshot
const snapshotPath = join(__dirname, "snapshots", "canonical-janus-before.json");
const canonicalBefore: CanonicalPortfolioEntry = JSON.parse(readFileSync(snapshotPath, "utf-8"));
console.log("► [Step 1] Loaded Pre-Migration Canonical Snapshot from:", snapshotPath);

// 2. Define Migrated Sanity Client Document (Locale Brewery)
const sanityClientDoc: SanityClientDocument = {
  _id: "client-locale-brewery",
  _type: "client",
  name: "Locale Brewery",
  scope: "Brand Development & Packaging",
  industry: "Brewery / Hospitality",
  location: "Bali, Indonesia",
};

// 3. Define Migrated Sanity Project Document (Janus Bifrous)
const sanityJanusDoc: SanityProjectDocument = {
  _id: "project-janus-bifrous",
  _type: "project",
  _createdAt: "2026-10-01T10:00:00Z",
  _updatedAt: "2026-10-02T14:30:00Z",
  id: "janus-bifrous",
  title: "JANUS BIFROUS",
  slug: {
    _type: "slug",
    current: "janus-bifrous",
  },
  subtitle: "Artisan Beer",
  category: "product-design",
  presentationType: "standalone",
  client: sanityClientDoc, // Expanded client reference via GROQ projection
  description:
    "A dual-faced artisan beer packaging design exploring symmetry, mythology, and botanical textures. Built with tactile label materials and bespoke heraldic illustration.",
  scope: ["Label Design", "Illustration", "Print Production", "Brand Identity"],
  year: "2024",
  featured: true,
  published: true,
  order: 1,
  media: [
    {
      _key: "asset-01-bottle-left",
      alt: "JANUS BIFROUS - Bottle Front View on Warm Beige",
      role: "primary",
      asset: {
        _id: "image-asset-janus-01",
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
    {
      _key: "asset-02-circle-detail",
      alt: "JANUS BIFROUS - Brand Identity Emblem & Geometric Detail",
      role: "detail",
      asset: {
        _id: "image-asset-janus-02",
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
      _key: "asset-03-bottle-right",
      alt: "JANUS BIFROUS - Bottle Angled View on Obsidian Black",
      role: "supporting",
      asset: {
        _id: "image-asset-janus-03",
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
};

// 4. Adapt Migrated Document Through Production Adapter
console.log("► [Step 2] Passing Migrated Sanity Document through Production Adapter");
const canonicalAfter = adaptSanityProject(sanityJanusDoc);
const clientAfter = adaptSanityClient(sanityClientDoc);

// 5. Deep Semantic Parity Assertions
console.log("\n► [Step 3] Deep Semantic Parity Verification (Before vs After)");

// Identity
assert(canonicalAfter.id === canonicalBefore.id, "Identity matches ('janus-bifrous')");
assert(canonicalAfter.slug === canonicalBefore.slug, "Slug matches ('janus-bifrous')");

// Classification & Presentation
assert(canonicalAfter.title === canonicalBefore.title, "Title matches ('JANUS BIFROUS')");
assert(canonicalAfter.subtitle === canonicalBefore.subtitle, "Subtitle matches ('Artisan Beer')");
assert(canonicalAfter.category === canonicalBefore.category, "Category matches ('product-design')");
assert(canonicalAfter.categorySlug === canonicalBefore.categorySlug, "CategorySlug matches ('product-design')");
assert(canonicalAfter.presentationType === canonicalBefore.presentationType, "Presentation type matches ('standalone')");
assert(canonicalAfter.contentSubtype === canonicalBefore.contentSubtype, "ContentSubtype matches (undefined)");

// Client Attribution
assert(canonicalAfter.client === canonicalBefore.client, "Client attribution matches ('Locale Brewery')");
assert(clientAfter.name === "Locale Brewery", "Standalone client name matches ('Locale Brewery')");
assert(clientAfter.industry === "Brewery / Hospitality", "Standalone client industry matches");
assert(clientAfter.location === "Bali, Indonesia", "Standalone client location matches");

// Narrative & Scope
assert(canonicalAfter.description === canonicalBefore.description, "Description copy matches exactly");
assert(JSON.stringify(canonicalAfter.scope) === JSON.stringify(canonicalBefore.scope), "Scope array matches (4 items)");
assert(canonicalAfter.year === canonicalBefore.year, "Year matches ('2024')");

// Editorial Controls
assert(canonicalAfter.featured === canonicalBefore.featured, "Featured flag matches (true)");
assert(canonicalAfter.published === canonicalBefore.published, "Published flag matches (true)");
assert(canonicalAfter.order === canonicalBefore.order, "Editorial order matches (1)");

// Media Collection
assert(canonicalAfter.media.length === canonicalBefore.media.length, "Media asset count matches (3 items)");
canonicalAfter.media.forEach((item, idx) => {
  const beforeItem = canonicalBefore.media[idx];
  assert(item.src === beforeItem.src, `Media [${idx}] src matches (${item.src})`);
  assert(item.alt === beforeItem.alt, `Media [${idx}] alt matches (${item.alt})`);
  assert(item.role === beforeItem.role, `Media [${idx}] role matches (${item.role})`);
  assert(item.width === beforeItem.width, `Media [${idx}] width matches (${item.width})`);
  assert(item.height === beforeItem.height, `Media [${idx}] height matches (${item.height})`);
  assert(Math.abs((item.aspectRatio || 0) - (beforeItem.aspectRatio || 0)) < 0.001, `Media [${idx}] aspect ratio matches`);
  assert(item.orientation === beforeItem.orientation, `Media [${idx}] orientation matches (${item.orientation})`);
});

// Framing Configuration
assert(canonicalAfter.framingConfig?.layoutMode === canonicalBefore.framingConfig?.layoutMode, "Framing layoutMode matches ('auto')");
assert(canonicalAfter.framingConfig?.mode === canonicalBefore.framingConfig?.mode, "Framing mode matches ('auto')");
assert(canonicalAfter.framingConfig?.gap === canonicalBefore.framingConfig?.gap, "Framing gap matches ('md')");
assert(canonicalAfter.framingConfig?.mobileStack === canonicalBefore.framingConfig?.mobileStack, "Framing mobileStack matches (true)");

// 6. Framing Engine Parity Test
console.log("\n► [Step 4] Framing Engine Parity Verification (computeFramingRows)");
const rowsBefore = computeFramingRows(canonicalBefore.media, canonicalBefore.framingConfig);
const rowsAfter = computeFramingRows(canonicalAfter.media, canonicalAfter.framingConfig);

assert(rowsAfter.length === rowsBefore.length, "Framing engine produces identical row count (1 row)");
assert(rowsAfter[0].columns === rowsBefore[0].columns, "Framing engine produces identical column count (3 columns)");
assert(rowsAfter[0].images.length === 3, "Row contains all 3 images in identical order");
rowsAfter[0].images.forEach((img, idx) => {
  assert(img.src === rowsBefore[0].images[idx].src, `Row image [${idx}] src matches (${img.src})`);
  assert(img.role === rowsBefore[0].images[idx].role, `Row image [${idx}] role matches (${img.role})`);
});

// 7. Provenance & Accessors
assert(JSON.stringify(canonicalAfter.provenance) === JSON.stringify(canonicalBefore.provenance), "Provenance metadata matches");
assert(canonicalAfter.image === canonicalAfter.media[0].src, "Card cover image accessor resolves primary asset");

console.log("\n====================================================================");
console.log(` SUMMARY: ${passedCount} passed, ${failedCount} failed`);
console.log("====================================================================\n");

if (failedCount > 0) {
  process.exit(1);
}
