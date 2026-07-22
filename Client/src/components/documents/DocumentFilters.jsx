import React, { useRef } from "react";
import { Upload } from "lucide-react";
import Button from "../common/Button";
import { cx } from "../../utils/classNames";

export default function DocumentFilters({
  categories,
  activeCategory,
  onSelect,
  onUpload,
}) {

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    onUpload(file);

    e.target.value = "";
  };

  return (
  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">

    {/* Category Pills */}
    <div className="flex gap-3 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cx(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border",
            activeCategory === category
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md hover:bg-indigo-700"
              : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm"
          )}
        >
          {category}
        </button>
      ))}
    </div>

    {/* Hidden File Input */}
    <input
      type="file"
      accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
    />

    {/* Upload Button */}
    <Button
      onClick={handleClick}
      className="flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
    >
      <Upload size={16} />
      Upload Document
    </Button>

  </div>
);
}