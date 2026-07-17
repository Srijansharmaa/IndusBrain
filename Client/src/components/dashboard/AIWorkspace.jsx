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
      <SectionTitle icon={Sparkles} title="AI Workspace" action={<Badge tone="primary">Live</Badge>} />
      <div className="bg-surface rounded-2xl p-4 border border-hairline">
        <p className="m-0 text-xs font-bold text-subtext uppercase tracking-wide">Suggested question</p>
        <p className="mt-2 mb-3 text-sm font-semibold text-ink">"Why did Pump P101 fail last week?"</p>
        <button
          onClick={() => onAskCopilot(HERO_PATH, "p101")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-none bg-primary text-white text-xs font-bold cursor-pointer font-sans"
        >
          Trace root cause on graph <ChevronRight size={13} />
        </button>
      </div>
      <div className="mt-3.5 grid grid-cols-3 gap-2.5">
        {QUICK_ACTIONS.map((action) => (
          <div key={action.label} className="border border-hairline rounded-xl p-3 text-center">
            <action.icon size={16} className="text-primary mx-auto" />
            <p className="mt-1.5 mb-0 text-[11.5px] font-semibold text-ink">{action.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
