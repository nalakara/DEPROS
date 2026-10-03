"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/auth-context";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function ConsoleLoginPage() {
  const { user, signIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/console");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error.message || "Invalid email or password.");
      } else {
        router.push("/console");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-[#FF4F00]" />
            <span className="font-bold text-lg tracking-widest uppercase">
              DEPROS STUDIO
            </span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white mb-1">
            Content Console
          </h1>
          <p className="text-xs text-[#888888] uppercase tracking-wider">
            Sign in to manage portfolio and artworks
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-8 shadow-2xl">
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-800/60 rounded-lg flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-[#AAAAAA] mb-2"
              >
                Owner Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@depros.studio"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-[#333333] rounded-lg text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#FF4F00] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wider text-[#AAAAAA] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-[#333333] rounded-lg text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#FF4F00] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#FF4F00] hover:bg-[#E04500] disabled:bg-[#555555] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-lg mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-[11px] text-[#555555]">
          Protected studio workspace. Powered by Supabase PostgreSQL.
        </div>
      </div>
    </div>
  );
}
