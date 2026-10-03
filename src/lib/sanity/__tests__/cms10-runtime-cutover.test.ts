import assert from "node:assert/strict";
import {
  CANONICAL_PORTFOLIO_ENTRIES,
  NOTABLE_CLIENTS,
} from "../../data";
import {
  getPortfolioEntries,
  getPortfolioEntryBySlug,
  getClientItems,
  isSanityEnabled,
} from "../../dataSource";
import { computeFramingRows } from "../../framing";
import { adaptSanityProjects, adaptSanityClient } from "../adapter";
import { buildMigrationPayload } from "../migration/extractPayload";

console.log("\n====================================================================");
console.log(" CMS-10: PRODUCTION DATA-SOURCE CUTOVER & RUNTIME PARITY TEST");
console.log("====================================================================\n");

let passed = 0;
let failed = 0;

async function check(desc: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${desc}`);
    passed++;
  } catch (err: unknown) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    ${(err as Error).message}`);
    failed++;
  }
}

async function runAll() {
  // -----------------------------------------------------------------------------
  // Stage 1: Data-Source Boundary & Switch Verification
  // -----------------------------------------------------------------------------
  console.log("► [Part 1] Runtime Source Switch & Fallback Verification");

  // Test local mode (rollback path)
  process.env.ENABLE_SANITY_CMS = "false";

  await check("isSanityEnabled() returns false when ENABLE_SANITY_CMS='false'", () => {
    assert.equal(isSanityEnabled(), false);
  });

  await check("Local fallback returns all 16 canonical entries", async () => {
    const localEntries = await getPortfolioEntries();
    assert.equal(localEntries.length, 16);
    assert.equal(localEntries[0].slug, "janus-bifrous");
  });

  await check("Local fallback returns client items", async () => {
    const localClients = await getClientItems();
    assert.equal(localClients.length, NOTABLE_CLIENTS.length);
  });

  await check("Local fallback resolves valid slug and returns null for invalid slug", async () => {
    const valid = await getPortfolioEntryBySlug("janus-bifrous");
    assert.ok(valid);
    assert.equal(valid.title, "JANUS BIFROUS");

    const invalid = await getPortfolioEntryBySlug("non-existent-project-xyz");
    assert.equal(invalid, null);
  });

  // -----------------------------------------------------------------------------
  // Stage 2: Sanity Production Model Parity
  // -----------------------------------------------------------------------------
  console.log("\n► [Part 2] Sanity CMS Data Path Normalization & Parity");

  const payload = buildMigrationPayload();
  const sanityAdaptedEntries = adaptSanityProjects(payload.projects);

  await check("Sanity payload produces exactly 16 adapted presentation units", () => {
    assert.equal(sanityAdaptedEntries.length, 16);
  });

  for (let i = 0; i < CANONICAL_PORTFOLIO_ENTRIES.length; i++) {
    const canonical = CANONICAL_PORTFOLIO_ENTRIES[i];
    const sanity = sanityAdaptedEntries[i];

    await check(`Project ${i + 1} [${canonical.slug}]: Canonical identity parity`, () => {
      assert.equal(sanity.id, canonical.id);
      assert.equal(sanity.slug, canonical.slug);
      assert.equal(sanity.title, canonical.title);
      assert.equal(sanity.subtitle, canonical.subtitle);
      assert.equal(sanity.category, canonical.category);
      assert.equal(sanity.presentationType, canonical.presentationType);
      assert.equal(sanity.client, canonical.client);
      assert.equal(sanity.clientDisplayName, canonical.clientDisplayName);
      assert.equal(sanity.description, canonical.description);
      assert.deepEqual(sanity.scope, canonical.scope);
      assert.equal(sanity.year, canonical.year);
      assert.equal(sanity.featured, canonical.featured);
      assert.equal(sanity.published, canonical.published);
      assert.equal(sanity.order, canonical.order);
    });

    await check(`Project ${i + 1} [${canonical.slug}]: Media structure parity`, () => {
      assert.equal(sanity.media.length, canonical.media.length);
      for (let m = 0; m < canonical.media.length; m++) {
        const cMedia = canonical.media[m];
        const sMedia = sanity.media[m];
        assert.equal(sMedia.src, cMedia.src);
        assert.equal(sMedia.role, cMedia.role);
        assert.equal(sMedia.width, cMedia.width);
        assert.equal(sMedia.height, cMedia.height);
        assert.equal(sMedia.orientation, cMedia.orientation);
        assert.equal(sMedia.alt, cMedia.alt);
        assert.equal(sMedia.caption, cMedia.caption);
      }
    });

    await check(`Project ${i + 1} [${canonical.slug}]: Framing engine parity (computeFramingRows)`, () => {
      const cRows = computeFramingRows(canonical.media, canonical.framingConfig);
      const sRows = computeFramingRows(sanity.media, sanity.framingConfig);
      assert.equal(sRows.length, cRows.length);
      for (let r = 0; r < cRows.length; r++) {
        assert.equal(sRows[r].columns, cRows[r].columns);
        assert.equal(sRows[r].images.length, cRows[r].images.length);
        for (let c = 0; c < cRows[r].images.length; c++) {
          assert.equal(sRows[r].images[c].src, cRows[r].images[c].src);
        }
      }
    });
  }

  // -----------------------------------------------------------------------------
  // Stage 3: Homepage Showcase & Archive Filtering Parity
  // -----------------------------------------------------------------------------
  console.log("\n► [Part 3] Homepage & Archive Category Filtering Parity");

  await check("Homepage curated top 5 featured order parity", () => {
    const canonicalFeatured = CANONICAL_PORTFOLIO_ENTRIES.filter((p) => p.featured)
      .sort((a, b) => a.order - b.order)
      .map((p) => p.slug);

    const sanityFeatured = sanityAdaptedEntries
      .filter((p) => p.featured)
      .sort((a, b) => a.order - b.order)
      .map((p) => p.slug);

    assert.deepEqual(sanityFeatured, canonicalFeatured);
    assert.deepEqual(sanityFeatured, [
      "janus-bifrous",
      "coco-flamingo",
      "kraken-rum",
      "mitra-kopling",
      "whysuper-millimeter",
    ]);
  });

  const VALID_CATEGORIES = [
    "product-design",
    "brand-identity",
    "logos",
    "corporate-identity",
    "marketing-kit",
    "graphic-visual",
    "social-media-content",
  ];

  for (const cat of VALID_CATEGORIES) {
    await check(`Archive filtering for category "${cat}" matches exactly`, () => {
      const canonicalCount = CANONICAL_PORTFOLIO_ENTRIES.filter((p) => p.category === cat).length;
      const sanityCount = sanityAdaptedEntries.filter((p) => p.category === cat).length;
      assert.equal(sanityCount, canonicalCount);
    });
  }

  // -----------------------------------------------------------------------------
  // Stage 4: Rollback Drill & State Restoration
  // -----------------------------------------------------------------------------
  console.log("\n► [Part 4] Rollback & Reversible Switch Drill");

  await check("Step 1: Set ENABLE_SANITY_CMS='true' and verify switch state", () => {
    process.env.ENABLE_SANITY_CMS = "true";
    assert.equal(isSanityEnabled(), true);
  });

  await check("Step 2: Rollback to ENABLE_SANITY_CMS='false' and verify data retrieval", async () => {
    process.env.ENABLE_SANITY_CMS = "false";
    assert.equal(isSanityEnabled(), false);
    const rollbackEntries = await getPortfolioEntries();
    assert.equal(rollbackEntries.length, 16);
    assert.equal(rollbackEntries[0].slug, "janus-bifrous");
  });

  await check("Step 3: Restore active CMS mode ENABLE_SANITY_CMS='true'", () => {
    process.env.ENABLE_SANITY_CMS = "true";
    assert.equal(isSanityEnabled(), true);
  });

  console.log("\n====================================================================");
  console.log(` SUMMARY: ${passed} passed, ${failed} failed`);
  console.log("====================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAll().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
