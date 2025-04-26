import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MessageSquare, Menu, X, Moon, Sun, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { useAuth } from "@/contexts/auth-context";
import { logOut } from "@/lib/firebase";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sign-language", label: "Sign Language" },
  { href: "/speech-to-text", label: "Speech-to-Text" },
  { href: "/text-to-speech", label: "Text-to-Speech" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "GT";

    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    return "GT";
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
                <MessageSquare className="h-6 w-6" />
                SilentTalk
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location === link.href
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:border-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Open user menu"
                  >
                    <AvatarPlaceholder initials={getUserInitials()} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthModal 
                trigger={
                  <Button size="sm" variant="default">Sign In</Button>
                }
              />
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                location === link.href
                  ? "bg-primary-50 border-primary text-primary-700"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:border-muted hover:text-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-border">
          {user ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <AvatarPlaceholder initials={getUserInitials()} size="md" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">{user.displayName || "User"}</div>
                  <div className="text-sm font-medium text-muted-foreground">{user.email}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-2">
              <AuthModal
                trigger={
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Button>
                }
              />
              <div className="flex items-center justify-end mt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
