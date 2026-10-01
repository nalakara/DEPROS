export type ProjectCategory =
  | "01 / PRODUCT DESIGN"
  | "02 / BRAND IDENTITY"
  | "03 / LOGOS"
  | "04 / CORPORATE IDENTITY"
  | "05 / MARKETING KIT"
  | "06 / GRAPHIC & VISUAL"
  | "07 / SOCIAL MEDIA CONTENT";

export interface Project {
  id: string;
  number: string; // e.g. "01"
  title: string; // e.g. "JANUS BIFROUS"
  subtitle: string; // e.g. "Herbs Liqueur"
  category: ProjectCategory;
  categorySlug: string;
  client: string; // e.g. "LOCALE BREWERY"
  description: string;
  image: string; // path in public/images/projects/
  secondaryImage?: string;
  year: string;
  scope: string[];
  featured: boolean;
}

export interface ClientItem {
  id: string;
  name: string;
  scope: string;
  industry: string;
  location: string;
}
