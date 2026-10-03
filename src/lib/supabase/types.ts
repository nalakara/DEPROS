import {
  CanonicalPortfolioEntry,
  CanonicalMediaItem,
  ClientItem,
  SemanticCategoryId,
  PresentationType,
  ContentSubtype,
  MediaRole,
  MediaOrientation,
  FramingConfig,
  SourceProvenance,
} from "@/lib/types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Raw PostgreSQL row structure for the 'clients' table.
 */
export interface DatabaseClientRow {
  id: string; // UUID
  slug: string;
  name: string;
  scope: string | null;
  industry: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Raw PostgreSQL row structure for the 'projects' table.
 */
export interface DatabaseProjectRow {
  id: string; // UUID
  slug: string;
  title: string;
  subtitle: string | null;
  category: SemanticCategoryId;
  presentation_type: PresentationType;
  content_subtype: ContentSubtype | null;
  client_id: string | null;
  client_display_name: string | null;
  description: string | null;
  scope: string[] | null;
  year: string | null;
  featured: boolean;
  status: "draft" | "published" | "archived";
  display_order: number;
  framing_config: FramingConfig | null;
  provenance: SourceProvenance | null;
  created_at: string;
  updated_at: string;
}

/**
 * Raw PostgreSQL row structure for the 'project_media' table.
 */
export interface DatabaseProjectMediaRow {
  id: string; // UUID
  project_id: string;
  src: string;
  alt: string;
  role: MediaRole;
  width: number;
  height: number;
  aspect_ratio: number | string;
  orientation: MediaOrientation;
  caption: string | null;
  display_order: number;
  created_at: string;
}

/**
 * Full joined Project DTO returned by Supabase queries with relations:
 * - includes nested project_media
 * - includes joined client entity
 */
export interface SupabaseProjectDTO extends DatabaseProjectRow {
  media?: DatabaseProjectMediaRow[];
  client?: DatabaseClientRow | null;
}

/**
 * Database schema definition mapping for Supabase client typing.
 */
export type Database = {
  public: {
    Tables: {
      clients: {
        Row: DatabaseClientRow;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          scope?: string | null;
          industry?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          scope?: string | null;
          industry?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: DatabaseProjectRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          category: SemanticCategoryId;
          presentation_type?: PresentationType;
          content_subtype?: ContentSubtype | null;
          client_id?: string | null;
          client_display_name?: string | null;
          description?: string | null;
          scope?: string[] | null;
          year?: string | null;
          featured?: boolean;
          status?: "draft" | "published" | "archived";
          display_order?: number;
          framing_config?: FramingConfig | null;
          provenance?: SourceProvenance | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          category?: SemanticCategoryId;
          presentation_type?: PresentationType;
          content_subtype?: ContentSubtype | null;
          client_id?: string | null;
          client_display_name?: string | null;
          description?: string | null;
          scope?: string[] | null;
          year?: string | null;
          featured?: boolean;
          status?: "draft" | "published" | "archived";
          display_order?: number;
          framing_config?: FramingConfig | null;
          provenance?: SourceProvenance | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          }
        ];
      };
      project_media: {
        Row: DatabaseProjectMediaRow;
        Insert: {
          id?: string;
          project_id: string;
          src: string;
          alt?: string;
          role?: MediaRole;
          width: number;
          height: number;
          aspect_ratio: number | string;
          orientation: MediaOrientation;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          src?: string;
          alt?: string;
          role?: MediaRole;
          width?: number;
          height?: number;
          aspect_ratio?: number | string;
          orientation?: MediaOrientation;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
