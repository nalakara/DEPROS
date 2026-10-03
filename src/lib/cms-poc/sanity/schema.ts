/**
 * Sanity Schema Definition Prototype
 * Declarative schema definitions strictly modeling 03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md
 */

export const sanityClientSchema = {
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    { name: "name", title: "Client Name", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "scope", title: "Scope of Work", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "industry", title: "Industry", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "location", title: "Location", type: "string", validation: (Rule: any) => Rule.required() },
  ],
};

export const sanityProjectMediaSchema = {
  name: "projectMedia",
  title: "Project Media Item",
  type: "object",
  fields: [
    {
      name: "asset",
      title: "Image Asset",
      type: "image",
      options: { hotspot: false },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "alt",
      title: "Alternative Text",
      type: "string",
      validation: (Rule: any) => Rule.required().warning("Descriptive alt text is required for accessibility."),
    },
    {
      name: "role",
      title: "Visual Role",
      type: "string",
      options: {
        list: [
          { title: "Primary (Hero / Archive Card)", value: "primary" },
          { title: "Detail (Macro / Texture / Badge)", value: "detail" },
          { title: "Supporting (Lifestyle / Secondary Angle)", value: "supporting" },
          { title: "Composite (Panoramic / Full Board)", value: "composite" },
        ],
        layout: "radio",
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "caption",
      title: "Caption",
      type: "string",
    },
  ],
};

export const sanityProjectSchema = {
  name: "project",
  title: "Portfolio Project",
  type: "document",
  fieldsets: [
    { name: "framing", title: "Presentation Framing Configuration", options: { collapsible: true, collapsed: true } },
    { name: "provenance", title: "Source Deck Provenance (Read-Only)", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    { name: "title", title: "Project Title", type: "string", validation: (Rule: any) => Rule.required() },
    {
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    { name: "subtitle", title: "Subtitle / Descriptor", type: "string" },
    {
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
      validation: (Rule: any) => Rule.required(),
    },
    {
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
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "contentSubtype",
      title: "Content Subtype",
      type: "string",
      options: {
        list: [
          { title: "Marketing Kit", value: "marketing-kit" },
          { title: "Sales Tools", value: "sales-tools" },
        ],
      },
      hidden: ({ document }: any) => document?.category !== "marketing-kit",
    },
    {
      name: "client",
      title: "Client",
      type: "reference",
      to: [{ type: "client" }],
    },
    { name: "clientDisplayName", title: "Client Display Name Override", type: "string" },
    { name: "description", title: "Project Narrative", type: "text", rows: 4 },
    { name: "scope", title: "Scope of Work", type: "array", of: [{ type: "string" }] },
    { name: "year", title: "Release Year", type: "string" },
    {
      name: "media",
      title: "Visual Assets",
      type: "array",
      of: [{ type: "projectMedia" }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    { name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: false },
    { name: "published", title: "Published", type: "boolean", initialValue: true },
    { name: "order", title: "Editorial Sorting Priority", type: "number" },
    {
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
          title: "Editorial Rows (JSON)",
          type: "string",
          description: "Optional array of image indexes per row, e.g. [[0], [1, 2]]",
        },
        {
          name: "gap",
          title: "Border Gap",
          type: "string",
          options: { list: ["hairline", "sm", "md", "none"] },
          initialValue: "hairline",
        },
        { name: "mobileStack", title: "Stack on Mobile", type: "boolean", initialValue: true },
      ],
    },
    {
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
    },
  ],
};
