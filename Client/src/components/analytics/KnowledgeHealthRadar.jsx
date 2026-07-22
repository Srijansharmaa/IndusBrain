import React from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Radio } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";

export default function KnowledgeHealthRadar({ data }) {
  return (
    <Card>
      <SectionTitle icon={Radio} title="Knowledge Health" />
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="area" tick={{ fontSize: 10.5, fill: "#64748B" }} />
            <Radar dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
