import React from "react";

export default function SuggestedQueries({ queries, onSelect, disabled }) {
  return (
    <div className="flex gap-2 flex-wrap mb-2.5">
      {queries.map((query) => (
        <button
          key={query}
          disabled={disabled}
          onClick={() => onSelect(query)}
          className="text-[11.5px] px-2.5 py-1.5 rounded-full border border-hairline bg-card cursor-pointer text-subtext font-sans disabled:cursor-not-allowed disabled:opacity-60"
        >
          {query}
        </button>
      ))}
    </div>
  );
}
