import React from "react";
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

interface AuthModalProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  defaultOpen?: boolean;
}

export function AuthModal({
  trigger,
  title = "Authentication",
  description = "Sign in to your account or create a new one",
  defaultOpen = false,
}: AuthModalProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="default">Sign In</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <AuthForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}