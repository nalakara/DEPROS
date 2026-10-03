import { adaptSanityProject, adaptSanityClient, adaptSanityProjects } from "../adapter";
import { SanityValidationError, validateSanityProject } from "../validation";
import { getSanityClient } from "../client";
import { CANONICAL_PORTFOLIO_ENTRIES } from "../../data";
import { mockJanusSanityDoc, mockClientLocaleBrewery } from "./fixtures";
import { SanityProjectDocument } from "../types";

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
console.log(" CMS-06: SANITY DATA ADAPTER & QUERY LAYER TEST HARNESS");
console.log("========================================================\n");

// ── PART 12: JANUS CANONICAL PARITY TEST ─────────────────────────────
console.log("► [Part 12] Janus Canonical Semantic Parity Test");
const canonicalJanus = CANONICAL_PORTFOLIO_ENTRIES.find((p) => p.slug === "janus-bifrous")!;
const adaptedJanus = adaptSanityProject(mockJanusSanityDoc);

assert(adaptedJanus.id === canonicalJanus.id, "Identity matches ('janus-bifrous')");
assert(adaptedJanus.slug === canonicalJanus.slug, "Slug matches ('janus-bifrous')");
assert(adaptedJanus.title === canonicalJanus.title, "Title matches ('JANUS BIFROUS')");
assert(adaptedJanus.subtitle === canonicalJanus.subtitle, "Subtitle matches ('Artisan Beer')");
assert(adaptedJanus.category === canonicalJanus.category, "Category matches ('product-design')");
assert(adaptedJanus.presentationType === canonicalJanus.presentationType, "Presentation type matches ('standalone')");
assert(adaptedJanus.client === canonicalJanus.client, "Client attribution matches ('Locale Brewery')");
assert(adaptedJanus.clientDisplayName === canonicalJanus.clientDisplayName, "Client display name matches");
assert(adaptedJanus.description === canonicalJanus.description, "Description matches");
assert(JSON.stringify(adaptedJanus.scope) === JSON.stringify(canonicalJanus.scope), "Scope array matches");
assert(adaptedJanus.year === canonicalJanus.year, "Year matches ('2024')");
assert(adaptedJanus.featured === canonicalJanus.featured, "Featured status matches (true)");
assert(adaptedJanus.published === canonicalJanus.published, "Published status matches (true)");
assert(adaptedJanus.order === canonicalJanus.order, "Order matches (1)");

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


// ── PART 13: ADAPTER UNIT TESTS ─────────────────────────────────────
console.log("\n► [Part 13] Adapter Unit & Error Handling Tests");

// Test 1: Valid project normalization
{
  const result = adaptSanityProject(mockJanusSanityDoc);
  assert(result && typeof result === "object" && result.title === "JANUS BIFROUS", "Test 1: Valid project normalization");
}

// Test 2: Invalid category -> validation failure
{
  let errorCaught = false;
  try {
    const invalidDoc = { ...mockJanusSanityDoc, category: "invalid-category-xyz" } as unknown as SanityProjectDocument;
    adaptSanityProject(invalidDoc);
  } catch (err) {
    if (err instanceof SanityValidationError && err.fieldPath === "category") {
      errorCaught = true;
    }
  }
  assert(errorCaught, "Test 2: Invalid category throws SanityValidationError on 'category'");
}

// Test 3: Invalid media role -> validation failure
{
  let errorCaught = false;
  try {
    const invalidDoc = {
      ...mockJanusSanityDoc,
      media: [
        {
          ...mockJanusSanityDoc.media[0],
          role: "invalid-role",
        },
      ],
    } as unknown as SanityProjectDocument;
    adaptSanityProject(invalidDoc);
  } catch (err) {
    if (err instanceof SanityValidationError && err.fieldPath === "media[0].role") {
      errorCaught = true;
    }
  }
  assert(errorCaught, "Test 3: Invalid media role throws SanityValidationError on 'media[0].role'");
}

// Test 4: Missing media dimensions -> validation failure
{
  let errorCaught = false;
  try {
    const invalidDoc = {
      ...mockJanusSanityDoc,
      media: [
        {
          ...mockJanusSanityDoc.media[0],
          asset: {
            ...mockJanusSanityDoc.media[0].asset,
            metadata: { dimensions: undefined },
          },
        },
      ],
    } as unknown as SanityProjectDocument;
    adaptSanityProject(invalidDoc);
  } catch (err) {
    if (err instanceof SanityValidationError && err.fieldPath === "media[0].asset.metadata.dimensions") {
      errorCaught = true;
    }
  }
  assert(errorCaught, "Test 4: Missing dimensions throws SanityValidationError on 'media[0].asset.metadata.dimensions'");
}

