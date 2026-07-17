import React from "react";
import { Download, ChevronRight } from "lucide-react";
import Badge from "../common/Badge";
import { COMPLIANCE_STATUS_COLOR } from "../../constants/complianceData";

export default function ComplianceTable({ items, onGenerateReport }) {
  return (
    <div className="bg-card rounded-card border border-hairline overflow-hidden">
      <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
        <span className="font-bold text-[14.5px] text-ink">Inspection Schedule & Certificates</span>
        <button
          onClick={onGenerateReport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-none bg-primary text-white text-xs font-bold cursor-pointer font-sans"
        >
          <Download size={13} /> Generate report
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface">
            {["Item", "Status", "Expiry", "Risk", ""].map((heading) => (
              <th key={heading} className="text-left px-5 py-2.5 text-[11px] text-subtext font-bold uppercase tracking-wide">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-t border-hairline">
              <td className="px-5 py-3.5 text-[13px] text-ink font-semibold">{item.name}</td>
              <td className="px-5 py-3.5">
                <Badge tone={COMPLIANCE_STATUS_COLOR[item.status]}>{item.status}</Badge>
              </td>
              <td className="px-5 py-3.5 text-xs text-subtext">{item.exp}</td>
              <td className="px-5 py-3.5 text-xs text-subtext">{item.risk}</td>
              <td className="px-5 py-3.5"><ChevronRight size={14} className="text-subtext" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
