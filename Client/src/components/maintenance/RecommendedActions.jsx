import React from "react";
import { Wrench } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import SectionTitle from "../common/SectionTitle";
import { cx } from "../../utils/classNames";

export default function RecommendedActions({ actions }) {
  return (
    <Card>
      <SectionTitle icon={Wrench} title="Recommended Actions" />
      {actions.map((action, i) => (
        <div
          key={action.t}
          className={cx("flex items-center justify-between py-2.5", i < actions.length - 1 && "border-b border-hairline")}
        >
          <span className="text-[13px] text-ink">{action.t}</span>
          <Badge tone={action.c}>{action.p}</Badge>
        </div>
      ))}
    </Card>
  );
}
