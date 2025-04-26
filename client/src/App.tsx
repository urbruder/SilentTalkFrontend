import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "./hooks/use-theme";
import { AuthProvider } from "./contexts/auth-context";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/home";
import SignLanguage from "./pages/sign-language";
import SpeechToText from "./pages/speech-to-text";
import TextToSpeech from "./pages/text-to-speech";
import Settings from "./pages/settings";
import { useEffect } from "react";

// Router component
function Router() {
  // Check for Firebase auth redirect result when app loads
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        // Firebase redirect auth will be handled by the auth context
      } catch (error) {
        console.error("Error handling auth redirect:", error);
      }
    };
    
    checkRedirectResult();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sign-language" component={SignLanguage} />
          <Route path="/speech-to-text" component={SpeechToText} />
          <Route path="/text-to-speech" component={TextToSpeech} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
