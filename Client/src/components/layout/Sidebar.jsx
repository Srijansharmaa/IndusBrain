import React from "react";
import { Sparkles, Building2 } from "lucide-react";
import { NAV_ITEMS } from "../../constants/navigation";
import { getPlantById } from "../../constants/plants";
import { cx } from "../../utils/classNames";

export default function Sidebar({ page, setPage, user }) {
  const plant = getPlantById(user.plant);

  return (
    <div className="w-60 bg-navy h-screen sticky top-0 flex flex-col shrink-0">
      <div className="px-5 pt-5 pb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-primary to-purple flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="m-0 text-[14.5px] font-extrabold text-white tracking-tight">IndustrialIQ</p>
          <p className="m-0 text-[9.5px] text-navy-line font-semibold tracking-wider">ENTERPRISE</p>
        </div>
      </div>

      <div className="mx-4 mt-1 mb-3 px-3 py-2.5 rounded-xl bg-navy-soft border border-navy-line flex items-center gap-2">
        <Building2 size={14} className="text-blue-300 shrink-0" />
        <div className="overflow-hidden">
          <p className="m-0 text-[11.5px] font-bold text-slate-200 whitespace-nowrap overflow-hidden text-ellipsis">
            {plant?.label}
          </p>
          <p className="m-0 text-[10px] text-slate-500">{plant?.loc}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cx(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] mb-0.5 cursor-pointer text-left font-sans text-[13px] transition-colors border-l-[2.5px]",
                active
                  ? "bg-primary/15 text-white font-bold border-primary"
                  : "text-slate-400 font-medium border-transparent hover:bg-navy-soft"
              )}
            >
              <Icon size={16} className={active ? "text-blue-300" : "text-slate-500"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-line">
        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          All systems operational
        </div>
      </div>
    </div>
  );
}
