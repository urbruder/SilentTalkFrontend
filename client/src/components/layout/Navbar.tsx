import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MessageSquare, Menu, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="ml-3 relative">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Open user menu"
              >
                <AvatarPlaceholder initials="JD" />
              </Button>
            </div>
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
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <AvatarPlaceholder initials="JD" size="md" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-foreground">Jane Doe</div>
              <div className="text-sm font-medium text-muted-foreground">jane@example.com</div>
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
        </div>
      </div>
    </nav>
  );
}
