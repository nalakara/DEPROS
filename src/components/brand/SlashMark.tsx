import React from "react";

interface SlashMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "orange" | "black" | "white";
}

export const SlashMark: React.FC<SlashMarkProps> = ({
  className = "",
  size = "md",
  color = "orange",
}) => {
  const sizeClasses = {
    sm: "w-[4px] h-[14px]",
    md: "w-[7px] h-[22px]",
    lg: "w-[12px] h-[36px]",
  };

  const colorClasses = {
    orange: "bg-depros-orange",
    black: "bg-depros-black",
    white: "bg-white",
  };

  return (
    <span
      className={`inline-block transform -skew-x-[28deg] origin-center ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      aria-hidden="true"
    />
  );
};
