import React from "react";

export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-3">
          <Icon size={20} className="text-subtext" />
        </div>
      )}
      <p className="m-0 text-sm font-bold text-ink">{title}</p>
      {description && <p className="mt-1 mb-0 text-xs text-subtext max-w-xs">{description}</p>}
    </div>
  );
}
