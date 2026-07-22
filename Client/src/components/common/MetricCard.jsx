import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "./Card";
import { cx } from "../../utils/classNames";

const TONE_TEXT = {
  primary: "text-indigo-600",
  purple: "text-violet-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-red-600",
};

const TONE_BG = {
   primary: "bg-indigo-50",
  purple: "bg-violet-50",
  success: "bg-emerald-50",
  warning: "bg-amber-50",
  danger: "bg-red-50",
};

export default function MetricCard({ icon: Icon, label, value, delta, up, color = "primary" }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
  className={cx(
    "absolute top-0 left-0 h-1 w-full",
    {
      primary: "bg-indigo-500",
      purple: "bg-violet-500",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
    }[color]
  )}
/>
      <div className="flex items-start justify-between ">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
        </div>
       <div
  className={cx(
    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300",
    TONE_BG[color]
  )}
>
         <Icon
  size={22}
  className={cx(
    TONE_TEXT[color],
    "transition-transform duration-300 group-hover:scale-110"
  )}
/>
        </div>
      </div>
      {delta && (
  <div className="mt-4 border-t border-gray-100 pt-3">
    <div className="flex items-center gap-1">
      {up ? (
        <ArrowUpRight size={14} className="text-emerald-600" />
      ) : (
        <ArrowDownRight size={14} className="text-red-600" />
      )}

      <span
        className={cx(
          "text-sm font-semibold",
          up ? "text-emerald-600" : "text-red-600"
        )}
      >
        {delta}
      </span>
    </div>

    <p className="mt-1 text-xs text-gray-400">
      Compared to last month
    </p>
  </div>
)}
    </Card>
  );
}
