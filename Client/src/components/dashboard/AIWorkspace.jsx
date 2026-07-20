import React from "react";
import { Sparkles, Wrench, ShieldCheck, TrendingUp, ChevronRight } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import SectionTitle from "../common/SectionTitle";
import { HERO_PATH } from "../../constants/graphData";

const QUICK_ACTIONS = [
  { label: "Failure diagnostics", icon: Wrench },
  { label: "Compliance check", icon: ShieldCheck },
  { label: "Trend analysis", icon: TrendingUp },
];

export default function AIWorkspace({ onAskCopilot }) {
  return (
    <Card>
      <SectionTitle icon={Sparkles} title="AI Workspace" action={
        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
    <Sparkles size={12}/>
    AI Live
</div>
      } />
      <div className="rounded-2xl p-5 border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 shadow-sm">
       <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
         Suggested Question
       </p>
       <p className="mt-3 mb-4 text-base font-semibold text-gray-900 leading-relaxed">"Why did Pump P101 fail last week?"</p>
        <button
          onClick={() => onAskCopilot(HERO_PATH, "p101")}
          className="inline-flex
items-center
gap-2
rounded-xl
bg-gradient-to-r
from-indigo-600
to-violet-600
px-5
py-3
text-sm
font-semibold
text-white
shadow-md
transition-all
duration-200
hover:shadow-xl
hover:scale-[1.02]"
        >
          Trace root cause on graph <ChevronRight size={13} />
        </button>
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-2.5">
        {QUICK_ACTIONS.map((action) => (
          <div key={action.label} className="group
rounded-xl
border
border-gray-200
bg-white
p-4
shadow-sm
transition-all
duration-200
hover:-translate-y-1
hover:border-indigo-300
hover:shadow-lg
cursor-pointer rounded-xl p-3 text-center">
            <action.icon size={16} className="text-primary mx-auto" />
            <p className="mt-1.5 mb-0 text-[11.5px] font-semibold text-ink">{action.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
