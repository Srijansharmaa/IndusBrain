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
    <Card  className="
    rounded-2xl
    border
    border-gray-200
    bg-white
    shadow-sm
    hover:shadow-lg
    transition-all
  ">
      <SectionTitle icon={AlertTriangle}  title={`Maintenance Alerts (${ALERTS.length})`} />
      {ALERTS.map((alert, i) => (
        <div
  key={alert.t}
  className={cx(
    "group flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-indigo-300 hover:shadow-md",
    i !== ALERTS.length - 1 && "mb-3"
  )}
>
   
      <div className="flex items-start gap-3">
  <div
    className={cx(
      "flex h-10 w-10 items-center justify-center rounded-xl",
      alert.tone === "danger" && "bg-red-100",
      alert.tone === "warning" && "bg-amber-100",
      alert.tone === "success" && "bg-emerald-100"
    )}
  >
    <AlertTriangle
      size={18}
      className={cx(
        alert.tone === "danger" && "text-red-600",
        alert.tone === "warning" && "text-amber-600",
        alert.tone === "success" && "text-emerald-600"
      )}
    />
  </div>

  <div>
    <p className="font-semibold text-slate-900">
      {alert.t}
    </p>

    <p className="text-sm text-slate-500">
      Maintenance recommendation available
    </p>
  </div>
</div>
          <Badge tone={alert.tone}>{alert.sev}</Badge>
        </div>
      ))}
    </Card>
  );
}
