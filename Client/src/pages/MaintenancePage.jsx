import React, { useEffect, useState } from "react";
import EquipmentHealthCard from "../components/maintenance/EquipmentHealthCard";
import RecommendedActions from "../components/maintenance/RecommendedActions";
import RecentIncidents from "../components/maintenance/RecentIncidents";
import { getEquipmentHealth, getRecommendedActions, getRecentIncidents } from "../services/maintenanceService";
import { HERO_PATH } from "../constants/graphData";

export default function MaintenancePage({ graph }) {
  const [equipmentHealth, setEquipmentHealth] = useState([]);
  const [actions, setActions] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    getEquipmentHealth().then(setEquipmentHealth);
    getRecommendedActions().then(setActions);
    getRecentIncidents().then(setIncidents);
  }, []);

  const onSelectEquipment = () => {
    graph.setActivePath(HERO_PATH);
    graph.setActiveNode("p101");
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {equipmentHealth.map((equipment) => (
          <EquipmentHealthCard key={equipment.name} equipment={equipment} onSelect={onSelectEquipment} />
        ))}
      </div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <RecommendedActions actions={actions} />
        <RecentIncidents incidents={incidents} />
      </div>
    </div>
  );
}
