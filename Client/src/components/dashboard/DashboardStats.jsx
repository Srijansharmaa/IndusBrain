import React from "react";
import { FileText, Bot, AlertTriangle, ShieldCheck } from "lucide-react";
import MetricCard from "../common/MetricCard";

const STATS = [
  {
    icon: FileText,
    label: "Indexed Documents",
    value: "2,040",
    delta: "+84 today",
    up: true,
    color: "primary",
    
  },
  {
    icon: Bot,
    label: "AI Decisions",
    value: "6,742",
    delta: "+18%",
    up: true,
    color: "purple",
  },
  {
    icon: AlertTriangle,
    label: "Critical Risks",
    value: "7",
    delta: "-2 resolved",
    up: true,
    color: "warning",
  },
  {
    icon: ShieldCheck,
    label: "Compliance",
    value: "92%",
    delta: "Excellent",
    up: true,
    color: "success",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-5 mb-6 hover:-translate-y-1
hover:shadow-xl
transition-all
duration-300">
      {STATS.map((stat) => (
        <MetricCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
