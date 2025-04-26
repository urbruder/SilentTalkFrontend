import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarPlaceholderProps {
  className?: string;
  initials: string;
  size?: "sm" | "md" | "lg";
}

export function AvatarPlaceholder({
  className,
  initials,
  size = "sm",
}: AvatarPlaceholderProps) {
  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold",
        sizeClasses[size],
        className
      )}
    >
      {initials.substring(0, 2)}
    </div>
  );
}