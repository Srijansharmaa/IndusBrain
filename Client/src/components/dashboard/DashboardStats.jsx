import React from "react";
import { FileText, Bot, AlertTriangle, ShieldCheck } from "lucide-react";
import MetricCard from "../common/MetricCard";

const ICONS = { FileText, Bot, AlertTriangle, ShieldCheck };

export default function DashboardStats({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6 hover:-translate-y-1
hover:shadow-xl
transition-all
duration-300">
      {stats.map((stat) => (
        <MetricCard key={stat.label} {...stat} icon={ICONS[stat.icon] || FileText} />
      ))}
    </div>
  );
}
