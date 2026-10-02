import React from "react";
import Link from "next/link";
import { SemanticCategoryId } from "@/lib/types";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/data";

interface ArchiveFilterProps {
  activeCategory?: string;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

const CATEGORIES: { id: SemanticCategoryId; label: string }[] = [
  { id: "product-design", label: CATEGORY_DISPLAY_NAMES["product-design"] },
  { id: "brand-identity", label: CATEGORY_DISPLAY_NAMES["brand-identity"] },
  { id: "logos", label: CATEGORY_DISPLAY_NAMES["logos"] },
  { id: "corporate-identity", label: CATEGORY_DISPLAY_NAMES["corporate-identity"] },
  { id: "marketing-kit", label: CATEGORY_DISPLAY_NAMES["marketing-kit"] },
  { id: "graphic-visual", label: CATEGORY_DISPLAY_NAMES["graphic-visual"] },
  { id: "social-media-content", label: CATEGORY_DISPLAY_NAMES["social-media-content"] },
];

export const ArchiveFilter: React.FC<ArchiveFilterProps> = ({
  activeCategory,
  categoryCounts,
  totalCount,
}) => {
  const isAllActive = !activeCategory || activeCategory === "all";

  return (
    <nav
      aria-label="Portfolio Category Filter"
      className="border-b-2 border-depros-black pb-4 mb-10 overflow-x-auto scrollbar-none"
    >
      <ul className="flex items-center gap-2 sm:gap-4 flex-nowrap sm:flex-wrap min-w-max sm:min-w-0">
        {/* "All" Filter Option */}
        <li>
          <Link
            href="/work"
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-sans transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange ${
              isAllActive
                ? "bg-depros-black text-white font-bold"
                : "text-depros-black hover:bg-depros-light font-medium"
            }`}
            aria-current={isAllActive ? "page" : undefined}
          >
            <span>All</span>
            <span
              className={`font-mono text-[10px] ${
                isAllActive ? "text-depros-orange" : "text-depros-muted"
              }`}
            >
              ({totalCount})
            </span>
          </Link>
        </li>

        {/* 7 Semantic Categories */}
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <li key={cat.id}>
              <Link
                href={`/work?category=${cat.id}`}
                className={`inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-sans transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-depros-orange ${
                  isActive
                    ? "bg-depros-black text-white font-bold"
                    : "text-depros-black hover:bg-depros-light font-medium"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{cat.label}</span>
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? "text-depros-orange" : "text-depros-muted"
                  }`}
                >
                  ({count})
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
