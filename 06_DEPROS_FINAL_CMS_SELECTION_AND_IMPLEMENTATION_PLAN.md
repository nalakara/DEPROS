# DEPROS CMS Selection & Implementation Plan

**Pass:** CMS-04 — Final CMS Selection & Implementation Plan  
**Date:** October 2026  
**Repository:** `nalakara/DEPROS`  
**Primary References:**  
- [`03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md`](./03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md) (Architecture Contract)  
- [`04_DEPROS_CMS_VENDOR_AND_ARCHITECTURE_EVALUATION.md`](./04_DEPROS_CMS_VENDOR_AND_ARCHITECTURE_EVALUATION.md) (Vendor Evaluation)  
- [`05_DEPROS_CMS_POC_REPORT.md`](./05_DEPROS_CMS_POC_REPORT.md) (Proof of Concept Report)  
**Status:** Approved for Implementation Blueprint (No Code Changes / No Data Migration in this Phase)  

---

## Part 1 — Decision Context Reconstruction

### 1. What DEPROS Requires from a CMS
- **Single Source of Truth:** A unified content repository powering the curated Homepage showcase, the `/work` Archive with 7 semantic category filters, and the universal `/work/[slug]` Detail template.
- **Editorial Curation:** Independent control over homepage visibility (`featured`), publication staging (`published`), and sequence ordering (`order`).
- **Media Dimension Integrity:** Automatic extraction and delivery of intrinsic asset dimensions (`width`, `height`, `aspectRatio`) to guarantee **zero Cumulative Layout Shift (CLS)** in the Framing Engine.
- **Strict Artwork Integrity:** Serving uncropped original visual masters displayed via Next.js `object-contain`, without destructive cropping or distortion.
- **Zero Presentation Contamination:** Complete isolation between CMS backend types and DEPROS frontend React components.

### 2. What the Approved Architecture Contract Requires
[`03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md`](./03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md) establishes a three-tier separation of authority:
1. **CMS Layer:** Authoritative for **Content & Editorial State** (documents, media, relational links, editorial flags).
2. **Adapter Layer:** Authoritative for **Contract & Validation** (normalizing raw vendor payloads to `CanonicalPortfolioEntry`).
3. **Frontend Layer:** Authoritative for **Presentation & Behavior** (design tokens, typography, framing math, responsive stacking, routing, filtering).

### 3. What the Vendor Evaluation Established
[`04_DEPROS_CMS_VENDOR_AND_ARCHITECTURE_EVALUATION.md`](./04_DEPROS_CMS_VENDOR_AND_ARCHITECTURE_EVALUATION.md) evaluated 5 architectures, identifying **Sanity.io** as the leading managed SaaS candidate and **Payload CMS 3.x** as the leading self-hosted/fullstack candidate.

### 4. What the Proof of Concept Actually Proved
[`05_DEPROS_CMS_POC_REPORT.md`](./05_DEPROS_CMS_POC_REPORT.md) validated both candidates experimentally using `janus-bifrous` and three repository image assets:
- **Proven by POC:**
  - Both [`sanityAdapter.ts`](./src/lib/cms-poc/sanity/sanityAdapter.ts) and [`payloadAdapter.ts`](./src/lib/cms-poc/payload/payloadAdapter.ts) cleanly emitted pure `CanonicalPortfolioEntry` objects with **0% vendor type leakage**.
  - Intrinsic dimensions (`714×795`, `595×795`) were preserved with 100% precision, enabling the Framing Engine ([`src/lib/framing.ts`](./src/lib/framing.ts)) to calculate the exact `[[0], [1, 2]]` row grouping deterministically.
  - Relational `Client` entities resolved to standalone `ClientItem` models and project attributions.
  - Draft states were distinguished from published records.
  - Exported JSON reconstructed canonical records with 100% fidelity.

### 5. Remaining Operational & Architectural Differentiators
- **Infrastructure Maintenance:** Sanity requires **zero database or server maintenance** (managed Content Lake). Payload requires provisioning, migrating, and maintaining an external PostgreSQL database and S3-compatible asset bucket.
- **Studio Profile:** DEPROS is an independent brand development and visual design studio. Eliminating database administration while gaining a managed global CDN asset pipeline is a decisive operational advantage.

