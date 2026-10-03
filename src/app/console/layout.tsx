"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/supabase/auth-context";
import {
  FolderKanban,
  Users,
  ExternalLink,
  LogOut,
  Plus,
  Loader2,
  Lock,
} from "lucide-react";

function ConsoleShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly
  if (pathname === "/console/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4F00] mb-4" />
        <span className="text-xs uppercase tracking-widest text-[#888888]">
          Authenticating Studio...
        </span>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/console/login");
    }
    return null;
  }

  const navItems = [
    { href: "/console", label: "Projects", icon: FolderKanban, exact: true },
    { href: "/console/clients", label: "Clients", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#0D0D0D] flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D] text-white border-b border-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/console"
              className="flex items-center gap-2.5 font-bold tracking-wider text-sm uppercase"
            >
              <div className="w-2.5 h-2.5 bg-[#FF4F00]" />
              <span>DEPROS STUDIO</span>
              <span className="text-[10px] bg-[#222222] text-[#888888] px-1.5 py-0.5 rounded font-mono">
                CONSOLE
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded transition-colors ${
                      isActive
                        ? "bg-[#222222] text-[#FF4F00]"
                        : "text-[#AAAAAA] hover:text-white hover:bg-[#181818]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/console/projects/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF4F00] text-white text-xs font-semibold rounded hover:bg-[#E04500] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </Link>

            <Link
              href="/work"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#888888] hover:text-white transition-colors border border-[#333333] rounded hover:border-[#555555]"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-[1px] bg-[#333333] mx-1" />

            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-[11px] text-[#888888] truncate max-w-[150px]">
                {user.email}
              </span>
              <button
                onClick={() => signOut()}
                title="Sign Out"
                className="p-1.5 text-[#888888] hover:text-red-400 hover:bg-[#222222] rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ConsoleShell>{children}</ConsoleShell>
    </AuthProvider>
  );
}
