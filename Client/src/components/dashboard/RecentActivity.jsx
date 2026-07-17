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
];

export default function RecentActivity() {
  return (
    <Card>
      <SectionTitle icon={Activity} title="Recent Activity" />
      {ACTIVITY_ITEMS.map((item, i) => (
        <div
          key={item.t}
          className={cx("flex gap-2.5 py-2.5", i < ACTIVITY_ITEMS.length - 1 && "border-b border-hairline")}
        >
          <div className="w-[30px] h-[30px] rounded-[9px] bg-surface flex items-center justify-center shrink-0">
            <item.icon size={13} className="text-subtext" />
          </div>
          <div>
            <p className="m-0 text-[12.5px] text-ink font-medium">{item.t}</p>
            <p className="mt-0.5 mb-0 text-[11px] text-subtext">{item.time}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
