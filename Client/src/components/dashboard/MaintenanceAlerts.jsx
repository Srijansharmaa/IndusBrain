import React from "react";
import { AlertTriangle } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import SectionTitle from "../common/SectionTitle";
import { cx } from "../../utils/classNames";

export default function MaintenanceAlerts({ alerts = [] }) {
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
      <SectionTitle icon={AlertTriangle}  title={`Maintenance Alerts (${alerts.length})`} />
      {alerts.map((alert, i) => (
        <div
  key={alert.t}
  className={cx(
    "group flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-indigo-300 hover:shadow-md",
    i !== alerts.length - 1 && "mb-3"
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
