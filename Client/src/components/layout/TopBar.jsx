import React, { useState } from "react";
import { Search, Sun, Moon, ChevronDown } from "lucide-react";
import IconButton from "../common/IconButton";
import { getPlantById } from "../../constants/plants";
import { getRoleById } from "../../constants/roles";

export default function TopBar({ user, dark, setDark, onSearch }) {
  const plant = getPlantById(user.plant);
  const role = getRoleById(user.role);
  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const [value, setValue] = useState("");

  const submit = () => onSearch(value);

  return (
    <div className="h-[62px] flex items-center justify-between px-[22px] border-b border-hairline bg-card sticky top-0 z-20">
      <div className="flex items-center gap-2.5 flex-1 max-w-[420px]">
        <div className="flex items-center gap-2 bg-card rounded-[10px] px-3 py-2 w-full border border-hairline shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search size={15} className="text-subtext shrink-0" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search documents... (press Enter)"
           className="border-none outline-none bg-transparent text-[13px] w-full font-sans text-ink placeholder:text-subtext"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <IconButton onClick={() => setDark(!dark)} title={dark ? "Switch to light mode" : "Switch to dark mode"}>
          {dark ? <Sun size={16} className="text-subtext" /> : <Moon size={16} className="text-subtext" />}
        </IconButton>
        <div className="w-px h-6.5 bg-hairline" />
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="m-0 text-[13px] font-bold text-ink">{user.name}</p>
            <p className="m-0 text-[11px] text-subtext">
              {role?.label} \u00b7 {plant?.loc}
            </p>
          </div>
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <ChevronDown size={14} className="text-subtext" />
        </div>
      </div>
    </div>
  );
}
