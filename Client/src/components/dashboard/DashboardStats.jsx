import React from "react";
import { FileText, Bot, AlertTriangle, ShieldCheck } from "lucide-react";
import MetricCard from "../common/MetricCard";

const STATS = [
  { icon: FileText, label: "Documents", value: "2,040", delta: "+8.4%", up: true, color: "primary" },
  { icon: Bot, label: "AI Queries", value: "6,700", delta: "+19.6%", up: true, color: "purple" },
  { icon: AlertTriangle, label: "Active Alerts", value: "7", delta: "-12%", up: false, color: "warning" },
  { icon: ShieldCheck, label: "Compliance Score", value: "92%", delta: "+1.8%", up: true, color: "success" },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-3.5 mb-5">
      {STATS.map((stat) => (
        <MetricCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
