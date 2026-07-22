import React from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";

export default function DepartmentActivityChart({ data }) {
  return (
    <Card>
      <SectionTitle icon={BarChart3} title="Department Activity" />
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="dept" type="category" tick={{ fontSize: 11.5, fill: "#0F172A" }} axisLine={false} tickLine={false} width={90} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
            <Bar dataKey="value" fill="#2563EB" radius={[0, 6, 6, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
