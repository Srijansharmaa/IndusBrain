import React from "react";
import { Search, Sun, Moon, Bell, ChevronDown } from "lucide-react";
import IconButton from "../common/IconButton";
import { getPlantById } from "../../constants/plants";
import { getRoleById } from "../../constants/roles";

export default function TopBar({ user, dark, setDark, onSearch }) {
  const plant = getPlantById(user.plant);
  const role = getRoleById(user.role);
  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="h-[62px] flex items-center justify-between px-[22px] border-b border-hairline bg-white sticky top-0 z-20">
      <div className="flex items-center gap-2.5 flex-1 max-w-[420px]">
        <div className="flex items-center gap-2 bg-white rounded-[10px] px-3 py-2 w-full border border-slate-300 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search size={15} className="text-slate-500 shrink-0" />
          <input
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search enterprise knowledge..."
           className="border-none outline-none bg-transparent text-[13px] w-full font-sans text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <IconButton onClick={() => setDark(!dark)}>
          {dark ? <Sun size={16} className="text-slate-500" /> : <Moon size={16} className="text-slate-500" />}
        </IconButton>
        <IconButton>
          <Bell size={16} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger" />
        </IconButton>
        <div className="w-px h-6.5 bg-slate-200" />
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="m-0 text-[13px] font-bold text-slate-900">{user.name}</p>
            <p className="m-0 text-[11px] text-slate-500">
              {role?.label} \u00b7 {plant?.loc}
            </p>
          </div>
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <ChevronDown size={14} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
}
