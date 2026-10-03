import { executeCatalogMigration } from "../migration/migrateCatalog";
import { CANONICAL_PORTFOLIO_ENTRIES, SemanticCategoryId } from "../../data";
import { computeFramingRows } from "../../framing";

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
console.log(" CMS-09B: FULL 16-PROJECT CATALOG MIGRATION & END-TO-END PARITY");
console.log("====================================================================\n");

// 1. Execute Migration & Read Back
const migrationResult = executeCatalogMigration();

console.log(`► Migrated Clients: ${migrationResult.clientsMigrated}`);
console.log(`► Migrated Projects: ${migrationResult.projectsMigrated}`);
console.log(`► Migrated Media Assets: ${migrationResult.mediaAssetsMigrated}\n`);

assert(migrationResult.projectsMigrated === 16, "Catalog contains exactly 16 presentation units");
assert(migrationResult.clientsMigrated === 20, "Catalog contains exactly 20 unique client entities");
assert(migrationResult.mediaAssetsMigrated === 26, "Catalog contains exactly 26 media assets");

// 2. Full Semantic Parity across all 16 projects
console.log("\n► [Part 16] Deep Semantic Parity for all 16 Projects");
migrationResult.adaptedCatalog.forEach((adapted, idx) => {
  const canonical = CANONICAL_PORTFOLIO_ENTRIES[idx];
  const label = `Project ${idx + 1} [${adapted.slug}]`;

  assert(adapted.id === canonical.id, `${label}: ID matches ('${canonical.id}')`);
  assert(adapted.slug === canonical.slug, `${label}: Slug matches ('${canonical.slug}')`);
  assert(adapted.title === canonical.title, `${label}: Title matches ('${canonical.title}')`);
  assert(adapted.category === canonical.category, `${label}: Category matches ('${canonical.category}')`);
  assert(adapted.presentationType === canonical.presentationType, `${label}: PresentationType matches ('${canonical.presentationType}')`);
  assert(adapted.contentSubtype === canonical.contentSubtype, `${label}: ContentSubtype matches`);
  assert(adapted.client === canonical.client, `${label}: Client attribution matches ('${canonical.client || "N/A"}')`);
  assert(adapted.clientDisplayName === canonical.clientDisplayName, `${label}: ClientDisplayName matches`);
  assert(adapted.description === canonical.description, `${label}: Description matches`);
  assert(JSON.stringify(adapted.scope) === JSON.stringify(canonical.scope), `${label}: Scope matches`);
  assert(adapted.year === canonical.year, `${label}: Year matches ('${canonical.year}')`);
  assert(adapted.featured === canonical.featured, `${label}: Featured flag matches (${canonical.featured})`);
  assert(adapted.published === canonical.published, `${label}: Published flag matches (${canonical.published})`);
  assert(adapted.order === canonical.order, `${label}: Order matches (${canonical.order})`);

  // Media Parity
  assert(adapted.media.length === canonical.media.length, `${label}: Media asset count matches (${canonical.media.length})`);
  adapted.media.forEach((m, mIdx) => {
    const cM = canonical.media[mIdx];
    assert(m.src === cM.src, `${label} Media [${mIdx}]: src matches (${m.src})`);
    assert(m.role === cM.role, `${label} Media [${mIdx}]: role matches (${m.role})`);
    assert(m.width === cM.width, `${label} Media [${mIdx}]: width matches (${m.width})`);
    assert(m.height === cM.height, `${label} Media [${mIdx}]: height matches (${m.height})`);
    assert(m.orientation === cM.orientation, `${label} Media [${mIdx}]: orientation matches (${m.orientation})`);
  });

  // Framing Parity
  const rowsCanonical = computeFramingRows(canonical.media, canonical.framingConfig);
  const rowsAdapted = computeFramingRows(adapted.media, adapted.framingConfig);
  assert(rowsAdapted.length === rowsCanonical.length, `${label}: Framing row count matches (${rowsCanonical.length} rows)`);
  rowsAdapted.forEach((row, rIdx) => {
    assert(row.columns === rowsCanonical[rIdx].columns, `${label} Framing Row [${rIdx}]: Column count matches (${row.columns} cols)`);
  });
});

// 3. Homepage Selection Parity
console.log("\n► [Part 18] Homepage Curated Showcase Parity (Top 5 Featured)");
const canonicalFeatured = CANONICAL_PORTFOLIO_ENTRIES
  .filter((p) => p.featured)
  .sort((a, b) => (a.order || 99) - (b.order || 99))
  .slice(0, 5)
  .map((p) => p.slug);

const adaptedFeatured = migrationResult.adaptedCatalog
  .filter((p) => p.featured)
  .sort((a, b) => (a.order || 99) - (b.order || 99))
  .slice(0, 5)
  .map((p) => p.slug);

const expectedFeaturedSlugs = [
  "janus-bifrous",
  "coco-flamingo",
  "kraken-rum",
  "mitra-kopling",
  "whysuper-millimeter",
];

assert(
  JSON.stringify(adaptedFeatured) === JSON.stringify(expectedFeaturedSlugs),
  "Adapted catalog produces exact 5 featured homepage projects in correct order"
);
assert(
  JSON.stringify(adaptedFeatured) === JSON.stringify(canonicalFeatured),
  "Adapted homepage selection matches canonical data baseline"
);

// 4. Archive Category Filtering Parity
console.log("\n► [Part 19] Archive Category Counts Parity");
const categories: SemanticCategoryId[] = [
  "product-design",
  "brand-identity",
  "logos",
  "corporate-identity",
  "marketing-kit",
  "graphic-visual",
  "social-media-content",
];

categories.forEach((cat) => {
  const countCanonical = CANONICAL_PORTFOLIO_ENTRIES.filter((p) => p.category === cat).length;
  const countAdapted = migrationResult.adaptedCatalog.filter((p) => p.category === cat).length;
  assert(
    countAdapted === countCanonical,
    `Category "${cat}": count matches (${countAdapted} projects)`
  );
});

console.log("\n====================================================================");
console.log(` SUMMARY: ${passedCount} passed, ${failedCount} failed`);
console.log("====================================================================\n");

if (failedCount > 0) {
  process.exit(1);
}
