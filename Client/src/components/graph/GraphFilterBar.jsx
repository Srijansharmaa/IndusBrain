import React from "react";
import { cx } from "../../utils/classNames";

const FILTERS = ["all", "equipment", "incident", "document", "person", "recommendation"];

export default function GraphFilterBar({ activeFilter, onChange }) {
  return (
    <div className="flex gap-1.5">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cx(
            "text-[11.5px] px-2.5 py-1.5 rounded-lg cursor-pointer font-sans font-semibold capitalize border",
            activeFilter === filter
              ? "bg-primary-soft text-primary border-primary"
              : "bg-card text-subtext border-hairline"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
