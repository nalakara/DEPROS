/**
 * Payload CMS 3.x Collection Schema Definitions
 * Declarative collection configurations strictly modeling 03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md
 */

export const payloadClientsCollection = {
  slug: "clients",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "scope", type: "text", required: true },
    { name: "industry", type: "text", required: true },
    { name: "location", type: "text", required: true },
  ],
};

export const payloadMediaCollection = {
  slug: "media",
  upload: {
    staticDir: "public/images/uploads",
    imageSizes: [],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/png", "image/jpeg", "image/webp"],
  },
  fields: [
    { name: "alt", type: "text", required: true },
  ],
};

export const payloadProjectsCollection = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "published", "order"],
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    { name: "subtitle", type: "text" },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Product Design", value: "product-design" },
        { label: "Brand Identity", value: "brand-identity" },
        { label: "Logos", value: "logos" },
        { label: "Corporate Identity", value: "corporate-identity" },
        { label: "Marketing Kit", value: "marketing-kit" },
        { label: "Graphic & Visual", value: "graphic-visual" },
        { label: "Social Media Content", value: "social-media-content" },
      ],
    },
    {
      name: "presentationType",
      type: "radio",
      required: true,
      defaultValue: "standalone",
      options: [
        { label: "Standalone Project", value: "standalone" },
        { label: "Grouped / Showcase", value: "grouped" },
      ],
    },
    {
      name: "contentSubtype",
      type: "select",
      options: [
        { label: "Marketing Kit", value: "marketing-kit" },
        { label: "Sales Tools", value: "sales-tools" },
      ],
    },
    {
      name: "client",
      type: "relationship",
      relationTo: "clients",
      hasMany: false,
    },
    { name: "clientDisplayName", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "scope",
      type: "array",
      fields: [{ name: "item", type: "text", required: true }],
    },
    { name: "year", type: "text" },
    {
      name: "media",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "asset",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        { name: "alt", type: "text", required: true },
        {
          name: "role",
          type: "radio",
          required: true,
          defaultValue: "primary",
          options: [
            { label: "Primary (Hero / Card)", value: "primary" },
            { label: "Detail (Macro / Texture)", value: "detail" },
            { label: "Supporting (Lifestyle)", value: "supporting" },
            { label: "Composite (Board)", value: "composite" },
          ],
        },
        { name: "caption", type: "text" },
      ],
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "published", type: "checkbox", defaultValue: true },
    { name: "order", type: "number" },
    {
      name: "framingConfig",
      type: "group",
      admin: {
        description: "Presentation Framing Configuration",
      },
      fields: [
        {
          name: "layoutMode",
          type: "select",
          defaultValue: "auto",
          options: ["auto", "editorial"],
        },
        { name: "editorialRows", type: "text", admin: { description: "e.g. [[0], [1, 2]]" } },
        {
          name: "gap",
          type: "select",
          defaultValue: "hairline",
          options: ["hairline", "sm", "md", "none"],
        },
        { name: "mobileStack", type: "checkbox", defaultValue: true },
      ],
    },
    {
      name: "provenance",
      type: "group",
      admin: {
        readOnly: true,
        description: "Source Deck Provenance",
      },
      fields: [
        { name: "sourceDocument", type: "text" },
        { name: "sourcePage", type: "number" },
        { name: "sourceCategory", type: "text" },
        { name: "sourceTitle", type: "text" },
        { name: "sourceSubtitle", type: "text" },
        { name: "sourceClient", type: "text" },
      ],
    },
  ],
};
