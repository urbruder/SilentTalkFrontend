import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

export function MicButton({
  isListening,
  onClick,
  className,
  size = "md",
  variant = "secondary"
}: MicButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <Button
      type="button"
      onClick={onClick}
      variant={variant}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-all",
        isListening ? "animate-pulse" : "",
        sizeClasses[size],
        className
      )}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <>
          <Mic className="h-5 w-5 mr-2" />
          <span className="flex items-center">
            Listening
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-1 flex space-x-1"
            >
              <span className="h-1.5 w-1.5 bg-current rounded-full" />
              <span className="h-1.5 w-1.5 bg-current rounded-full" />
              <span className="h-1.5 w-1.5 bg-current rounded-full" />
            </motion.span>
          </span>
        </>
      ) : (
        <>
          <MicOff className="h-5 w-5 mr-2" />
          <span>Start Listening</span>
        </>
      )}
    </Button>
  );
}
