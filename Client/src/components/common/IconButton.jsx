import React from "react";
import { cx } from "../../utils/classNames";

export default function IconButton({ children, dark, className, ...props }) {
  return (
    <button
      className={cx(
        "w-[34px] h-[34px] rounded-[10px] flex items-center justify-center cursor-pointer relative",
        dark ? "bg-navy-line border-none w-[26px] h-[26px] rounded-lg" : "border border-hairline bg-card",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
