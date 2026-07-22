import React from "react";

export default function SectionTitle({ icon: Icon, title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={17} className="text-ink" />}
        <h3 className="m-0 text-[15px] font-bold text-ink tracking-tight">{title}</h3>
      </div>
      {action}
    </div>
  );
}
