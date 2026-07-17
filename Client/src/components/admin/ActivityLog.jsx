import React from "react";
import { Activity, CircleDot } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";
import { cx } from "../../utils/classNames";

export default function ActivityLog({ entries }) {
  return (
    <Card>
      <SectionTitle icon={Activity} title="Activity Log" />
      {entries.map((entry, i) => (
        <div key={entry} className={cx("flex items-center gap-2 py-2.5", i < entries.length - 1 && "border-b border-hairline")}>
          <CircleDot size={11} className="text-primary shrink-0" />
          <span className="text-[12.5px] text-ink">{entry}</span>
        </div>
      ))}
    </Card>
  );
}
