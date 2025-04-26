import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDropdown } from "@/components/auth/user-dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Sign Language", href: "/sign-language" },
  { name: "Speech to Text", href: "/speech-to-text" },
  { name: "Text to Speech", href: "/text-to-speech" },
];

export function Navbar() {
  const { user, loading } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 w-full border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
              SilentTalk
            </span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 ${
                  location === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-4">
          {loading ? (
            <div className="h-9 w-24 bg-muted rounded-md animate-pulse"></div>
          ) : user ? (
            <UserDropdown />
          ) : (
            <AuthModal
              trigger={<Button variant="default">Sign In</Button>}
              title="Welcome to SilentTalk"
              description="Sign in to your account to access all features"
            />
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 py-3 border-b">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 px-3 rounded-md text-base font-medium ${
                  location === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-200">
            {loading ? (
              <div className="h-9 w-full bg-muted rounded-md animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {user.photoURL ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {user.displayName
                          ? user.displayName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">Settings</Link>
                </Button>
              </div>
            ) : (
              <AuthModal
                trigger={<Button className="w-full">Sign In</Button>}
                title="Welcome to SilentTalk"
                description="Sign in to your account to access all features"
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
}