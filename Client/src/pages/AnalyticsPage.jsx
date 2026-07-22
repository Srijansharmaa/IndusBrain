import React, { useEffect, useState } from "react";
import AnalyticsStats from "../components/analytics/AnalyticsStats";
import KnowledgeGrowthChart from "../components/analytics/KnowledgeGrowthChart";
import KnowledgeHealthRadar from "../components/analytics/KnowledgeHealthRadar";
import DepartmentActivityChart from "../components/analytics/DepartmentActivityChart";
import AIUsagePieChart from "../components/analytics/AIUsagePieChart";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  getAnalyticsMetrics, getKnowledgeGrowth, getKnowledgeHealthRadar, getDepartmentActivity,
} from "../services/analyticsService";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [radar, setRadar] = useState([]);
  const [departmentActivity, setDepartmentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAnalyticsMetrics().then(setMetrics),
      getKnowledgeGrowth().then(setGrowth),
      getKnowledgeHealthRadar().then(setRadar),
      getDepartmentActivity().then(setDepartmentActivity),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return (
    <div>
      <AnalyticsStats metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mb-4">
        <KnowledgeGrowthChart data={growth} />
        <KnowledgeHealthRadar data={radar} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DepartmentActivityChart data={departmentActivity} />
        <AIUsagePieChart data={departmentActivity} />
      </div>
    </div>
  );
}