// Test 5: Missing slug -> validation failure
{
  let errorCaught = false;
  try {
    const invalidDoc = {
      ...mockJanusSanityDoc,
      slug: { current: "" },
    } as unknown as SanityProjectDocument;
    adaptSanityProject(invalidDoc);
  } catch (err) {
    if (err instanceof SanityValidationError && err.fieldPath === "slug.current") {
      errorCaught = true;
    }
  }
  assert(errorCaught, "Test 5: Missing slug throws SanityValidationError on 'slug.current'");
}

// Test 6: Client reference resolution
{
  const clientResult = adaptSanityClient(mockClientLocaleBrewery);
  assert(
    clientResult.id === "locale-brewery" &&
    clientResult.name === "Locale Brewery" &&
    clientResult.industry === "Brewery / Hospitality",
    "Test 6a: Client document normalizes to canonical ClientItem"
  );

  const overrideDoc: SanityProjectDocument = {
    ...mockJanusSanityDoc,
    clientDisplayName: "Locale Brewery International",
  };
  const adaptedOverride = adaptSanityProject(overrideDoc);
  assert(
    adaptedOverride.client === "Locale Brewery" &&
    adaptedOverride.clientDisplayName === "Locale Brewery International",
    "Test 6b: Explicit clientDisplayName override is preserved"
  );
}

// Test 7: Framing configuration normalization
{
  const editorialDoc: SanityProjectDocument = {
    ...mockJanusSanityDoc,
    framingConfig: {
      layoutMode: "editorial",
      editorialRows: "[[0], [1, 2]]", // Stringified JSON from Studio input
      gap: "hairline",
      mobileStack: true,
    },
  };
  const adaptedEditorial = adaptSanityProject(editorialDoc);
  assert(
    adaptedEditorial.framingConfig?.layoutMode === "editorial" &&
    Array.isArray(adaptedEditorial.framingConfig?.editorialRows) &&
    adaptedEditorial.framingConfig?.editorialRows.length === 2 &&
    adaptedEditorial.framingConfig?.editorialRows[0][0] === 0 &&
    adaptedEditorial.framingConfig?.editorialRows[1][0] === 1 &&
    adaptedEditorial.framingConfig?.editorialRows[1][1] === 2,
    "Test 7: Framing config parses stringified editorialRows '[[0], [1, 2]]' into number[][]"
  );
}

// Test 8: Published vs Draft document handling
{
  const draftDoc: SanityProjectDocument = {
    ...mockJanusSanityDoc,
    _id: "drafts.project-janus-bifrous",
    published: false,
  };
  const adaptedDraft = adaptSanityProject(draftDoc);
  assert(adaptedDraft.published === false, "Test 8: Draft doc is recognized as published: false");
}

// ── PART B: CMS-07 PREVIEW & REVALIDATION INFRASTRUCTURE TESTS ────────
console.log("\n► [CMS-07] Live Preview & Revalidation Infrastructure Tests");

// Test 9: getSanityClient preview perspective configuration
{
  const standardClient = getSanityClient({ isDraftMode: false });
  const previewClient = getSanityClient({ isDraftMode: true, token: "test-token-123" });

  assert(
    standardClient.config().perspective === "published",
    "Test 9a: Standard client uses perspective: 'published'"
  );
  assert(
    previewClient.config().perspective === "previewDrafts",
    "Test 9b: Preview client uses perspective: 'previewDrafts'"
  );
  assert(
    previewClient.config().useCdn === false,
    "Test 9c: Preview client disables CDN caching (useCdn: false)"
  );
  assert(
    previewClient.config().token === "test-token-123",
    "Test 9d: Preview client correctly binds privileged read token"
  );
}

// Test 10: Secret-guarded Preview URL construction
{
  const sampleSlug = "janus-bifrous";
  const sampleSecret = "depros-preview-secret-2026";
  const previewUrl = `/api/draft-mode/enable?secret=${sampleSecret}&slug=${sampleSlug}`;
  const urlObj = new URL(previewUrl, "https://depros.studio");

  assert(
    urlObj.pathname === "/api/draft-mode/enable" &&
    urlObj.searchParams.get("secret") === sampleSecret &&
    urlObj.searchParams.get("slug") === sampleSlug,
    "Test 10: Draft Mode activation URL matches expected route parameters"
  );
}

console.log("\n========================================================");
console.log(` SUMMARY: ${passedCount} passed, ${failedCount} failed`);
console.log("========================================================\n");

if (failedCount > 0) {
  process.exit(1);
}
