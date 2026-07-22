import React from "react";
import { Activity, Wrench, Bot, ShieldCheck, FileText } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";
import { cx } from "../../utils/classNames";

const ACTIVITY_ITEMS = [
  { t: "S. Verma logged maintenance on Pump P101", time: "12 min ago", icon: Wrench },
  { t: "AI Copilot answered 3 queries on Motor M-12", time: "38 min ago", icon: Bot },
  { t: "Compliance certificate renewed \u2013 Boiler Unit 2", time: "2 hr ago", icon: ShieldCheck },
  { t: "New inspection report uploaded \u2013 Unit 4", time: "5 hr ago", icon: FileText },
   {
    t: "S. Verma logged maintenance on Pump P101",
    time: "12 min ago",
    icon: Wrench,
    type: "Maintenance",
  },
];

export default function RecentActivity() {
  return (
    <Card  className="
    rounded-2xl
    border
    border-gray-200
    bg-white
    shadow-sm
    transition-all
    hover:shadow-lg
  ">
      <div className="mb-5 flex items-center justify-between">
  <SectionTitle
    icon={Activity}
    title={`Recent Activity (${ACTIVITY_ITEMS.length})`}
  />

  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
    View Timeline →
  </button>
</div>
      {ACTIVITY_ITEMS.map((item, i) => (
        <div
          key={item.t}
          className={cx(
  "group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md",
  i !== ACTIVITY_ITEMS.length - 1 && "mb-3"
)}

        >
          <div
  className="
    flex
    h-11
    w-11
    shrink-0
    items-center
    justify-center
    rounded-xl
    bg-indigo-50
    transition-colors
    group-hover:bg-indigo-100
  "
>
  <item.icon
    size={20}
    className="text-indigo-600"
  />
</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.t}</p>
            <p className="mt-1 text-xs text-slate-500">{item.time}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
