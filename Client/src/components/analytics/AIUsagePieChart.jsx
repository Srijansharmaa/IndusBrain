import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Users } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";
import { PIE_CHART_COLORS } from "../../constants/colors";

export default function AIUsagePieChart({ data }) {
  return (
    <Card>
      <SectionTitle icon={Users} title="AI Usage by Team" />
      <div className="h-[220px] flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="dept" innerRadius={50} outerRadius={78} paddingAngle={3}>
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
