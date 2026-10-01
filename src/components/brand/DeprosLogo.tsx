import React from "react";
import Image from "next/image";

interface DeprosLogoProps {
  className?: string;
  variant?: "white" | "black";
  showTagline?: boolean;
}

export const DeprosLogo: React.FC<DeprosLogoProps> = ({
  className = "",
  variant = "black",
  showTagline = true,
}) => {
  const isWhite = variant === "white";

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      {/* Official Vector Logo referencing single source of truth public/images/branding/depros_logo.svg */}
      <div className="w-36 sm:w-44 lg:w-52 aspect-[1182/650] overflow-hidden flex items-start">
        <Image
          src="/images/branding/depros_logo.svg"
          alt="DEPROS Logo"
          width={1182}
          height={650}
          className={`w-full h-auto object-contain object-top ${
            isWhite ? "brightness-0 invert" : ""
          }`}
          priority
        />
      </div>

      {/* Official Sub-label */}
      {showTagline && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className={`w-[4px] h-[9px] ${
              isWhite ? "bg-white" : "bg-depros-orange"
            } transform -skew-x-[28deg]`}
            aria-hidden="true"
          />
          <span
            className={`text-[8px] sm:text-[9px] font-sans uppercase tracking-[0.25em] font-medium ${
              isWhite ? "text-white/90" : "text-depros-black"
            }`}
          >
            Design & Brand Development
          </span>
        </div>
      )}
    </div>
  );
};
