import React from "react";
import { AlertTriangle } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";
import { cx } from "../../utils/classNames";

export default function RecentIncidents({ incidents }) {
  return (
    <Card>
      <SectionTitle icon={AlertTriangle} title="Recent Incidents" />
      {incidents.map((incident, i) => (
        <div key={incident.t} className={cx("py-2.5", i < incidents.length - 1 && "border-b border-hairline")}>
          <p className="m-0 text-[12.5px] font-semibold text-ink">{incident.t}</p>
          <p className="mt-0.5 mb-0 text-[11px] text-subtext">{incident.d}</p>
        </div>
      ))}
    </Card>
  );
}