---

## Part 2 — Final CMS Selection

### Final Selection: **Sanity.io**

```text
┌───────────────────────────────────────────────────────────┐
│                  SANITY CONTENT LAKE                      │
│       • Hosted Structured Content Store (JSON Docs)       │
│       • Automated Asset Pipeline (Dimensions, LQIP, CDN)  │
│       • Embedded Studio UI at /studio                     │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTPS / GROQ Query
                              ▼
┌───────────────────────────────────────────────────────────┐
│                   sanityAdapter.ts                        │
│       • Normalizes Sanity Documents → Canonical Schema    │
│       • Resolves Client References & Intrinsic Dimensions │
│       • Type-Safe Validation (Zero Vendor Type Leakage)   │
└─────────────────────────────┬─────────────────────────────┘
                              │ CanonicalPortfolioEntry[]
                              ▼
┌───────────────────────────────────────────────────────────┐
│                 DEPROS NEXT.JS FRONTEND                   │
│       • Homepage (/), Archive (/work), Detail (/work/:slug)│
│       • ProjectFraming Engine (computeFramingRows)        │
│       • Next.js 15+ ISR Revalidation (revalidateTag)      │
└───────────────────────────────────────────────────────────┘
```

---

## Part 3 — Decision Rationale

### Why Sanity.io Fits DEPROS Architecture & Workflow

1. **Native Media Intelligence & Zero CLS:**
   Sanity’s asset pipeline automatically parses and stores asset metadata (`width`, `height`, `aspectRatio`) upon upload. The DEPROS Framing Engine relies strictly on these dimensions to compute CSS flex-grow weights before images download, completely eliminating Cumulative Layout Shift without manual data entry.
2. **Zero Infrastructure & Maintenance Overhead:**
   Unlike self-hosted CMS solutions, Sanity eliminates database management (Postgres connection pooling, backups, index tuning, security patching) and separate S3 bucket configuration. For a creative studio, this delivers high operational reliability at zero maintenance cost.
3. **Co-Located Next.js 15+ Integration:**
   Sanity Studio can be mounted directly inside the Next.js application at `/studio`, allowing content editing and codebase maintenance within a single repository workflow.
4. **On-Demand Tag Revalidation:**
   Using Next.js `next-sanity` with `revalidateTag('portfolio')`, content updates in Sanity trigger instant incremental static regeneration (ISR) without full site rebuilds.
5. **Sustainable & Risk-Free Free Tier:**
   Sanity's free allowance (500k API CDN requests/mo, 100k API non-CDN requests/mo, 100GB bandwidth, 10GB asset storage) comfortably accommodates the DEPROS portfolio traffic.

### Why Payload CMS Was Not Selected at This Stage
Payload CMS 3.x is an exceptional TypeScript CMS, but requires provisioning and maintaining a persistent PostgreSQL database (e.g. Supabase/Neon) and an S3-compatible cloud bucket (e.g. Cloudflare R2). For DEPROS’s current scale, managing external database infrastructure introduces unnecessary operational friction compared to a fully managed Content Lake.

---

## Part 4 — Target Architecture

```mermaid
graph TD
    subgraph CMS_AUTHORITY["SANITY CONTENT LAKE (Content & Editorial Authority)"]
        A[Project Documents: id, slug, title, category, scope, year]
        B[Client Documents: name, scope, industry, location]
        C[Media Asset Pipeline: uncropped files, dimensions, LQIP]
        D[Editorial Metadata: featured, published, order, framingConfig]
    end

    subgraph ADAPTER_AUTHORITY["SANITY ADAPTER (Validation & Normalization Authority)"]
        E[sanityAdapter.ts: Schema Normalizer]
        F[Client Reference Resolver: client->_id -> ClientItem]
        G[Dimension Extractor: asset.metadata.dimensions -> CanonicalMediaItem]
        H[Compatibility Accessor Builder: image fallback, images[]]
    end

    subgraph FRONTEND_AUTHORITY["DEPROS FRONTEND (Presentation & Behavioral Authority)"]
        I[Homepage /: Curated Featured Subset]
        J[Archive /work: 7-Category Filter & Grid Cards]
        K[Detail /work/:slug: Continuous Loop Traversal]
        L[Framing Engine: computeFramingRows & hairline borders]
        M[Artwork Integrity: object-contain, ratio containers]
    end

    CMS_AUTHORITY -->|Raw GROQ Response via HTTPS| ADAPTER_AUTHORITY
    ADAPTER_AUTHORITY -->|CanonicalPortfolioEntry[] & ClientItem[]| FRONTEND_AUTHORITY
```

