import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { ThermometerSun } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";

const RISK_TONE = { High: "danger", Medium: "warning", Low: "success" };
const RISK_HEX = { High: "#EF4444", Medium: "#F59E0B", Low: "#22C55E" };

export default function EquipmentHealthCard({ equipment, onSelect }) {
  const color = RISK_HEX[equipment.risk];
  const circumference = 2 * Math.PI * 24;

  return (
    <Card onClick={() => onSelect(equipment)}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[13.5px] font-bold text-ink">{equipment.name}</span>
        <Badge tone={RISK_TONE[equipment.risk]}>{equipment.risk} risk</Badge>
      </div>
      <div className="flex items-center gap-3 mb-2.5">
        <div className="relative w-14 h-14 shrink-0">
          <svg viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#E2E8F0" strokeWidth="6" />
            <circle
              cx="28" cy="28" r="24" fill="none" stroke={color} strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - equipment.health / 100)}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-ink">
            {equipment.health}
          </span>
        </div>
        <div className="flex-1 h-11">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equipment.temp.map((t, i) => ({ i, t }))}>
              <Line type="monotone" dataKey="t" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex justify-between text-[11.5px] text-subtext">
        <span><ThermometerSun size={11} className="inline -mt-0.5 mr-1" /> Temp trend</span>
        <span>Failure prob. {equipment.failure}%</span>
      </div>
    </Card>
  );
}
