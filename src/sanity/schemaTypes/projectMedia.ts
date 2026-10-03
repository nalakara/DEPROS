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
      description: "High-resolution master artwork asset (PNG, JPG, WebP).",
      options: {
        hotspot: false,
      },
      validation: (Rule) => Rule.required().error("Image asset is required."),
    }),
    defineField({
      name: "alt",
      title: "Alternative Text (Accessibility)",
      type: "string",
      description: "Descriptive alt text for screen readers and search engines.",
      validation: (Rule) =>
        Rule.required()
          .min(5)
          .warning("Descriptive alt text is strongly recommended for accessibility."),
    }),
    defineField({
      name: "role",
      title: "Visual Role",
      type: "string",
      description: "Semantic presentation role within the framing system.",
      options: {
        list: [
          { title: "Primary (Hero / Archive Card)", value: "primary" },
          { title: "Detail (Macro Texture / Badge / Typographic)", value: "detail" },
          { title: "Supporting (Lifestyle / Secondary Angle)", value: "supporting" },
          { title: "Composite (Panoramic / Full Visual Board)", value: "composite" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
      validation: (Rule) => Rule.required().error("Visual role is required."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional editorial caption or specification footnote.",
    }),
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "role",
      media: "asset",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Media Item",
        subtitle: subtitle ? `Role: ${subtitle}` : "No role specified",
        media,
      };
    },
  },
});
