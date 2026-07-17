import React from "react";
import { cx } from "../../utils/classNames";

const TONE_CLASSES = {
  primary: "text-primary bg-primary-soft",
  success: "text-success bg-success-soft",
  warning: "text-warning bg-warning-soft",
  danger: "text-danger bg-danger-soft",
  purple: "text-purple bg-purple-soft",
  neutral: "text-subtext bg-surface",
};

export default function Badge({ children, tone = "neutral", className }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
        TONE_CLASSES[tone] || TONE_CLASSES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
