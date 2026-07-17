import React from "react";
import { FileText, Cpu, Clock, MoreHorizontal } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import IconButton from "../common/IconButton";

export default function DocumentCard({ document, onOpen }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-primary-soft flex items-center justify-center">
          <FileText size={17} className="text-primary" />
        </div>
        <Badge>{document.cat}</Badge>
      </div>
      <h4 className="m-0 mb-1.5 text-[13.5px] font-bold text-ink leading-snug">{document.title}</h4>
      <p className="m-0 mb-2.5 text-xs text-subtext leading-relaxed">{document.summary}</p>
      <div className="flex items-center gap-1.5 text-[11px] text-subtext mb-3">
        <Cpu size={11} /> {document.eq} <span>\u00b7</span> <Clock size={11} /> {document.date}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onOpen(document)}
          className="flex-1 flex items-center justify-center px-3.5 py-2 rounded-lg border-none bg-primary text-white text-xs font-bold cursor-pointer font-sans"
        >
          Open
        </button>
        <IconButton>
          <MoreHorizontal size={14} className="text-subtext" />
        </IconButton>
      </div>
    </Card>
  );
}
