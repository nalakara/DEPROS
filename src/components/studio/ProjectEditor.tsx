"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { DatabaseClientRow, DatabaseProjectRow, DatabaseProjectMediaRow } from "@/lib/supabase/types";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/data";
import { SemanticCategoryId, PresentationType, MediaRole, MediaOrientation, FramingLayoutMode } from "@/lib/types";
import { uploadProjectMedia } from "@/lib/supabase/media-utils";
import { revalidatePortfolio } from "@/lib/supabase/actions";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  MoveUp,
  MoveDown,
  ExternalLink,
  Plus,
  Loader2,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Settings2,
} from "lucide-react";

interface MediaItemState {
  id?: string;
  src: string;
  alt: string;
  role: MediaRole;
  width: number;
  height: number;
  aspect_ratio: number;
  orientation: MediaOrientation;
  caption: string;
  display_order: number;
  isNew?: boolean;
}

interface ProjectEditorProps {
  projectId?: string; // If undefined, we are in 'Create New' mode
}

export default function ProjectEditor({ projectId }: ProjectEditorProps) {
  const router = useRouter();
  const isNew = !projectId;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Clients list for dropdown
  const [clients, setClients] = useState<DatabaseClientRow[]>([]);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientIndustry, setNewClientIndustry] = useState("");
  const [creatingClient, setCreatingClient] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<SemanticCategoryId>("product-design");
  const [presentationType, setPresentationType] = useState<PresentationType>("standalone");
  const [contentSubtype, setContentSubtype] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [clientDisplayName, setClientDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [scopeInput, setScopeInput] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [displayOrder, setDisplayOrder] = useState(1);

  // Framing Configuration State
  const [layoutMode, setLayoutMode] = useState<FramingLayoutMode>("auto");
  const [gap, setGap] = useState<"none" | "hairline" | "sm" | "md">("hairline");
  const [mobileStack, setMobileStack] = useState(true);

  // Media Assets State
  const [mediaList, setMediaList] = useState<MediaItemState[]>([]);

  // Load clients and project data (if editing)
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const loadData = async () => {
      try {
        // Fetch clients
        const { data: clientsData } = await supabase
          .from("clients")
          .select("*")
          .order("name", { ascending: true });
        setClients(clientsData || []);

        if (projectId) {
          const { data: projectData, error: projErr } = await supabase
            .from("projects")
            .select(`
              *,
              media:project_media (*)
            `)
            .eq("id", projectId)
            .single();

          if (projErr || !projectData) {
            setErrorMsg("Failed to load project details.");
            return;
          }

          setTitle(projectData.title);
          setSlug(projectData.slug);
          setSubtitle(projectData.subtitle || "");
          setCategory(projectData.category as SemanticCategoryId);
          setPresentationType(projectData.presentation_type as PresentationType);
          setContentSubtype(projectData.content_subtype || "");
          setClientId(projectData.client_id || "");
          setClientDisplayName(projectData.client_display_name || "");
          setDescription(projectData.description || "");
          setScopeInput(Array.isArray(projectData.scope) ? projectData.scope.join(", ") : "");
          setYear(projectData.year || "");
          setFeatured(Boolean(projectData.featured));
          setStatus(projectData.status as "draft" | "published" | "archived");
          setDisplayOrder(projectData.display_order ?? 1);

          // Framing config
          if (projectData.framing_config) {
            setLayoutMode(projectData.framing_config.layoutMode || "auto");
            setGap(projectData.framing_config.gap || "hairline");
            setMobileStack(projectData.framing_config.mobileStack !== false);
          }

          // Media
          const rawMedia = (projectData.media as DatabaseProjectMediaRow[]) || [];
          rawMedia.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
          setMediaList(
            rawMedia.map((m) => ({
              id: m.id,
              src: m.src,
              alt: m.alt,
              role: m.role,
              width: m.width,
              height: m.height,
              aspect_ratio: typeof m.aspect_ratio === "number" ? m.aspect_ratio : Number(m.aspect_ratio),
              orientation: m.orientation,
              caption: m.caption || "",
              display_order: m.display_order,
            }))
          );
        }
      } catch (err) {
        console.error("Error initializing editor:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  // Auto-generate slug from title for new projects
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew && !slug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  };

  // Upload image handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg(null);

    const projectSlug = slug || "temp-project";
    const newItems: MediaItemState[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { src, metadata } = await uploadProjectMedia(file, projectSlug);

        newItems.push({
          src,
          alt: `${title || projectSlug} artwork asset`,
          role: mediaList.length === 0 && i === 0 ? "primary" : "detail",
          width: metadata.width,
          height: metadata.height,
          aspect_ratio: metadata.aspectRatio,
          orientation: metadata.orientation,
          caption: "",
          display_order: mediaList.length + i,
          isNew: true,
        });
      }

      setMediaList((prev) => [...prev, ...newItems]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      setErrorMsg(msg);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  // Move media order
  const moveMedia = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= mediaList.length) return;

    const updated = [...mediaList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);

    // Update display_order indexes
    const reordered = updated.map((item, idx) => ({
      ...item,
      display_order: idx,
    }));

    setMediaList(reordered);
  };

  // Delete media item
  const removeMedia = (index: number) => {
    setMediaList((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Update single media field
  const updateMediaItem = (index: number, fields: Partial<MediaItemState>) => {
    setMediaList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...fields };
      return updated;
    });
  };

  // Quick Client Creation
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setCreatingClient(true);
    try {
      const clientSlug = newClientName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const { data, error } = await supabase
        .from("clients")
        .insert({
          slug: clientSlug,
          name: newClientName.trim(),
          industry: newClientIndustry.trim() || null,
        })
        .select()
        .single();

      if (error) {
        alert(`Failed to create client: ${error.message}`);
      } else if (data) {
        setClients((prev) => [...prev, data]);
        setClientId(data.id);
        setShowNewClientModal(false);
        setNewClientName("");
        setNewClientIndustry("");
      }
    } catch {
      alert("Error creating client.");
    } finally {
      setCreatingClient(false);
    }
  };

  // Submit Project Form
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    if (!slug.trim()) {
      setErrorMsg("Slug is required.");
      return;
    }
    if (mediaList.length === 0) {
      setErrorMsg("At least one artwork media asset is required.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setSaving(true);
    try {
      const scopeArray = scopeInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const projectPayload = {
        title: title.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim() || null,
        category,
        presentation_type: presentationType,
        content_subtype: contentSubtype.trim() || null,
        client_id: clientId || null,
        client_display_name: clientDisplayName.trim() || null,
        description: description.trim() || null,
        scope: scopeArray,
        year: year.trim() || null,
        featured,
        status,
        display_order: displayOrder,
        framing_config: {
          layoutMode,
          gap,
          mobileStack,
        },
      };

      let currentProjectId = projectId;

      if (isNew) {
        const { data: newProj, error: insertErr } = await supabase
          .from("projects")
          .insert(projectPayload)
          .select()
          .single();

        if (insertErr || !newProj) {
          throw new Error(insertErr?.message || "Failed to create project record.");
        }
        currentProjectId = newProj.id;
      } else {
        const { error: updateErr } = await supabase
          .from("projects")
          .update(projectPayload as any)
          .eq("id", projectId);

        if (updateErr) {
          throw new Error(updateErr.message);
        }
      }

      // Upsert Media records
      if (currentProjectId) {
        // Clear old media associations and re-insert current state
        await supabase.from("project_media").delete().eq("project_id", currentProjectId);

        const mediaRows = mediaList.map((m, idx) => ({
          project_id: currentProjectId,
          src: m.src,
          alt: m.alt || `${title} artwork asset`,
          role: m.role || "primary",
          width: m.width,
          height: m.height,
          aspect_ratio: m.aspect_ratio,
          orientation: m.orientation,
          caption: m.caption || null,
          display_order: idx,
        }));

        const { error: mediaErr } = await supabase
          .from("project_media")
          .insert(mediaRows);

        if (mediaErr) {
          throw new Error(`Project saved, but media failed: ${mediaErr.message}`);
        }
      }

      // Revalidate ISR Cache
      await revalidatePortfolio(slug);

      setSuccessMsg("Project saved and published state updated successfully!");

      if (isNew && currentProjectId) {
        setTimeout(() => {
          router.push(`/console/projects/${currentProjectId}`);
        }, 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save project.";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-[#888888]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4F00] mb-3" />
        <span className="text-xs uppercase tracking-wider">Loading project editor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/console"
            className="p-2 text-[#666666] hover:text-[#0D0D0D] hover:bg-[#EAEAEA] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[#0D0D0D] tracking-tight">
              {isNew ? "Create New Project" : `Edit Project: ${title || slug}`}
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              Configure artwork presentations, metadata, and editorial layout.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && slug && (
            <Link
              href={`/work/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#555555] hover:text-[#0D0D0D] border border-[#D5D5D5] rounded-lg hover:border-[#AAAAAA] transition-colors bg-white shadow-xs"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF4F00] hover:bg-[#E04500] disabled:bg-[#888888] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-800">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Core Details */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#888888] border-b border-[#F0F0F0] pb-3">
            <Sparkles className="w-4 h-4 text-[#FF4F00]" />
            <span>1. Core Project Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. JANUS BIFROUS"
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] placeholder-[#999999] focus:outline-none focus:border-[#FF4F00] transition-colors"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. janus-bifrous"
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs font-mono text-[#0D0D0D] placeholder-[#999999] focus:outline-none focus:border-[#FF4F00] transition-colors"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Subtitle / Flavor Tag
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Artisan Beer"
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] placeholder-[#999999] focus:outline-none focus:border-[#FF4F00] transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SemanticCategoryId)}
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00] transition-colors"
              >
                {Object.entries(CATEGORY_DISPLAY_NAMES).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Presentation Type */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Presentation Type
              </label>
              <select
                value={presentationType}
                onChange={(e) => setPresentationType(e.target.value as PresentationType)}
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00] transition-colors"
              >
                <option value="standalone">Standalone (Full Case Study)</option>
                <option value="grouped">Grouped (Portfolio Roster Showcase)</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Production Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] placeholder-[#999999] focus:outline-none focus:border-[#FF4F00] transition-colors"
              />
            </div>
          </div>

          {/* Scope Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1.5">
              Scope of Work (Comma separated)
            </label>
            <input
              type="text"
              value={scopeInput}
              onChange={(e) => setScopeInput(e.target.value)}
              placeholder="Packaging Design, Label Typography, Custom Illustration"
              className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] placeholder-[#999999] focus:outline-none focus:border-[#FF4F00] transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1.5">
              Project Description / Editorial Statement
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the aesthetic direction, narrative, and materials..."
              className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] placeholder-[#999999] focus:outline-none focus:border-[#FF4F00] transition-colors resize-y"
            />
          </div>
        </div>

        {/* Section 2: Client Attribution */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#888888]">
              <Layers className="w-4 h-4 text-[#FF4F00]" />
              <span>2. Client Attribution</span>
            </div>
            <button
              type="button"
              onClick={() => setShowNewClientModal(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF4F00] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Client</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Client Select */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Client Entity
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00] transition-colors"
              >
                <option value="">— Select Client (Optional) —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.industry ? `(${c.industry})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Display Name Override */}
            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Display Name Override (Optional)
              </label>
              <input
                type="text"
                value={clientDisplayName}
                onChange={(e) => setClientDisplayName(e.target.value)}
                placeholder="e.g. Locale Brewery International"
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] placeholder-[#999999] focus:outline-none focus:border-[#FF4F00] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Artwork & Media Asset Manager */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#888888]">
              <ImageIcon className="w-4 h-4 text-[#FF4F00]" />
              <span>3. Visual Artwork Assets ({mediaList.length})</span>
            </div>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0D0D0D] hover:bg-[#222222] text-white text-xs font-semibold rounded-lg transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Upload Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {uploading && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center gap-2 text-xs text-orange-900">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF4F00]" />
              <span>Uploading and analyzing image dimensions...</span>
            </div>
          )}

          {mediaList.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-[#E5E5E5] rounded-xl">
              <Upload className="w-8 h-8 text-[#AAAAAA] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#555555]">No artwork assets uploaded yet</p>
              <p className="text-[11px] text-[#888888] mt-1">
                Upload PNG, JPG, WebP, or SVG. Dimensions and orientation are automatically detected.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mediaList.map((item, idx) => (
                <div
                  key={item.id || item.src}
                  className="p-4 bg-[#FBFBFB] border border-[#E5E5E5] rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 group"
                >
                  {/* Order & Move Controls */}
                  <div className="flex md:flex-col items-center gap-1 text-[#888888]">
                    <button
                      type="button"
                      onClick={() => moveMedia(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 hover:text-[#0D0D0D] disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-bold">{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => moveMedia(idx, "down")}
                      disabled={idx === mediaList.length - 1}
                      className="p-1 hover:text-[#0D0D0D] disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="w-20 h-20 bg-[#EAEAEA] rounded-lg border border-[#E0E0E0] overflow-hidden shrink-0 relative">
                    <Image
                      src={item.src}
                      alt={item.alt || `Media ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details & Controls */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    {/* Role */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#888888] mb-1">
                        Role
                      </label>
                      <select
                        value={item.role}
                        onChange={(e) => updateMediaItem(idx, { role: e.target.value as MediaRole })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E0E0E0] rounded text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                      >
                        <option value="primary">Primary (Hero Artwork)</option>
                        <option value="detail">Detail (Macro / Close-up)</option>
                        <option value="supporting">Supporting</option>
                        <option value="composite">Composite</option>
                      </select>
                    </div>

                    {/* Alt Text */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#888888] mb-1">
                        Alt Text (A11y)
                      </label>
                      <input
                        type="text"
                        value={item.alt}
                        onChange={(e) => updateMediaItem(idx, { alt: e.target.value })}
                        placeholder="Artwork description"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E0E0E0] rounded text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                      />
                    </div>

                    {/* Caption */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#888888] mb-1">
                        Caption (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => updateMediaItem(idx, { caption: e.target.value })}
                        placeholder="Editorial caption..."
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E0E0E0] rounded text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                      />
                    </div>
                  </div>

                  {/* Metadata Badge & Delete */}
                  <div className="flex md:flex-col items-end justify-between gap-2 shrink-0">
                    <div className="text-[10px] font-mono text-[#888888] text-right">
                      <div>{item.width}×{item.height}px</div>
                      <div className="capitalize text-[#555555]">{item.orientation}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="p-1.5 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove Media"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Visual Framing & Publication Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Framing Controls */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#888888] border-b border-[#F0F0F0] pb-3">
              <Settings2 className="w-4 h-4 text-[#FF4F00]" />
              <span>4. Visual Framing Engine</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Layout Mode
              </label>
              <select
                value={layoutMode}
                onChange={(e) => setLayoutMode(e.target.value as FramingLayoutMode)}
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
              >
                <option value="auto">Auto (Deterministic count & aspect-aware)</option>
                <option value="editorial">Editorial (Custom row groups)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Grid Gap Spacing
              </label>
              <select
                value={gap}
                onChange={(e) => setGap(e.target.value as "none" | "hairline" | "sm" | "md")}
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
              >
                <option value="none">None (0px)</option>
                <option value="hairline">Hairline (1px)</option>
                <option value="sm">Small (8px)</option>
                <option value="md">Medium (16px)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-xs font-semibold text-[#333333]">Mobile Responsive Stacking</div>
                <div className="text-[11px] text-[#888888]">Stack rows vertically on small screens</div>
              </div>
              <input
                type="checkbox"
                checked={mobileStack}
                onChange={(e) => setMobileStack(e.target.checked)}
                className="w-4 h-4 accent-[#FF4F00]"
              />
            </div>
          </div>

          {/* Publication Controls */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#888888] border-b border-[#F0F0F0] pb-3">
              <Save className="w-4 h-4 text-[#FF4F00]" />
              <span>5. Publication & Visibility</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] font-semibold focus:outline-none focus:border-[#FF4F00]"
              >
                <option value="draft">Draft (Private in Studio)</option>
                <option value="published">Published (Live on Website)</option>
                <option value="archived">Archived (Hidden from catalog)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#333333] mb-1.5">
                Display Order Number
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs font-mono text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-xs font-semibold text-[#333333]">Featured on Homepage</div>
                <div className="text-[11px] text-[#888888]">Highlight in top curated showcase</div>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#FF4F00]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E5E5E5]">
          <Link
            href="/console"
            className="px-4 py-2.5 text-xs font-medium text-[#666666] hover:text-[#0D0D0D] transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF4F00] hover:bg-[#E04500] disabled:bg-[#888888] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Project...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal: Add New Client */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
              Add New Client Entity
            </h3>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Locale Brewery"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Industry / Sector
                </label>
                <input
                  type="text"
                  value={newClientIndustry}
                  onChange={(e) => setNewClientIndustry(e.target.value)}
                  placeholder="e.g. Brewery / Hospitality"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="px-3 py-1.5 text-xs text-[#666666] hover:text-[#0D0D0D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingClient || !newClientName.trim()}
                  className="px-4 py-2 bg-[#0D0D0D] hover:bg-[#222222] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {creatingClient ? "Creating..." : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
