import React from "react";
import { cx } from "../../utils/classNames";

export function Label({ children, dark }) {
  return (
    <label className={cx("block text-[11.5px] font-semibold mb-1.5 uppercase tracking-wide", dark ? "text-slate-400" : "text-subtext")}>
      {children}
    </label>
  );
}

export default function Input({ dark, className, as = "input", children, ...props }) {
  const Tag = as;
  const base = cx(
    "w-full px-3 py-2.5 rounded-[10px] text-[13.5px] font-sans outline-none box-border",
    dark
      ? "bg-[#0F172A] border border-navy-line text-slate-100"
      : "bg-surface border border-hairline text-ink",
    className
  );
  return (
    <Tag className={base} {...props}>
      {children}
    </Tag>
  );
}
