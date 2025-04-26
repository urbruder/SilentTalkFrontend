import { useState } from "react";
import { 
  HandMetal, 
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebcamPreview } from "@/components/webcam-preview";
import { Card, CardContent } from "@/components/ui/card";
import { SignLanguageIllustration } from "@/lib/illustrations";
import { motion } from "framer-motion";

export default function SignLanguage() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionOutput, setRecognitionOutput] = useState<string | null>(null);

  const toggleRecognition = () => {
    setIsRecognizing(!isRecognizing);
    if (!isRecognizing) {
      // Start with empty output when beginning recognition
      setRecognitionOutput(null);
      
      // Simulate recognition after a delay (in a real app, this would connect to an API)
      setTimeout(() => {
        setRecognitionOutput("Hello, how are you today?");
      }, 3000);
    }
  };

  const supportedLanguages = [
    { name: "American (ASL)", status: "available" },
    { name: "British (BSL)", status: "available" },
    { name: "French (LSF)", status: "partial" },
    { name: "German (DGS)", status: "unavailable" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  const instructions = [
    "Position yourself in front of the camera",
    "Make sure there's good lighting",
    "Perform signs clearly and at a moderate speed",
    "Text translation will appear in the output box",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Sign Language Recognition</h1>
        <p className="mt-2 text-lg text-muted-foreground">Use your webcam to translate sign language into text in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <Card className="overflow-hidden rounded-2xl shadow-xl">
            {/* Webcam Preview */}
            <WebcamPreview />

            {/* Text Output Section */}
            <CardContent className="p-6 bg-background">
              <h2 className="text-lg font-medium text-foreground mb-4">Recognition Output</h2>
              <div className="bg-muted rounded-lg p-4 min-h-[150px] border border-border">
                {!recognitionOutput ? (
                  <>
                    <div className="animate-pulse flex space-x-4 items-start">
                      <div className="rounded-full bg-primary/40 h-10 w-10 flex items-center justify-center text-primary-foreground">
                        <HandMetal className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
                          <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground mt-4">
                      {isRecognizing ? "Analyzing sign language..." : "Waiting for sign language gestures..."}
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-start">
                      <div className="rounded-full bg-primary h-10 w-10 flex items-center justify-center text-primary-foreground">
                        <HandMetal className="h-6 w-6" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-foreground font-medium">Recognized Text:</p>
                        <p className="text-foreground mt-2 text-lg">{recognitionOutput}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="rounded-2xl shadow-xl overflow-hidden sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Instructions</h2>
              <div className="space-y-4">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-muted-foreground">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Supported Sign Languages</h3>
                <div className="grid grid-cols-2 gap-2">
                  {supportedLanguages.map((language) => (
                    <div key={language.name} className="flex items-center">
                      <div className={`flex-shrink-0 h-4 w-4 rounded-full ${getStatusColor(language.status)}`}></div>
                      <p className="ml-2 text-xs text-muted-foreground">{language.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="button" 
                className="mt-6 w-full" 
                onClick={toggleRecognition}
              >
                <Play className="mr-2 h-4 w-4" />
                {isRecognizing ? "Stop Recognition" : "Start Recognition"}
              </Button>
              
              {!isRecognizing && (
                <div className="mt-6 flex justify-center">
                  <SignLanguageIllustration className="w-48 h-48 opacity-70" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
