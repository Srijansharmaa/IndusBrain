import React from "react";
import { cx } from "../../utils/classNames";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary/90",
  primaryLight: "bg-primary text-white hover:bg-primary/90 text-xs px-3.5 py-2",
  ghostDark: "border border-navy-line bg-transparent text-slate-200 hover:bg-navy-soft",
  ghostLight: "border border-hairline bg-card text-subtext hover:bg-surface",
};

export default function Button({ children, variant = "primary", className, ...props }) {
  return (
    <button
      className={cx(
        "flex items-center justify-center gap-1.5 rounded-lg font-bold cursor-pointer font-sans transition-colors",
        variant !== "primaryLight" && "px-4 py-2.5 text-[12.5px]",
        VARIANTS[variant] || VARIANTS.primary,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
