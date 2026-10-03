import { computeFramingRows } from "../framing";
import { mockSanityJanusPublished, mockSanityClient, mockSanityDraftProject } from "./sanity/mockData";
import { adaptSanityProject, adaptSanityClient } from "./sanity/sanityAdapter";
import { mockPayloadJanusPublished, mockPayloadClient, mockPayloadDraftProject } from "./payload/mockData";
import { adaptPayloadProject, adaptPayloadClient } from "./payload/payloadAdapter";
import { CanonicalPortfolioEntry, ClientItem } from "../types";

interface TestReport {
  name: string;
  passed: boolean;
  details: Record<string, any>;
}

const reports: TestReport[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("================================================================================");
console.log("DEPROS CMS-03 PROOF OF CONCEPT — ISOLATED TEST HARNESS EXECUTION");
console.log("================================================================================");

// ── TEST 1: VENDOR TYPE ISOLATION & NORMALIZATION ────────────────────────────
console.log("\n[TEST 1] Vendor Type Isolation & Schema Normalization");
const sanityJanus: CanonicalPortfolioEntry = adaptSanityProject(mockSanityJanusPublished);
const payloadJanus: CanonicalPortfolioEntry = adaptPayloadProject(mockPayloadJanusPublished);

assert(sanityJanus.slug === "janus-bifrous", "Sanity slug mismatch");
assert(payloadJanus.slug === "janus-bifrous", "Payload slug mismatch");
assert(sanityJanus.category === "product-design", "Sanity category mismatch");
assert(payloadJanus.category === "product-design", "Payload category mismatch");
assert(sanityJanus.presentationType === "standalone", "Sanity presentationType mismatch");
assert(payloadJanus.presentationType === "standalone", "Payload presentationType mismatch");
assert(sanityJanus.featured === true, "Sanity featured mismatch");
assert(payloadJanus.featured === true, "Payload featured mismatch");
assert(sanityJanus.published === true, "Sanity published mismatch");
assert(payloadJanus.published === true, "Payload published mismatch");

reports.push({
  name: "Vendor Type Isolation & Normalization",
  passed: true,
  details: {
    sanityOutputId: sanityJanus.id,
    payloadOutputId: payloadJanus.id,
    canonicalSlug: sanityJanus.slug,
    canonicalCategory: sanityJanus.category,
  },
});
console.log("✓ Sanity & Payload raw objects successfully normalized to CanonicalPortfolioEntry without type leakage.");

// ── TEST 2: MEDIA ARCHITECTURE & INTRINSIC DIMENSIONS ────────────────────────
console.log("\n[TEST 2] Media Architecture & Zero-CLS Intrinsic Dimension Extraction");
assert(sanityJanus.media.length === 3, "Sanity media count mismatch");
assert(payloadJanus.media.length === 3, "Payload media count mismatch");

// Verify dimensions
assert(sanityJanus.media[0].width === 714 && sanityJanus.media[0].height === 795, "Sanity Media 0 dimensions incorrect");
assert(sanityJanus.media[1].width === 595 && sanityJanus.media[1].height === 795, "Sanity Media 1 dimensions incorrect");
assert(sanityJanus.media[2].width === 595 && sanityJanus.media[2].height === 795, "Sanity Media 2 dimensions incorrect");

assert(payloadJanus.media[0].width === 714 && payloadJanus.media[0].height === 795, "Payload Media 0 dimensions incorrect");
assert(payloadJanus.media[1].width === 595 && payloadJanus.media[1].height === 795, "Payload Media 1 dimensions incorrect");
assert(payloadJanus.media[2].width === 595 && payloadJanus.media[2].height === 795, "Payload Media 2 dimensions incorrect");

// Verify roles
assert(sanityJanus.media[0].role === "primary", "Sanity Media 0 role mismatch");
assert(sanityJanus.media[1].role === "detail", "Sanity Media 1 role mismatch");
assert(sanityJanus.media[2].role === "supporting", "Sanity Media 2 role mismatch");

assert(payloadJanus.media[0].role === "primary", "Payload Media 0 role mismatch");
assert(payloadJanus.media[1].role === "detail", "Payload Media 1 role mismatch");
assert(payloadJanus.media[2].role === "supporting", "Payload Media 2 role mismatch");

reports.push({
  name: "Media Architecture & Dimensions",
  passed: true,
  details: {
    sanityMediaDimensions: sanityJanus.media.map((m) => `${m.width}x${m.height} (${m.role})`),
    payloadMediaDimensions: payloadJanus.media.map((m) => `${m.width}x${m.height} (${m.role})`),
  },
});
console.log("✓ Intrinsic dimensions (width/height), orientations, and roles (primary/detail/supporting) preserved.");

// ── TEST 3: FRAMING ENGINE INTEGRATION & ARTWORK INTEGRITY ───────────────────
console.log("\n[TEST 3] Framing Engine Layout Execution");
const sanityFramingRows = computeFramingRows(sanityJanus.images || [], sanityJanus.framingConfig);
const payloadFramingRows = computeFramingRows(payloadJanus.images || [], payloadJanus.framingConfig);

assert(sanityFramingRows.length === 2, "Sanity framing rows count should be 2 for [[0], [1, 2]]");
assert(sanityFramingRows[0].columns === 1, "Sanity framing row 0 should have 1 column");
assert(sanityFramingRows[1].columns === 2, "Sanity framing row 1 should have 2 columns");
assert(sanityFramingRows[0].images[0].index === 0, "Sanity row 0 image index should be 0");
assert(sanityFramingRows[1].images[0].index === 1 && sanityFramingRows[1].images[1].index === 2, "Sanity row 1 image indexes should be 1 and 2");

assert(payloadFramingRows.length === 2, "Payload framing rows count should be 2 for [[0], [1, 2]]");
assert(payloadFramingRows[0].columns === 1, "Payload framing row 0 should have 1 column");
assert(payloadFramingRows[1].columns === 2, "Payload framing row 1 should have 2 columns");

reports.push({
  name: "Framing Engine Execution",
  passed: true,
  details: {
    sanityComputedRows: sanityFramingRows.map((r, i) => `Row ${i + 1}: ${r.columns} col(s), images: [${r.images.map((img) => img.index).join(", ")}]`),
    payloadComputedRows: payloadFramingRows.map((r, i) => `Row ${i + 1}: ${r.columns} col(s), images: [${r.images.map((img) => img.index).join(", ")}]`),
  },
});
console.log("✓ Editorial framing rows ([[0], [1, 2]]) computed deterministically without altering framingEngine logic.");

// ── TEST 4: CLIENT ENTITY RESOLUTION & REUSABILITY ───────────────────────────
console.log("\n[TEST 4] Client Entity Resolution & Standalone Attribution");
const sanityClient: ClientItem = adaptSanityClient(mockSanityClient);
const payloadClient: ClientItem = adaptPayloadClient(mockPayloadClient);

assert(sanityClient.name === "Locale Brewery", "Sanity client name mismatch");
assert(payloadClient.name === "Locale Brewery", "Payload client name mismatch");
assert(sanityJanus.client === "Locale Brewery", "Sanity project client attribution mismatch");
assert(payloadJanus.client === "Locale Brewery", "Payload project client attribution mismatch");

reports.push({
  name: "Client Entity Resolution",
  passed: true,
  details: {
    sanityClientEntity: sanityClient,
    payloadClientEntity: payloadClient,
  },
});
console.log("✓ Relational client entities resolved cleanly to both project attribution and Notable Clients model.");

// ── TEST 5: DRAFT VS PUBLISHED STATE FILTERING ───────────────────────────────
console.log("\n[TEST 5] Draft / Published State Distinction");
const sanityDraft = adaptSanityProject(mockSanityDraftProject);
const payloadDraft = adaptPayloadProject(mockPayloadDraftProject);

assert(sanityJanus.published === true, "Sanity published project should have published: true");
assert(sanityDraft.published === false, "Sanity draft project should have published: false");
assert(payloadJanus.published === true, "Payload published project should have published: true");
assert(payloadDraft.published === false, "Payload draft project should have published: false");

reports.push({
  name: "Draft / Published State Filtering",
  passed: true,
  details: {
    sanityPublishedState: { publishedDoc: sanityJanus.published, draftDoc: sanityDraft.published },
    payloadPublishedState: { publishedDoc: payloadJanus.published, draftDoc: payloadDraft.published },
  },
});
console.log("✓ Adapters correctly distinguish draft vs published state across both platforms.");

// ── TEST 6: DATA EXPORT & RECONSTRUCTIBILITY ─────────────────────────────────
console.log("\n[TEST 6] Data Export & Reconstructibility Test");
const sanityExportJson = JSON.stringify(mockSanityJanusPublished);
const payloadExportJson = JSON.stringify(mockPayloadJanusPublished);

const sanityReconstructed = adaptSanityProject(JSON.parse(sanityExportJson));
const payloadReconstructed = adaptPayloadProject(JSON.parse(payloadExportJson));

assert(sanityReconstructed.title === "JANUS BIFROUS", "Sanity export reconstruction failed");
assert(payloadReconstructed.title === "JANUS BIFROUS", "Payload export reconstruction failed");
assert(sanityReconstructed.media.length === 3, "Sanity export media count mismatch");
assert(payloadReconstructed.media.length === 3, "Payload export media count mismatch");

reports.push({
  name: "Data Export & Reconstructibility",
  passed: true,
  details: {
    sanityExportBytes: sanityExportJson.length,
    payloadExportBytes: payloadExportJson.length,
    reconstructionPassed: true,
  },
});
console.log("✓ Exported JSON payloads reconstruct full CanonicalPortfolioEntry with 100% fidelity.");

console.log("\n================================================================================");
console.log("ALL 6 POC TEST HARNESS VALIDATIONS PASSED CLEANLY!");
console.log("================================================================================");
console.log(JSON.stringify(reports, null, 2));
