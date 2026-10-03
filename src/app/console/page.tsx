"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { DatabaseProjectRow, DatabaseClientRow, DatabaseProjectMediaRow } from "@/lib/supabase/types";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/data";
import { SemanticCategoryId } from "@/lib/types";
import {
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  Star,
  Layers,
  CheckCircle2,
  Clock,
  Archive,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { revalidatePortfolio } from "@/lib/supabase/actions";

interface ProjectWithDetails extends DatabaseProjectRow {
  client?: DatabaseClientRow | null;
  media?: DatabaseProjectMediaRow[];
}

export default function ConsoleDashboardPage() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          client:clients (*),
          media:project_media (*)
        `)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error loading projects:", error);
      } else {
        setProjects((data as unknown as ProjectWithDetails[]) || []);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, slug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        alert(`Failed to delete project: ${error.message}`);
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        await revalidatePortfolio(slug);
      }
    } catch (err) {
      alert("Error deleting project.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client?.name && p.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" ? true : p.status === selectedStatus;

    const matchesCategory =
      selectedCategory === "all" ? true : p.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.status === "published").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;
  const archivedCount = projects.filter((p) => p.status === "archived").length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0D0D0D] tracking-tight">
            Portfolio Catalog
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Manage projects, visual presentations, framing, and publishing status.
          </p>
        </div>

        <Link
          href="/console/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
          <div className="flex items-center justify-between text-[#888888] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#0D0D0D]">{totalCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Published</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{publishedCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Drafts</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{draftCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Archived</span>
            <Archive className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-gray-700">{archivedCount}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, slug, client..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F7] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] placeholder-[#888888] focus:outline-none focus:border-[#FF4F00] transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#F7F7F7] p-1 rounded-lg border border-[#E0E0E0]">
          {["all", "published", "draft", "archived"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                selectedStatus === status
                  ? "bg-white text-[#0D0D0D] shadow-xs font-semibold"
                  : "text-[#666666] hover:text-[#0D0D0D]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-[#F7F7F7] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00] transition-colors"
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_DISPLAY_NAMES).map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Table / List */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#888888]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF4F00] mb-3" />
            <span className="text-xs uppercase tracking-wider">Loading portfolio projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-12 h-12 bg-[#F7F7F7] border border-[#E5E5E5] rounded-full flex items-center justify-center mx-auto mb-3 text-[#888888]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#0D0D0D]">No projects found</h3>
            <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
              {searchQuery || selectedStatus !== "all" || selectedCategory !== "all"
                ? "Try adjusting your search terms or filters."
                : "Get started by adding your first project to the portfolio."}
            </p>
            {!(searchQuery || selectedStatus !== "all" || selectedCategory !== "all") && (
              <Link
                href="/console/projects/new"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF4F00] text-white text-xs font-semibold rounded-lg hover:bg-[#E04500] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Project</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#888888] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Artwork & Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {filteredProjects.map((project, idx) => {
                  const primaryMedia =
                    project.media?.find((m) => m.role === "primary" || m.role === "composite") ||
                    project.media?.[0];

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-[#FAFAFA] transition-colors group"
                    >
                      {/* Order Number */}
                      <td className="py-3 px-4 text-center font-mono text-[#888888]">
                        {project.display_order ?? idx + 1}
                      </td>

                      {/* Project Title & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-[#EAEAEA] rounded-lg border border-[#E0E0E0] overflow-hidden shrink-0 relative">
                            {primaryMedia?.src ? (
                              <Image
                                src={primaryMedia.src}
                                alt={primaryMedia.alt || project.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#AAAAAA] text-[10px]">
                                No Media
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/console/projects/${project.id}`}
                                className="font-semibold text-[#0D0D0D] hover:text-[#FF4F00] transition-colors"
                              >
                                {project.title}
                              </Link>
                              {project.featured && (
                                <span title="Featured on Homepage">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-[#888888] text-[11px] flex items-center gap-2 mt-0.5">
                              <span className="font-mono">/{project.slug}</span>
                              {project.subtitle && (
                                <>
                                  <span>•</span>
                                  <span>{project.subtitle}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 bg-[#F0F0F0] text-[#444444] rounded text-[11px] font-medium">
                          {CATEGORY_DISPLAY_NAMES[project.category as SemanticCategoryId] || project.category}
                        </span>
                      </td>

                      {/* Client */}
                      <td className="py-3 px-4 text-[#555555]">
                        {project.client?.name || project.client_display_name || "—"}
                      </td>

                      {/* Year */}
                      <td className="py-3 px-4 font-mono text-[#555555]">
                        {project.year || "—"}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {project.status === "published" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Published
                          </span>
                        )}
                        {project.status === "draft" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Draft
                          </span>
                        )}
                        {project.status === "archived" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                            Archived
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/work/${project.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View Live Page"
                            className="p-1.5 text-[#888888] hover:text-[#0D0D0D] hover:bg-[#EFEFEF] rounded transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/console/projects/${project.id}`}
                            title="Edit Project"
                            className="p-1.5 text-[#888888] hover:text-[#FF4F00] hover:bg-[#EFEFEF] rounded transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(project.id, project.slug, project.title)}
                            disabled={deletingId === project.id}
                            title="Delete Project"
                            className="p-1.5 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            {deletingId === project.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
