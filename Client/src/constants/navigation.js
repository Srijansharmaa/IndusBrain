import {
  LayoutDashboard, Bot, Share2, FileText, Wrench, ShieldCheck, BarChart3,
  UserCog, Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "copilot", label: "AI Copilot", icon: Bot },
  { id: "graph", label: "Knowledge Graph", icon: Share2 },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "maintenance", label: "Maintenance Intelligence", icon: Wrench },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "admin", label: "Admin", icon: UserCog, roles: ["admin"] },
  { id: "settings", label: "Settings", icon: Settings },
];
