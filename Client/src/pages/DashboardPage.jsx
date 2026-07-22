import React from "react";
import HeroSection from "../components/dashboard/HeroSection";
import DashboardStats from "../components/dashboard/DashboardStats";
import AIWorkspace from "../components/dashboard/AIWorkspace";
import RecentActivity from "../components/dashboard/RecentActivity";
import MaintenanceAlerts from "../components/dashboard/MaintenanceAlerts";
import KnowledgeGraphPanel from "../components/graph/KnowledgeGraphPanel";
import { HERO_PATH } from "../constants/graphData";

export default function DashboardPage({ user, graph }) {
  const onAskCopilot = (path, node) => {
    graph.setActivePath(path);
    graph.setActiveNode(node);
  };

  return (
    <div>
      <HeroSection user={user} onAskCopilot={onAskCopilot} />
      <DashboardStats />

      <div className="grid grid-cols-[1.4fr_1fr] gap-4 mb-4">
        <AIWorkspace onAskCopilot={onAskCopilot} />
        <div className="h-80">
          <KnowledgeGraphPanel activePath={HERO_PATH} activeNode="p101" setActiveNode={graph.setActiveNode} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <RecentActivity />
        <MaintenanceAlerts />
      </div>
    </div>
  );
}
