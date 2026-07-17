import React from "react";
import { cx } from "../../utils/classNames";

export default function Card({ children, className, hover = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cx(
        "bg-card rounded-card border border-hairline p-5 shadow-card-rest transition-all duration-200",
        hover && "hover:shadow-card-hover hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
