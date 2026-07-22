import { Wrench, Factory, ShieldAlert, FileCheck2, Gauge, UserCog } from "lucide-react";

export const ROLES = [
  { id: "maint", label: "Maintenance Engineer", icon: Wrench, blurb: "Equipment health, work orders, failure diagnostics" },
  { id: "plant", label: "Plant Manager", icon: Factory, blurb: "Plant-wide KPIs, risk, throughput" },
  { id: "safety", label: "Safety Officer", icon: ShieldAlert, blurb: "Incidents, hazards, safety compliance" },
  { id: "compliance", label: "Compliance Officer", icon: FileCheck2, blurb: "Regulatory filings, certificates, audits" },
  { id: "quality", label: "Quality Engineer", icon: Gauge, blurb: "Deviations, inspections, QA reports" },
  { id: "admin", label: "Admin", icon: UserCog, blurb: "Users, permissions, system health" },
];

export const getRoleById = (id) => ROLES.find((role) => role.id === id);
