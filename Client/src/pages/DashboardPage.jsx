import React, { useEffect, useState } from "react";
import HeroSection from "../components/dashboard/HeroSection";
import DashboardStats from "../components/dashboard/DashboardStats";
import AIWorkspace from "../components/dashboard/AIWorkspace";
import RecentActivity from "../components/dashboard/RecentActivity";
import MaintenanceAlerts from "../components/dashboard/MaintenanceAlerts";
import KnowledgeGraphPanel from "../components/graph/KnowledgeGraphPanel";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getDashboardSummary } from "../services/dashboardService";
import { getHeroPath } from "../services/graphService";

export default function DashboardPage({ user, graph, onAskCopilotQuery }) {
  const [summary, setSummary] = useState({
    heroStats: [],
    statCards: [],
    recentActivity: [],
    maintenanceAlerts: [],
  });
  const [heroPath, setHeroPath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardSummary().then(setSummary),
      getHeroPath().then(setHeroPath),
    ])
      .catch((err) => console.error("Failed to load dashboard data:", err))
      .finally(() => setLoading(false));
  }, []);

  const onAskCopilot = (path, node) => {
    graph.setActivePath(path);
    graph.setActiveNode(node);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return (
    <div>
      <HeroSection user={user} onAskCopilot={onAskCopilot} heroStats={summary.heroStats} heroPath={heroPath} />
      <DashboardStats stats={summary.statCards} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-4">
        <AIWorkspace onAskCopilotQuery={onAskCopilotQuery} />
        <div className="h-80">
          <KnowledgeGraphPanel activePath={heroPath} activeNode={heroPath[0]} setActiveNode={graph.setActiveNode} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentActivity items={summary.recentActivity} />
        <MaintenanceAlerts alerts={summary.maintenanceAlerts} />
      </div>
    </div>
  );
}
