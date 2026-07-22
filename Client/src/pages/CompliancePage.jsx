import React, { useEffect, useState } from "react";
import ComplianceStats from "../components/compliance/ComplianceStats";
import ComplianceTable from "../components/compliance/ComplianceTable";
import { getComplianceItems, getComplianceMetrics, generateComplianceReport } from "../services/complianceService";

export default function CompliancePage() {
  const [items, setItems] = useState([]);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    getComplianceItems().then(setItems);
    getComplianceMetrics().then(setMetrics);
  }, []);

  return (
    <div>
      <ComplianceStats metrics={metrics} />
      <ComplianceTable items={items} onGenerateReport={generateComplianceReport} />
    </div>
  );
}