### Separation of Responsibilities

| System Layer | Owns & Manages | Explicitly Does NOT Own |
|---|---|---|
| **Sanity Content Lake** | Content copy, client entities, master assets, alt text, captions, featured flags, published flags, sort orders, optional framing overrides. | Layout HTML, CSS styles, typography, responsive breakpoints, image framing mathematics. |
| **Sanity Adapter** | Data normalization, type narrowing, reference expansion, dimension calculation, fallback synthesis, draft filtering. | UI rendering, component logic, state management. |
| **DEPROS Frontend** | Design tokens, typography, grid rendering, `computeFramingRows()`, aspect ratios, route handlers, category filtering, circular navigation, SEO metadata. | Storing hardcoded project copy or authoritative metadata. |

---

## Part 5 — Selected CMS Schema (Sanity Implementation Schema)

### 1. Project Document Schema (`schemaTypes/project.ts`)

```typescript
import { defineType, defineField } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Portfolio Project",
  type: "document",
  fieldsets: [
    { name: "framing", title: "Presentation Framing Override", options: { collapsible: true, collapsed: true } },
    { name: "provenance", title: "Source Deck Provenance", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Descriptor",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Semantic Category",
      type: "string",
      options: {
        list: [
          { title: "Product Design", value: "product-design" },
          { title: "Brand Identity", value: "brand-identity" },
          { title: "Logos", value: "logos" },
          { title: "Corporate Identity", value: "corporate-identity" },
          { title: "Marketing Kit", value: "marketing-kit" },
          { title: "Graphic & Visual", value: "graphic-visual" },
          { title: "Social Media Content", value: "social-media-content" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "presentationType",
      title: "Presentation Type",
      type: "string",
      options: {
        list: [
          { title: "Standalone Project Presentation", value: "standalone" },
          { title: "Grouped / Showcase Presentation", value: "grouped" },
        ],
        layout: "radio",
      },
      initialValue: "standalone",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentSubtype",
      title: "Content Subtype",
      type: "string",
      options: {
        list: [
          { title: "Marketing Kit", value: "marketing-kit" },
          { title: "Sales Tools", value: "sales-tools" },
        ],
      },
      hidden: ({ document }) => document?.category !== "marketing-kit",
    }),
    defineField({
      name: "client",
      title: "Client Entity",
      type: "reference",
      to: [{ type: "client" }],
    }),
    defineField({
      name: "clientDisplayName",
      title: "Client Display Name Override",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Project Narrative",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "scope",
      title: "Scope of Work (Deliverables)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "year",
      title: "Release Year",
      type: "string",
    }),
    defineField({
      name: "media",
      title: "Visual Assets (Ordered)",
      type: "array",
      of: [{ type: "projectMedia" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "published",
      title: "Published (Visible in Archive)",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Editorial Sorting Priority",
      type: "number",
    }),
    defineField({
      name: "framingConfig",
      title: "Framing Configuration",
      type: "object",
      fieldset: "framing",
      fields: [
        {
          name: "layoutMode",
          title: "Layout Mode",
          type: "string",
          options: { list: ["auto", "editorial"], layout: "radio" },
          initialValue: "auto",
        },
        {
          name: "editorialRows",
          title: "Editorial Rows (JSON string e.g. [[0], [1, 2]])",
          type: "string",
        },
        {
          name: "gap",
          title: "Border Gap",
          type: "string",
          options: { list: ["hairline", "sm", "md", "none"] },
          initialValue: "hairline",
        },
        {
          name: "mobileStack",
          title: "Stack on Mobile",
          type: "boolean",
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: "provenance",
      title: "Source Deck Provenance",
      type: "object",
      fieldset: "provenance",
      readOnly: true,
      fields: [
        { name: "sourceDocument", title: "Source Document", type: "string" },
        { name: "sourcePage", title: "Source Page Number", type: "number" },
        { name: "sourceCategory", title: "Deck Category Heading", type: "string" },
        { name: "sourceTitle", title: "Deck Project Title", type: "string" },
        { name: "sourceSubtitle", title: "Deck Subtitle", type: "string" },
        { name: "sourceClient", title: "Deck Client Attribution", type: "string" },
      ],
    }),
  ],
});
```

