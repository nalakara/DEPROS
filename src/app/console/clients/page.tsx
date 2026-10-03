"use client";

import React, { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { DatabaseClientRow } from "@/lib/supabase/types";
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Loader2,
  Building,
  MapPin,
  Briefcase,
  AlertCircle,
  Check,
} from "lucide-react";

export default function ConsoleClientsPage() {
  const [clients, setClients] = useState<DatabaseClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<DatabaseClientRow | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [industry, setIndustry] = useState("");
  const [scope, setScope] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchClients = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching clients:", error);
      } else {
        setClients(data || []);
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openCreateModal = () => {
    setEditingClient(null);
    setName("");
    setSlug("");
    setIndustry("");
    setScope("");
    setLocation("");
    setErrorMsg(null);
    setShowModal(true);
  };

  const openEditModal = (client: DatabaseClientRow) => {
    setEditingClient(client);
    setName(client.name);
    setSlug(client.slug);
    setIndustry(client.industry || "");
    setScope(client.scope || "");
    setLocation(client.location || "");
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingClient) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setSaving(true);
    setErrorMsg(null);

    const clientSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload = {
      name: name.trim(),
      slug: clientSlug,
      industry: industry.trim() || null,
      scope: scope.trim() || null,
      location: location.trim() || null,
    };

    try {
      if (editingClient) {
        const { error } = await supabase
          .from("clients")
          .update(payload as any)
          .eq("id", editingClient.id);

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("clients").insert(payload);
        if (error) throw new Error(error.message);
      }

      setShowModal(false);
      fetchClients();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save client.";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (client: DatabaseClientRow) => {
    if (!window.confirm(`Are you sure you want to delete "${client.name}"?`)) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    try {
      const { error } = await supabase.from("clients").delete().eq("id", client.id);
      if (error) {
        alert(`Failed to delete client: ${error.message}`);
      } else {
        setClients((prev) => prev.filter((c) => c.id !== client.id));
      }
    } catch {
      alert("Error deleting client.");
    }
  };

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.industry && c.industry.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0D0D0D] tracking-tight">
            Client Directory
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Manage partner entities, client brands, and industry attributions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, industry, location..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F7] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] placeholder-[#888888] focus:outline-none focus:border-[#FF4F00] transition-colors"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#888888]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF4F00] mb-3" />
            <span className="text-xs uppercase tracking-wider">Loading clients...</span>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-12 h-12 bg-[#F7F7F7] border border-[#E5E5E5] rounded-full flex items-center justify-center mx-auto mb-3 text-[#888888]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#0D0D0D]">No clients found</h3>
            <p className="text-xs text-[#888888] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search query."
                : "Create client records to associate projects with their brand attributions."}
            </p>
            {!searchQuery && (
              <button
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF4F00] text-white text-xs font-semibold rounded-lg hover:bg-[#E04500] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Client</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#888888] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Scope</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-[#FAFAFA] transition-colors group"
                  >
                    <td className="py-3 px-4 font-semibold text-[#0D0D0D]">
                      {client.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#666666]">
                      {client.slug}
                    </td>
                    <td className="py-3 px-4 text-[#555555]">
                      {client.industry || "—"}
                    </td>
                    <td className="py-3 px-4 text-[#555555]">
                      {client.scope || "—"}
                    </td>
                    <td className="py-3 px-4 text-[#555555]">
                      {client.location || "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(client)}
                          className="p-1.5 text-[#888888] hover:text-[#FF4F00] hover:bg-[#EFEFEF] rounded transition-colors"
                          title="Edit Client"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client)}
                          className="p-1.5 text-[#888888] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wider">
              {editingClient ? "Edit Client Entity" : "Add New Client Entity"}
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Locale Brewery"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. locale-brewery"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs font-mono text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Industry / Sector
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Brewery / Hospitality"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Scope of Work
                </label>
                <input
                  type="text"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="e.g. Full Brand & Product Packaging"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#333333] mb-1">
                  Location / Region
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bali, Indonesia"
                  className="w-full px-3 py-2 bg-[#F9F9F9] border border-[#E0E0E0] rounded-lg text-xs text-[#0D0D0D] focus:outline-none focus:border-[#FF4F00]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-[#666666] hover:text-[#0D0D0D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="px-4 py-2 bg-[#FF4F00] hover:bg-[#E04500] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {saving ? "Saving..." : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
