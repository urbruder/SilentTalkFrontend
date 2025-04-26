import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuthForm } from "./auth-form";
import { ReactNode } from "react";

interface AuthModalProps {
  trigger?: ReactNode;
  title?: string;
  description?: string;
  defaultOpen?: boolean;
  onSuccess?: () => void;
}

export function AuthModal({
  trigger,
  title = "Authentication Required",
  description = "Please sign in or create an account to continue",
  defaultOpen = false,
  onSuccess,
}: AuthModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline">Sign In</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <AuthForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}