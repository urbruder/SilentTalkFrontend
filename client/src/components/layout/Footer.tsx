import { Github } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
              SilentTalk
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Bridge the Silence — Talk Without Words
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Features</h4>
            <div className="flex flex-col gap-1">
              <Link href="/sign-language" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign Language
              </Link>
              <Link href="/speech-to-text" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Speech to Text
              </Link>
              <Link href="/text-to-speech" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Text to Speech
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Community</h4>
            <div className="flex flex-col gap-1">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Discord
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Legal</h4>
            <div className="flex flex-col gap-1">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-8">
        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} SilentTalk. All rights reserved.
        </p>
      </div>
    </footer>
  );
}