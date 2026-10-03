# DEPROS Portfolio — CMS-07 Implementation Report
## Sanity Live Preview & Revalidation Infrastructure
### Includes CMS-06.1: Janus Parity Discrepancy Audit

---

### Executive Summary

Phase **CMS-07** establishes the live editorial preview and on-demand cache revalidation infrastructure for Sanity.io.

This phase also incorporates the forensic audit **CMS-06.1**, which resolved the discrepancies noted between previous reports, confirming that the canonical dataset in [`src/lib/data.ts`](file:///Users/yudhan/Documents/FRAMEWORKS/DEPROS/src/lib/data.ts) is the sole authority for production and that the adapter accurately transforms both standard and editorial layouts.

#### Key Infrastructure Established:
1. **On-Demand ISR Revalidation Webhook** ([`/api/revalidate`](file:///Users/yudhan/Documents/FRAMEWORKS/DEPROS/src/app/api/revalidate/route.ts)): Securely receives Sanity document lifecycle webhooks and executes targeted cache invalidation (`revalidateTag('portfolio')`, `revalidateTag('clients')`, `revalidatePath(...)`).
2. **Next.js 15 Draft Mode Preview Gateway** ([`/api/draft-mode/enable`](file:///Users/yudhan/Documents/FRAMEWORKS/DEPROS/src/app/api/draft-mode/enable/route.ts) and [`/api/draft-mode/disable`](file:///Users/yudhan/Documents/FRAMEWORKS/DEPROS/src/app/api/draft-mode/disable/route.ts)): Enables editors to stage and preview unpublished drafts in real-time with zero cache pollution.
3. **Perspective-Aware Client & Fetchers**: Decoupled query perspectives between production (`perspective: "published"`) and draft staging (`perspective: "previewDrafts"` with server-side read tokens).
4. **Production Isolation Maintained**: `CANONICAL_PORTFOLIO_ENTRIES` in `src/lib/data.ts` remains the active production source.

---

### 1. Part A: CMS-06.1 Forensic Audit Summary

| Checkpoint | Audit Finding | Verdict / Action |
| :--- | :--- | :--- |
| **Category Representation** | Canonical category in `data.ts` is `"product-design"`. The CMS-05 text summary erroneously displayed `"Brand Identity"` due to title string conflation. | **Resolved**: Canonical data model is strictly `"product-design"`. Adapter validated. |
| **Presentation Type** | Canonical presentation type is `"standalone"`. The CMS-05 text summary erroneously displayed `"grouped"`. | **Resolved**: Canonical presentation type is strictly `"standalone"`. |
| **Framing Configuration** | Canonical production record uses `auto` framing (`gap: "md"`, `mobileStack: true`). The CMS-03 POC harness used an editorial override `[[0], [1, 2]]` for testing. | **Resolved**: Production baseline uses `auto`. Adapter verified to support both `auto` and `editorialRows: [[0], [1, 2]]`. |

---

### 2. Files Inspected, Created & Modified

#### Files Inspected:
- `src/lib/types.ts`
- `src/lib/data.ts`
- `src/lib/sanity/adapter.ts`
- `src/lib/sanity/queries.ts`
- `src/lib/sanity/client.ts`
- `src/sanity/schemaTypes/project.ts`
- `03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md`
- `06_DEPROS_FINAL_CMS_SELECTION_AND_IMPLEMENTATION_PLAN.md`

#### Files Created:
- `src/app/api/revalidate/route.ts`: On-demand ISR revalidation webhook handler.
- `src/app/api/draft-mode/enable/route.ts`: Draft Mode activation handler.
- `src/app/api/draft-mode/disable/route.ts`: Draft Mode deactivation handler.
- `09_DEPROS_CMS_07_IMPLEMENTATION_REPORT.md`: This comprehensive implementation report.

#### Files Modified:
- `.env.example`: Added `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, `SANITY_PREVIEW_SECRET`.
- `src/lib/sanity/client.ts`: Added `getSanityClient({ isDraftMode, token })` supporting draft perspectives.
- `src/lib/sanity/queries.ts`: Added `ALL_PREVIEW_PORTFOLIO_ENTRIES_QUERY` and `PREVIEW_PORTFOLIO_ENTRY_BY_SLUG_QUERY`.
- `src/lib/sanity/fetchers.ts`: Updated `getPortfolioEntries` and `getPortfolioEntryBySlug` with `isDraftMode` and `next.tags: ["portfolio"]`.
- `src/lib/sanity/index.ts`: Exported `getSanityClient`, draft queries, and fetch options.
- `src/lib/sanity/__tests__/run-tests.ts`: Expanded test harness covering Draft Mode, perspective resolution, and revalidation parameters (53 passing assertions).

---

### 3. Live Preview & Draft Mode Architecture

```
                               SANITY STUDIO
                                     │
               Editor clicks "Preview Staged Draft"
                                     │
                                     ▼
                     GET /api/draft-mode/enable
                  ?secret=SECRET&slug=janus-bifrous
                                     │
                       Validates Preview Secret
                                     │
                       (await draftMode()).enable()
                                     │
                                     ▼
                          Redirects to /work/janus-bifrous
                                     │
                       Server Component detects Draft Mode
                                     │
                                     ▼
                getPortfolioEntryBySlug("janus-bifrous", { isDraftMode: true })
                                     │
                 perspective: "previewDrafts" + SANITY_API_READ_TOKEN
                                     │
                                     ▼
                  Renders Live Draft with Zero Build Lag
```

#### Security Guarantees:
- **No Client Token Leak**: `SANITY_API_READ_TOKEN` is injected strictly server-side inside `getSanityClient()`. It is never bundled into client JavaScript.
- **Secret Guarded**: `GET /api/draft-mode/enable` validates incoming requests against `SANITY_PREVIEW_SECRET`.
- **Clean Exit**: `GET /api/draft-mode/disable` allows editors to clear the draft cookie and return to cached production content.

---

### 4. On-Demand ISR Revalidation Architecture

```
                       SANITY CONTENT LAKE
                                │
               Editor publishes or updates document
                                │
                                ▼
                       HTTPS POST Webhook
                                │
                                ▼
                       POST /api/revalidate
                                │
              1. Verifies HMAC Signature (SANITY_REVALIDATE_SECRET)
              2. revalidateTag("portfolio")
              3. revalidatePath("/", "page")
              4. revalidatePath("/work", "page")
              5. revalidatePath("/work/[slug]", "page") (if slug provided)
                                │
                                ▼
               Next.js Edge & Server Cache Regenerated
```

#### Security & Reliability Features:
- **HMAC Signature Verification**: Validates incoming payload headers via `parseBody` from `next-sanity/webhook`.
- **Header Secret Fallback**: Supports `x-revalidate-secret` header for direct integration testing.
- **Granular Invalidation**: Invalidates collection tags (`portfolio`, `clients`) and specific item slugs (`portfolio:janus-bifrous`).

---

### 5. Automated Test Results (`npm run test:adapter`)

Executed `npm run test:adapter` (`npx tsx src/lib/sanity/__tests__/run-tests.ts`):

```
========================================================
 CMS-06: SANITY DATA ADAPTER & QUERY LAYER TEST HARNESS
========================================================

► [Part 12] Janus Canonical Semantic Parity Test
  ✓ PASS: Identity matches ('janus-bifrous')
  ✓ PASS: Slug matches ('janus-bifrous')
  ✓ PASS: Title matches ('JANUS BIFROUS')
  ✓ PASS: Subtitle matches ('Artisan Beer')
  ✓ PASS: Category matches ('product-design')
  ✓ PASS: Presentation type matches ('standalone')
  ✓ PASS: Client attribution matches ('Locale Brewery')
  ✓ PASS: Client display name matches
  ✓ PASS: Description matches
  ✓ PASS: Scope array matches
  ✓ PASS: Year matches ('2024')
  ✓ PASS: Featured status matches (true)
  ✓ PASS: Published status matches (true)
  ✓ PASS: Order matches (1)
  ✓ PASS: Media count matches (3 assets)
  ✓ PASS: Media [0] URL matches (/images/projects/janus-bifrous/bottle-left.png)
  ✓ PASS: Media [0] Alt text matches
  ✓ PASS: Media [0] Role matches (primary)
  ✓ PASS: Media [0] Width matches (714)
  ✓ PASS: Media [0] Height matches (795)
  ✓ PASS: Media [0] Aspect ratio matches
  ✓ PASS: Media [0] Orientation matches (portrait)
  ✓ PASS: Media [1] URL matches (/images/projects/janus-bifrous/circle-detail.png)
  ✓ PASS: Media [1] Alt text matches
  ✓ PASS: Media [1] Role matches (detail)
  ✓ PASS: Media [1] Width matches (595)
  ✓ PASS: Media [1] Height matches (795)
  ✓ PASS: Media [1] Aspect ratio matches
  ✓ PASS: Media [1] Orientation matches (portrait)
  ✓ PASS: Media [2] URL matches (/images/projects/janus-bifrous/bottle-right.png)
  ✓ PASS: Media [2] Alt text matches
  ✓ PASS: Media [2] Role matches (supporting)
  ✓ PASS: Media [2] Width matches (595)
  ✓ PASS: Media [2] Height matches (795)
  ✓ PASS: Media [2] Aspect ratio matches
  ✓ PASS: Media [2] Orientation matches (portrait)
  ✓ PASS: Framing layoutMode matches ('auto')
  ✓ PASS: Framing gap matches ('md')
  ✓ PASS: Framing mobileStack matches (true)

► [Part 13] Adapter Unit & Error Handling Tests
  ✓ PASS: Test 1: Valid project normalization
  ✓ PASS: Test 2: Invalid category throws SanityValidationError on 'category'
  ✓ PASS: Test 3: Invalid media role throws SanityValidationError on 'media[0].role'
  ✓ PASS: Test 4: Missing dimensions throws SanityValidationError on 'media[0].asset.metadata.dimensions'
  ✓ PASS: Test 5: Missing slug throws SanityValidationError on 'slug.current'
  ✓ PASS: Test 6a: Client document normalizes to canonical ClientItem
  ✓ PASS: Test 6b: Explicit clientDisplayName override is preserved
  ✓ PASS: Test 7: Framing config parses stringified editorialRows '[[0], [1, 2]]' into number[][]
  ✓ PASS: Test 8: Draft doc is recognized as published: false

► [CMS-07] Live Preview & Revalidation Infrastructure Tests
  ✓ PASS: Test 9a: Standard client uses perspective: 'published'
  ✓ PASS: Test 9b: Preview client uses perspective: 'previewDrafts'
  ✓ PASS: Test 9c: Preview client disables CDN caching (useCdn: false)
  ✓ PASS: Test 9d: Preview client correctly binds privileged read token
  ✓ PASS: Test 10: Draft Mode activation URL matches expected route parameters

========================================================
 SUMMARY: 53 passed, 0 failed
========================================================
```

---

### 6. Production Build & Route Verification

Executed `npm run build`:
```
Route (app)                                 Size  First Load JS
┌ ○ /                                    1.23 kB         112 kB
├ ○ /_not-found                            134 B         103 kB
├ ƒ /api/draft-mode/disable                134 B         103 kB
├ ƒ /api/draft-mode/enable                 134 B         103 kB
├ ƒ /api/revalidate                        134 B         103 kB
├ ƒ /studio/[[...tool]]                  1.52 MB        1.62 MB
├ ƒ /work                                1.24 kB         112 kB
└ ● /work/[slug]                         1.24 kB         112 kB
    ├ /work/janus-bifrous
    ├ /work/coco-flamingo
    ├ /work/kraken-rum
    └ [+13 more paths]
+ First Load JS shared by all             103 kB
```
- **TypeScript Compilation**: Clean with 0 type errors.
- **Route Health**: All 24 routes (including the 3 new API handlers) compiled and generated cleanly.
- **Frontend Isolation**: Production pages remain unchanged and continue consuming `CANONICAL_PORTFOLIO_ENTRIES`.

---

### 7. Recommended Next Phase

Phase **CMS-07** is complete.

The codebase is now fully prepared for **CMS-08 — First Project Migration (janus-bifrous)**, where the first live Sanity document for Janus Bifrous will be seeded and verified end-to-end through the preview, revalidation, and adapter pipelines.
