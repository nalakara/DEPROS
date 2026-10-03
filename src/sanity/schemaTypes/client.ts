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
      description: "Official client or brand name (e.g. Locale Brewery, Westin Nusa Dua).",
      validation: (Rule) => Rule.required().error("Client name is required."),
    }),
    defineField({
      name: "scope",
      title: "Scope of Work",
      type: "string",
      description: "Brief scope summary (e.g. Logo & collateral redesign, Brand Strategy).",
      validation: (Rule) => Rule.required().error("Scope of work is required."),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      description: "Industry sector (e.g. Hospitality, Property, Beverage).",
      validation: (Rule) => Rule.required().error("Industry is required."),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Geographic location (e.g. Nusa Dua, Bali, Batam Island).",
      validation: (Rule) => Rule.required().error("Location is required."),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "industry",
      description: "location",
    },
  },
});
