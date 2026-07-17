import React from "react";
import { Upload } from "lucide-react";
import Button from "../common/Button";
import { cx } from "../../utils/classNames";

export default function DocumentFilters({ categories, activeCategory, onSelect, onUpload }) {
  return (
    <div className="flex items-center justify-between mb-4.5 flex-wrap gap-3">
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cx(
              "text-xs px-3.5 py-1.5 rounded-full cursor-pointer font-sans font-semibold border",
              activeCategory === category
                ? "bg-primary text-white border-primary"
                : "bg-card text-subtext border-hairline"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <Button onClick={onUpload}>
        <Upload size={14} /> Upload document
      </Button>
    </div>
  );
}
