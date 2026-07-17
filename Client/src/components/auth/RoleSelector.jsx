import React from "react";
import { ROLES } from "../../constants/roles";
import { cx } from "../../utils/classNames";

export default function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 mt-2">
      {ROLES.map((role) => {
        const RoleIcon = role.icon;
        const selected = selectedRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={cx(
              "text-left p-3 rounded-2xl border-[1.5px] cursor-pointer transition-all",
              selected ? "border-primary bg-primary/10" : "border-navy-line bg-[#0F172A]"
            )}
          >
            <RoleIcon size={16} className={selected ? "text-blue-300" : "text-slate-500"} />
            <p className={cx("mt-2 mb-0.5 text-[12.5px] font-bold", selected ? "text-white" : "text-slate-300")}>
              {role.label}
            </p>
            <p className="m-0 text-[10.5px] text-slate-500 leading-tight">{role.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}
