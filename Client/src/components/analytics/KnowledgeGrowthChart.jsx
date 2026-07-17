import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";

export default function KnowledgeGrowthChart({ data }) {
  return (
    <Card>
      <SectionTitle icon={TrendingUp} title="Knowledge Growth" />
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="docsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
            <Area type="monotone" dataKey="docs" stroke="#2563EB" fill="url(#docsGrad)" strokeWidth={2} name="Documents" />
            <Area type="monotone" dataKey="ai" stroke="#7C3AED" fill="url(#aiGrad)" strokeWidth={2} name="AI Queries" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
