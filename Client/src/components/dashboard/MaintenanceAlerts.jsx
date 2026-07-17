import React from "react";
import { AlertTriangle } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import SectionTitle from "../common/SectionTitle";
import { cx } from "../../utils/classNames";

const ALERTS = [
  { t: "Pump P101 \u2013 bearing wear trending up", sev: "High", tone: "danger" },
  { t: "Tank T-11 \u2013 pressure sensor recalibration due", sev: "Medium", tone: "warning" },
  { t: "Compressor A-02 \u2013 scheduled service in 5 days", sev: "Low", tone: "success" },
];

export default function MaintenanceAlerts() {
  return (
    <Card>
      <SectionTitle icon={AlertTriangle} title="Maintenance Alerts" />
      {ALERTS.map((alert, i) => (
        <div
          key={alert.t}
          className={cx("flex items-center justify-between py-2.5", i < ALERTS.length - 1 && "border-b border-hairline")}
        >
          <p className="m-0 text-[12.5px] text-ink font-medium">{alert.t}</p>
          <Badge tone={alert.tone}>{alert.sev}</Badge>
        </div>
      ))}
    </Card>
  );
}
