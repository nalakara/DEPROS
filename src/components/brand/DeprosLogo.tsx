import React from "react";
import Image from "next/image";

interface DeprosLogoProps {
  className?: string;
  variant?: "white" | "black";
}

export const DeprosLogo: React.FC<DeprosLogoProps> = ({
  className = "",
  variant = "black",
}) => {
  const isWhite = variant === "white";

  return (
    <div className={`inline-block select-none ${className}`}>
      <Image
        src="/images/branding/depros_logo.svg"
        alt="DEPROS Logo"
        width={1182}
        height={1182}
        className={`w-36 sm:w-44 lg:w-52 h-auto ${
          isWhite ? "brightness-0 invert" : ""
        }`}
        priority
      />
    </div>
  );
};
