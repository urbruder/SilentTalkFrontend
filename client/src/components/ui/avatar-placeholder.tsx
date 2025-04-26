import React from "react";
import { cn } from "@/lib/utils";

interface AvatarPlaceholderProps {
  initials: string;
  className?: string;
}

export function AvatarPlaceholder({ initials, className }: AvatarPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center",
        "bg-primary/10 text-primary font-semibold",
        className
      )}
    >
      {initials}
    </div>
  );
}