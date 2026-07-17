import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "./Card";
import { cx } from "../../utils/classNames";

const TONE_TEXT = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  purple: "text-purple",
};

const TONE_BG = {
  primary: "bg-primary/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  danger: "bg-danger/10",
  purple: "bg-purple/10",
};

export default function MetricCard({ icon: Icon, label, value, delta, up, color = "primary" }) {
  return (
    <Card className="p-[18px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="m-0 text-[12.5px] font-semibold text-subtext uppercase tracking-wide">{label}</p>
          <p className="mt-2 mb-0 text-[26px] font-extrabold text-ink tracking-tight">{value}</p>
        </div>
        <div className={cx("w-[38px] h-[38px] rounded-xl flex items-center justify-center", TONE_BG[color])}>
          <Icon size={18} className={TONE_TEXT[color]} />
        </div>
      </div>
      {delta && (
        <div className="flex items-center gap-1 mt-2.5">
          {up ? <ArrowUpRight size={14} className="text-success" /> : <ArrowDownRight size={14} className="text-danger" />}
          <span className={cx("text-xs font-semibold", up ? "text-success" : "text-danger")}>{delta}</span>
          <span className="text-xs text-subtext">vs last month</span>
        </div>
      )}
    </Card>
  );
}
