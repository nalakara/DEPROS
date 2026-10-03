import { defineType, defineField } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Portfolio Project",
  type: "document",
  fieldsets: [
    {
      name: "editorialMetadata",
      title: "Editorial & Publication Controls",
      options: { columns: 3 },
    },
    {
      name: "framing",
      title: "Presentation Framing Configuration",
      description: "Optional editorial override for ProjectFraming layout engine.",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "provenance",
      title: "Source Deck Provenance (Read-Only)",
      description: "Historical traceability back to PF DEPROS 2026_B.pdf source deck.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // ── IDENTITY & CORE CLASSIFICATION ─────────────────────────────
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      description: "Canonical project title (e.g. JANUS BIFROUS, COCO FLAMINGO).",
      validation: (Rule) => Rule.required().error("Project title is required."),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "URL routing path identifier (/work/[slug]).",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required().error("URL slug is required."),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Descriptor",
      type: "string",
      description: "Short verified product descriptor (e.g. Artisan Beer, Summer Pale Ale).",
    }),
    defineField({
      name: "category",
      title: "Semantic Category",
      type: "string",
      description: "One of the 7 canonical DEPROS semantic categories.",
      options: {
        list: [
          { title: "01 / Product Design", value: "product-design" },
          { title: "02 / Brand Identity", value: "brand-identity" },
          { title: "03 / Logos", value: "logos" },
          { title: "04 / Corporate Identity", value: "corporate-identity" },
          { title: "05 / Marketing Kit", value: "marketing-kit" },
          { title: "06 / Graphic & Visual", value: "graphic-visual" },
          { title: "07 / Social Media Content", value: "social-media-content" },
        ],
      },
      validation: (Rule) => Rule.required().error("Category is required."),
    }),
    defineField({
      name: "presentationType",
      title: "Presentation Type",
      type: "string",
      description: "Presentation structure format.",
      options: {
        list: [
          { title: "Standalone Project Presentation", value: "standalone" },
          { title: "Grouped / Showcase Presentation", value: "grouped" },
        ],
        layout: "radio",
      },
      initialValue: "standalone",
      validation: (Rule) => Rule.required().error("Presentation type is required."),
    }),
    defineField({
      name: "contentSubtype",
      title: "Content Subtype",
      type: "string",
      description: "Optional semantic subtype for marketing materials.",
      options: {
        list: [
          { title: "Marketing Kit", value: "marketing-kit" },
          { title: "Sales Tools", value: "sales-tools" },
        ],
        layout: "radio",
      },
      hidden: ({ document }) => document?.category !== "marketing-kit",
    }),

    // ── CLIENT ATTRIBUTION ─────────────────────────────────────────
    defineField({
      name: "client",
      title: "Client Entity",
      type: "reference",
      to: [{ type: "client" }],
      description: "Reference to the standalone Client document.",
    }),
    defineField({
      name: "clientDisplayName",
      title: "Client Display Name Override",
      type: "string",
      description: "Optional formatted display override if distinct from client document name.",
    }),

    // ── NARRATIVE & METADATA ───────────────────────────────────────
    defineField({
      name: "description",
      title: "Project Narrative & Pitch",
      type: "text",
      rows: 4,
      description: "Curated project concept summary and design rationale.",
    }),
    defineField({
      name: "scope",
      title: "Scope of Work (Disciplines)",
      type: "array",
      of: [{ type: "string" }],
      description: "List of deliverables and services (e.g. Label Design, Illustration).",
    }),
    defineField({
      name: "year",
      title: "Release Year",
      type: "string",
      description: "4-digit year (e.g. 2024).",
      validation: (Rule) =>
        Rule.regex(/^\d{4}$/, { name: "year", invert: false }).warning(
          "Year should be a 4-digit number."
        ),
    }),

    // ── MEDIA ASSETS ───────────────────────────────────────────────
    defineField({
      name: "media",
      title: "Visual Assets Collection",
      type: "array",
      of: [{ type: "projectMedia" }],
      description: "Ordered visual assets. The first primary asset will serve as the Archive Card cover.",
      validation: (Rule) =>
        Rule.required().min(1).error("At least one visual asset is required."),
    }),

    // ── EDITORIAL & PUBLISHING CONTROLS ────────────────────────────
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      description: "When enabled, project appears in the Homepage Selected Work showcase.",
      fieldset: "editorialMetadata",
      initialValue: false,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "When enabled, project is visible in the public /work archive.",
      fieldset: "editorialMetadata",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Editorial Sort Order",
      type: "number",
      description: "Numeric sort priority (lower numbers appear first).",
      fieldset: "editorialMetadata",
    }),

    // ── FRAMING CONFIGURATION (OPTIONAL OVERRIDE) ───────────────────
    defineField({
      name: "framingConfig",
      title: "Framing Configuration",
      type: "object",
      fieldset: "framing",
      fields: [
        defineField({
          name: "layoutMode",
          title: "Layout Mode",
          type: "string",
          options: {
            list: [
              { title: "Auto (Deterministic count & aspect ratio engine)", value: "auto" },
              { title: "Editorial (Explicit row groupings override)", value: "editorial" },
            ],
            layout: "radio",
          },
          initialValue: "auto",
        }),
        defineField({
          name: "editorialRows",
          title: "Editorial Rows (JSON)",
          type: "string",
          description: "Optional array of image index groups per row, e.g. [[0], [1, 2]]",
        }),
        defineField({
          name: "gap",
          title: "Border Gap Token",
          type: "string",
          options: {
            list: [
              { title: "Hairline (Default hairline border)", value: "hairline" },
              { title: "Small (gap-1 / sm:gap-1.5)", value: "sm" },
              { title: "Medium (gap-2 / sm:gap-3)", value: "md" },
              { title: "None (gap-0)", value: "none" },
            ],
          },
          initialValue: "hairline",
        }),
        defineField({
          name: "mobileStack",
          title: "Stack Rows on Mobile",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),

    // ── SOURCE PROVENANCE (READ-ONLY AUDIT) ─────────────────────────
    defineField({
      name: "provenance",
      title: "Source Deck Provenance",
      type: "object",
      fieldset: "provenance",
      readOnly: true,
      fields: [
        defineField({ name: "sourceDocument", title: "Source Document", type: "string" }),
        defineField({ name: "sourcePage", title: "Source Page", type: "number" }),
        defineField({ name: "sourceCategory", title: "Source Category Heading", type: "string" }),
        defineField({ name: "sourceTitle", title: "Source Title", type: "string" }),
        defineField({ name: "sourceSubtitle", title: "Source Subtitle", type: "string" }),
        defineField({ name: "sourceClient", title: "Source Client", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "media.0.asset",
      featured: "featured",
      published: "published",
    },
    prepare({ title, subtitle, media, featured, published }) {
      const statusFlags = [
        featured ? "★ Featured" : null,
        published === false ? "🔒 Draft" : null,
      ]
        .filter(Boolean)
        .join(" · ");

      return {
        title: title || "Untitled Project",
        subtitle: [subtitle, statusFlags].filter(Boolean).join(" | "),
        media,
      };
    },
  },
});
