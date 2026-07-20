import React from "react";

export default function SuggestedQueries({
  queries,
  onSelect,
  disabled,
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      {queries.map((query) => (
        <button
          key={query}
          disabled={disabled}
          onClick={() => onSelect(query)}
          className="
            rounded-full
            border
            border-gray-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-indigo-300
            hover:bg-indigo-50
            hover:text-indigo-700
            hover:shadow-md
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {query}
        </button>
      ))}
    </div>
  );
}