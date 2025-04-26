import { cn } from "@/lib/utils";

type AvatarPlaceholderProps = {
  initials: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function AvatarPlaceholder({ 
  initials, 
  className, 
  size = "sm" 
}: AvatarPlaceholderProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  };

  return (
    <div 
      className={cn(
        "rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
