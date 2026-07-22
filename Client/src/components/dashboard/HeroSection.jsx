import React from "react";
import { Bot, Plus } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { getRoleById } from "../../constants/roles";

export default function HeroSection({ user, onAskCopilot, heroStats = [], heroPath = [] }) {
  const role = getRoleById(user.role);

  return (
    <Card hover={false} className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 to-violet-700 border-none mb-5">
      <div className="flex justify-between flex-wrap gap-4">
        <div className="max-w-[560px]">
          <Badge tone="primary" className="!text-blue-300 !bg-navy-soft">{role?.label}</Badge>
          <h1 className="text-white text-4xl font-bold mt-3 mb-1.5 tracking-tight">
            Good afternoon, {user.name.split(" ")[0]}
          </h1>
          <p className="text-slate-400 text-[13.5px] leading-relaxed m-0">
            Today's AI summary: 3 equipment items show elevated failure risk, 2 compliance certificates expire within
            30 days, and knowledge coverage across Maintenance improved 4.2% this week.
          </p>
          <div className="flex gap-2.5 mt-4">
            <Button onClick={() => onAskCopilot(heroPath, heroPath[0])}>
              <Bot size={14} /> Ask AI Copilot
            </Button>
            <Button variant="ghostDark">
              <Plus size={14} /> New work order
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 min-w-[220px]">
          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-xl
bg-white/10
backdrop-blur-md
border
border-white/20
p-4  border-navy-line ">
              <p className="m-0 text-[10.5px] text-slate-500 font-semibold uppercase">{stat.label}</p>
              <p className={`mt-1 mb-0 text-[19px] font-extrabold ${stat.tone}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
