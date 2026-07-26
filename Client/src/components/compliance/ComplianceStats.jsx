import React from "react";
import {
  ShieldCheck,
  FileCheck2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import MetricCard from "../common/MetricCard";

const ICONS = {
  ShieldCheck,
  FileCheck2,
  Clock,
  AlertTriangle,
};

export default function ComplianceStats({ metrics }) {

  console.log("ICONS:", ICONS);
  console.log("Metrics:", metrics);

  return (
    <div className="grid grid-cols-4 gap-3.5 mb-4.5">
      {metrics.map((metric) => {

        console.log(
          metric.icon,
          ICONS[metric.icon]
        );

        return (
          <MetricCard
            key={metric.label}
            {...metric}
            icon={ICONS[metric.icon]}
          />
        );
      })}
    </div>
  );
}