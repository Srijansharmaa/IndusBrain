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
    "group text-left rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
    selected
      ? "border-indigo-500 bg-indigo-50 shadow-md"
      : "border-gray-200 bg-white hover:border-indigo-300"
  )}
>
            <div
  className={cx(
    "flex h-11 w-11 items-center justify-center rounded-xl transition-all",
    selected
      ? "bg-indigo-100"
      : "bg-gray-100 group-hover:bg-indigo-50"
  )}
>
  <RoleIcon
    size={22}
    className={cx(
      selected
        ? "text-indigo-600"
        : "text-gray-600 group-hover:text-indigo-600"
    )}
  />
</div>
            <p
  className={cx(
    "mt-4 text-base font-semibold",
    selected ? "text-slate-900" : "text-slate-800"
  )}
>
              {role.label}
            </p>
           <p className="mt-2 text-sm leading-6 text-slate-500">{role.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}