### 2. Client Document Schema (`schemaTypes/client.ts`)

```typescript
import { defineType, defineField } from "sanity";

export const clientType = defineType({
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "scope",
      title: "Scope of Work",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
```

### 3. Project Media Object Schema (`schemaTypes/projectMedia.ts`)

```typescript
import { defineType, defineField } from "sanity";

export const projectMediaType = defineType({
  name: "projectMedia",
  title: "Project Media Item",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Image Asset",
      type: "image",
      options: { hotspot: false },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative Text (Accessibility)",
      type: "string",
      validation: (Rule) => Rule.required().warning("Descriptive alt text is required."),
    }),
    defineField({
      name: "role",
      title: "Visual Role",
      type: "string",
      options: {
        list: [
          { title: "Primary (Hero / Archive Card)", value: "primary" },
          { title: "Detail (Macro / Texture / Badge)", value: "detail" },
          { title: "Supporting (Lifestyle / Angle)", value: "supporting" },
          { title: "Composite (Panoramic / Board)", value: "composite" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
});
```

---

## Part 6 — Adapter Contract (`sanityAdapter.ts`)

The adapter is the sole gatekeeper transforming raw Sanity GROQ responses into strict [`CanonicalPortfolioEntry`](file:///Users/yudhan/Documents/FRAMEWORKS/DEPROS/src/lib/types.ts) structures:

```typescript
// Location: src/lib/cms/sanityAdapter.ts
import { CanonicalPortfolioEntry, CanonicalMediaItem, ClientItem } from "@/lib/types";

export function normalizeSanityMedia(item: any): CanonicalMediaItem {
  const dims = item.asset?.metadata?.dimensions;
  const width = dims?.width || 1200;
  const height = dims?.height || 800;
  const aspectRatio = dims?.aspectRatio || width / height;

  let orientation: CanonicalMediaItem["orientation"] = "landscape";
  if (aspectRatio > 2.0) orientation = "panoramic";
  else if (aspectRatio >= 1.15) orientation = "landscape";
  else if (aspectRatio <= 0.88) orientation = "portrait";
  else orientation = "square";

  return {
    src: item.asset?.url || "",
    alt: item.alt || "DEPROS portfolio artwork",
    width,
    height,
    aspectRatio,
    orientation,
    role: item.role || "primary",
    caption: item.caption,
  };
}

export function adaptSanityClient(doc: any): ClientItem {
  return {
    id: doc._id.replace(/^client-/, ""),
    name: doc.name,
    scope: doc.scope,
    industry: doc.industry,
    location: doc.location,
  };
}

export function adaptSanityProject(doc: any): CanonicalPortfolioEntry {
  if (!doc.title || !doc.slug?.current || !doc.category) {
    throw new Error(`Sanity document validation error: missing title, slug, or category in ${doc._id}`);
  }

  const media = (doc.media || []).map(normalizeSanityMedia);
  const primaryMedia = media.find((m: any) => m.role === "primary" || m.role === "composite") || media[0];

  let clientName: string | undefined;
  if (doc.client && typeof doc.client === "object" && "name" in doc.client) {
    clientName = doc.client.name;
  }

  let editorialRows: number[][] | undefined = doc.framingConfig?.editorialRows;
  if (typeof editorialRows === "string") {
    try {
      editorialRows = JSON.parse(editorialRows);
    } catch {
      editorialRows = undefined;
    }
  }

  return {
    id: doc._id.replace(/^project-/, "").replace(/^drafts\./, ""),
    slug: doc.slug.current,
    title: doc.title,
    subtitle: doc.subtitle,
    category: doc.category,
    categorySlug: doc.category,
    presentationType: doc.presentationType || "standalone",
    contentSubtype: doc.contentSubtype,
    client: clientName,
    clientDisplayName: doc.clientDisplayName || clientName,
    description: doc.description,
    scope: doc.scope,
    year: doc.year,
    media,
    images: media,
    image: primaryMedia?.src || "",
    featured: Boolean(doc.featured),
    published: doc.published !== false && !doc._id.startsWith("drafts."),
    order: doc.order,
    framingConfig: doc.framingConfig
      ? {
          layoutMode: doc.framingConfig.layoutMode || "auto",
          mode: doc.framingConfig.layoutMode || "auto",
          editorialRows,
          gap: doc.framingConfig.gap || "hairline",
          mobileStack: doc.framingConfig.mobileStack !== false,
        }
      : undefined,
    provenance: doc.provenance,
  };
}
```

---

## Part 7 — Step-by-Step Migration Plan

```text
Phase A: Sanity Project & Environment Setup
   ↓
Phase B: Schema Definition & Studio Mounting (/studio)
   ↓
Phase C: Data Adapter Implementation & Query Layer
   ↓
Phase D: First-Project Pilot Migration (janus-bifrous)
   ↓
Phase E: Visual & Framing Parity Verification
   ↓
Phase F: Full 16-Project Catalog & Client Migration
   ↓
Phase G: Production Data-Source Cutover
   ↓
Phase H: Verification & Legacy Cleanup
```

### Phase Details & Rollback Boundaries

| Phase | Objective | Files Affected | Verification Criteria | Rollback Point |
|---|---|---|---|---|
| **Phase A: Setup** | Initialize Sanity project ID, dataset, API tokens, and env vars. | `.env.local`, `next.config.mjs` | Sanity client initializes without errors. | Delete `.env.local` keys. |
| **Phase B: Schema** | Implement schema types and mount Sanity Studio at `/studio`. | `src/lib/cms/sanity/schemaTypes/*`, `src/app/studio/[[...tool]]/page.tsx` | Studio loads at `/studio` in development. | Remove `/app/studio` route. |
| **Phase C: Adapter** | Implement `sanityAdapter.ts`, client queries, and Zod validator. | `src/lib/cms/sanityAdapter.ts`, `src/lib/cms/queries.ts` | Test harness passes with live client mock. | Delete adapter file. |
| **Phase D: Pilot** | Migrate `janus-bifrous` metadata and 3 image assets into Sanity. | Sanity Content Lake | Document published and queryable via GROQ. | Delete draft/published doc in Sanity. |
| **Phase E: Parity** | Compare live rendered `janus-bifrous` against local canonical data. | Local test page / harness | Exact visual match, identical aspect ratios, 0 CLS. | Revert test page. |
| **Phase F: Full Load** | Script bulk upload of remaining 15 projects and 12 clients from `src/lib/data.ts`. | Sanity Content Lake | 16 projects and 12 clients visible in Studio. | Flush Sanity dataset. |
| **Phase G: Cutover** | Point `getPortfolioEntries()` to Sanity fetch with ISR fallback. | `src/app/page.tsx`, `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx` | Full site builds with 21 static routes via CMS. | Revert imports back to `src/lib/data.ts`. |
| **Phase H: Cleanup** | Deprecate local `CANONICAL_PORTFOLIO_ENTRIES` after 14-day bake period. | `src/lib/data.ts` | Production running cleanly on Sanity with local fallback. | Restore from git history. |

---

## Part 8 — First Migration Candidate: `janus-bifrous`

The first project to be migrated to Sanity will be **`janus-bifrous`**:

### Migration Payload Specification
- **Title:** `"JANUS BIFROUS"`
- **Slug:** `"janus-bifrous"`
- **Subtitle:** `"Artisan Beer"`
- **Category:** `"product-design"`
- **Presentation Type:** `"standalone"`
- **Client Document:** `"Locale Brewery"` (`scope: "Brand Development & Packaging"`, `industry: "Brewery / Hospitality"`, `location: "Bali, Indonesia"`)
- **Description:** `"A dual-faced artisan beer packaging design exploring symmetry, mythology, and botanical textures. Built with tactile label materials and bespoke heraldic illustration."`
- **Scope:** `["Label Design", "Illustration", "Print Production", "Brand Identity"]`
- **Year:** `"2024"`
- **Media Uploads:**
  1. `bottle-left.png` → Asset Upload → `role: "primary"`, `alt: "JANUS BIFROUS - Bottle Front View on Warm Beige"`
  2. `circle-detail.png` → Asset Upload → `role: "detail"`, `alt: "JANUS BIFROUS - Brand Identity Emblem & Geometric Detail"`, `caption: "Bespoke heraldic badge and geometric embossing."`
  3. `bottle-right.png` → Asset Upload → `role: "supporting"`, `alt: "JANUS BIFROUS - Bottle Angled View on Obsidian Black"`
- **Framing Config:** `{ layoutMode: "editorial", editorialRows: "[[0], [1, 2]]", gap: "hairline", mobileStack: true }`
- **Featured:** `true` | **Published:** `true` | **Order:** `1`

### Parity Verification Criteria
1. `adapter.adaptSanityProject(doc)` must produce an object deep-equal in canonical properties to `CANONICAL_PORTFOLIO_ENTRIES[0]`.
2. `computeFramingRows()` output must be identical: Row 1 = 1 col `[0]`, Row 2 = 2 cols `[1, 2]`.
3. Image aspect ratios in the browser must resolve to `714 / 795` and `595 / 795`.

---

## Part 9 — Media Strategy

1. **Uncropped Master Preservation:**
   - Master PNG and JPEG assets extracted from the DEPROS deck are uploaded directly to Sanity without client-side downsampling or destructive cropping.
2. **Dimension Extraction:**
   - Sanity automatically computes and stores intrinsic dimensions upon upload.
3. **CDN Delivery:**
   - Assets are delivered via `https://cdn.sanity.io/images/...` with automated WebP/AVIF format negotiation.
4. **Artwork Integrity Rule:**
   - Frontend Next.js `<Image fill className="object-contain object-center" />` inside ratio-locked CSS containers ensures zero artwork cropping or warping.
5. **Asset Transition Policy:**
   - Legacy assets in `/public/images/projects/` will remain in the repository throughout Phases A–G as a zero-risk fallback, and will only be safely archived after production cutover is verified.

---

## Part 10 — Publishing, Preview & Revalidation

```text
Editor edits in Sanity Studio (/studio)
                 ↓
Hits "Publish" in Sanity
                 ↓
Sanity Webhook sends HTTPS POST to Next.js /api/revalidate
                 ↓
Next.js verifies Webhook HMAC Signature (SANITY_REVALIDATE_SECRET)
                 ↓
Next.js executes revalidateTag('portfolio')
                 ↓
Next.js on-demand ISR regenerates affected static routes in background
```

### Draft Preview Workflow
- When editors click "Preview" or browse `/api/draft?secret=...&slug=janus-bifrous`, Next.js enables `draftMode()`.
- Server Components detect `draftMode().isEnabled` and query Sanity with a draft read token (`perspective: "previewDrafts"`), rendering live unpublished changes in real time.

---

## Part 11 — Environment & Deployment Contract

### Environment Variables Required

| Variable Name | Environment | Purpose | Security Level |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Client & Server | Sanity Project ID identifier | Public |
| `NEXT_PUBLIC_SANITY_DATASET` | Client & Server | Dataset name (`"production"`) | Public |
| `NEXT_PUBLIC_SANITY_API_VERSION`| Client & Server | API date pin (e.g. `"2026-10-01"`) | Public |
| `SANITY_API_READ_TOKEN` | Server Only | Token for draft preview queries | **Private / Secret** |
| `SANITY_REVALIDATE_SECRET` | Server Only | HMAC shared secret for webhook validation | **Private / Secret** |

### Security Rules
- Privileged tokens (`SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`) must never be prefixed with `NEXT_PUBLIC_` and must only be accessed within Server Components or Route Handlers.

---

## Part 12 — Rollback Strategy

The DEPROS CMS integration preserves a **zero-downtime rollback path**:

```typescript
// Data Access Layer with Safe Fallback
export async function getPortfolioEntries(): Promise<CanonicalPortfolioEntry[]> {
  if (process.env.ENABLE_SANITY_CMS === "true") {
    try {
      const sanityData = await fetchSanityProjects();
      if (sanityData && sanityData.length > 0) {
        return sanityData.map(adaptSanityProject);
      }
    } catch (error) {
      console.error("Sanity fetch failed; falling back to local canonical data", error);
    }
  }
  // Safe Fallback: Local Canonical Dataset
  return CANONICAL_PORTFOLIO_ENTRIES;
}
```

1. If Sanity experiences an outage or migration failure, setting `ENABLE_SANITY_CMS=false` instantly restores local data from [`src/lib/data.ts`](file:///Users/yudhan/Documents/FRAMEWORKS/DEPROS/src/lib/data.ts).
2. Because frontend components depend exclusively on `CanonicalPortfolioEntry`, swapping the data source requires zero component changes.

---

## Part 13 — Implementation Roadmap

```text
Phase CMS-05: Sanity Project Initialization & Schema Setup
  Scope: Install next-sanity, configure sanity.config.ts, implement project/client schemas.

Phase CMS-06: Sanity Data Adapter & Query Layer
  Scope: Implement sanityAdapter.ts, GROQ queries, and Zod/TypeScript contract validator.

Phase CMS-07: Revalidation Webhook & Draft Mode Preview
  Scope: Implement /api/revalidate and /api/draft endpoints with tag revalidation.

Phase CMS-08: First Project Migration (janus-bifrous)
  Scope: Seed janus-bifrous and verify visual parity on /work/janus-bifrous.

Phase CMS-09: Full 16-Project Catalog Migration
  Scope: Bulk migration script for all 16 canonical records and 12 clients.

Phase CMS-10: Production Cutover
  Scope: Switch Homepage and Archive data fetching to Sanity with ISR fallback.

Phase CMS-11: Post-Cutover Audit & Legacy Asset Cleanup
  Scope: Final regression audit, framing verification, and legacy asset cleanup.
```

---

## Part 14 — Definition of Done

CMS integration is complete only when all of the following are verified:

1. [ ] **Authoritative CMS:** Sanity Content Lake serves all 16 portfolio presentation units and 12 clients.
2. [ ] **Adapter Validation:** `sanityAdapter.ts` normalizes all records to `CanonicalPortfolioEntry` with 0 type leakage.
3. [ ] **Visual Parity:** Homepage, Archive, and all 16 Detail pages render identically to the static baseline.
4. [ ] **Framing Integrity:** `computeFramingRows()` executes with zero layout anomalies or CLS.
5. [ ] **Artwork Integrity:** Master assets render uncropped via `object-contain`.
6. [ ] **Filtering & Navigation:** Category filtering on `/work` and circular next/prev looping on `/work/[slug]` work seamlessly.
7. [ ] **Draft Preview:** Editors can stage and preview unpublished drafts via Next.js Draft Mode.
8. [ ] **On-Demand ISR:** Webhook triggers `revalidateTag('portfolio')` and regenerates pages within 1 second of publishing.
9. [ ] **Rollback Verified:** Local dataset fallback functions properly when CMS toggle is disabled.
10. [ ] **Build Cleanliness:** `npm run build` succeeds with 0 TypeScript or build errors.

---

## Part 15 — Final Decision Record (ADR)

### Architectural Decision Record

- **Decision:** Select **Sanity.io** as the Headless CMS provider for the DEPROS portfolio website.
- **Status:** **APPROVED FOR IMPLEMENTATION**
- **Rationale:**  
  Sanity satisfies 100% of the DEPROS CMS Architecture Contract ([`03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md`](./03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md)). It delivers automated image dimension extraction essential for DEPROS's Framing Engine, native Next.js 15+ App Router ISR revalidation, co-located studio editing at `/studio`, and a zero-maintenance managed Content Lake backed by a generous free tier.
- **Trade-offs Accepted:**  
  Data resides in Sanity's Content Lake rather than a local SQL database. Mitigated by one-command JSON export capabilities and a zero-downtime local dataset fallback.
- **Known Risks & Mitigations:**  
  - *Risk:* API network latency during SSG builds.  
    *Mitigation:* Next.js static page generation and on-demand ISR cache responses permanently until revalidation webhooks fire.
  - *Risk:* CMS schema drift.  
    *Mitigation:* `sanityAdapter.ts` enforces strict validation before records reach frontend components.
- **Next Phase:** **CMS-05 — Sanity Project Initialization & Schema Setup**
