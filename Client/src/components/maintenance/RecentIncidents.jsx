import React from "react";
import { AlertTriangle } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";
import { cx } from "../../utils/classNames";

export default function RecentIncidents({ incidents }) {
 return (
  <Card>
    <SectionTitle icon={AlertTriangle} title="Recent Incidents" />

    <div style={{ color: "red", fontWeight: "bold" }}>
      TEST
    </div>

    {incidents.map((incident, i) => (
      <div
        key={i}
        className="py-2 border-b border-gray-200"
      >
        <div>{incident.t}</div>
        <div>{incident.d}</div>
      </div>
    ))}
  </Card>
);
}
