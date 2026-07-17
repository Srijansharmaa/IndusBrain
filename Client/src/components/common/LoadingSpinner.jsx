import React from "react";
import { cx } from "../../utils/classNames";

export default function LoadingSpinner({ size = 20, className }) {
  return (
    <div
      className={cx("border-2 border-hairline border-t-primary rounded-full animate-spin", className)}
      style={{ width: size, height: size }}
    />
  );
}
