import React, { useEffect, useState } from "react";
import EquipmentHealthCard from "../components/maintenance/EquipmentHealthCard";
import RecommendedActions from "../components/maintenance/RecommendedActions";
import RecentIncidents from "../components/maintenance/RecentIncidents";
import { getEquipmentHealth, getRecommendedActions, getRecentIncidents } from "../services/maintenanceService";
import { getHeroPath } from "../services/graphService";

export default function MaintenancePage({ graph }) {
  const [equipmentHealth, setEquipmentHealth] = useState([]);
  const [actions, setActions] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [heroPath, setHeroPath] = useState([]);

  useEffect(() => {
    getEquipmentHealth().then(setEquipmentHealth);
    getRecommendedActions().then(setActions);
    getRecentIncidents().then(setIncidents);
    getHeroPath().then(setHeroPath);
  }, []);

  const onSelectEquipment = () => {
    graph.setActivePath(heroPath);
    graph.setActiveNode(heroPath[0] || null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {equipmentHealth.map((equipment) => (
          <EquipmentHealthCard key={equipment.name} equipment={equipment} onSelect={onSelectEquipment} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <RecommendedActions actions={actions} />
        <RecentIncidents incidents={incidents} />
      </div>
    </div>
  );
}
