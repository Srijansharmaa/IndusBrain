import React from "react";
import { Database, CheckCircle2, Link2, Users } from "lucide-react";
import MetricCard from "../common/MetricCard";

const ICONS = { Database, CheckCircle2, Link2, Users };

export default function AnalyticsStats({ metrics }) {
  return (
    <div className="grid grid-cols-4 gap-3.5 mb-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} icon={ICONS[metric.icon]} />
      ))}
    </div>
  );
}
