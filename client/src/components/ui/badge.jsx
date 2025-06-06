import * as React from "react";
import { cn } from "../../lib/utils";

export const Badge = ({ className, variant = "default", ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default"
          ? "bg-primary text-primary-foreground"
          : variant === "destructive"
          ? "bg-red-500 text-white"
          : "bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
