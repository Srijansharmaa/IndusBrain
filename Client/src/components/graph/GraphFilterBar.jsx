import React from "react";
import { cx } from "../../utils/classNames";

const FILTERS = [
  "all",
  "equipment",
  "incident",
  "document",
  "person",
  "recommendation",
];

export default function GraphFilterBar({ activeFilter, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cx(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize",
            activeFilter === filter
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-white hover:text-gray-900"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}