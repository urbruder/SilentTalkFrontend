import { useState, useRef, useEffect } from "react";
import { 
  HandMetal, 
  Play,
  Camera,
  Loader2,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SignLanguageIllustration } from "@/lib/illustrations";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useWebcam } from "@/hooks/use-webcam";
import { signLanguageRecognizer, type RecognizedGesture } from "@/lib/sign-language-recognition";

export default function SignLanguage() {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [recognitionOutput, setRecognitionOutput] = useState<string | null>(null);
  const [recognitionHistory, setRecognitionHistory] = useState<string[]>([]);
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { isWebcamActive, startWebcam, stopWebcam, error: webcamError } = useWebcam(videoRef);

  // Initialize sign language recognition when the component mounts
  useEffect(() => {
    const initializeRecognition = async () => {
      try {
        setIsInitializing(true);
        // This will initialize TensorFlow.js and MediaPipe models
        await signLanguageRecognizer.initializeDetector();
        setIsInitializing(false);
      } catch (error) {
        console.error("Failed to initialize sign language recognition:", error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize sign language recognition. Please try again.",
          variant: "destructive"
        });
        setIsInitializing(false);
      }
    };

    initializeRecognition();

    return () => {
      // Cleanup when the component unmounts
      if (isWebcamActive) {
        stopWebcam();
      }
    };
  }, []);

  // Initialize canvas dimensions to match video when the component mounts
  useEffect(() => {
    const setupCanvas = () => {
      if (videoRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = videoRef.current;
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
      }
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, []);

  // Handle gesture detection
  const handleGestureDetected = (gestures: RecognizedGesture[]) => {
    if (gestures.length > 0) {
      const bestGesture = gestures[0];
      setDetectedGesture(bestGesture.gesture);
      
      // Map gesture names to meaningful text
      const gestureToText: Record<string, string> = {
        "Thumb_Up": "Yes",
        "Thumb_Down": "No",
        "Victory": "Peace",
        "ILoveYou": "I love you",
        "Open_Palm": "Hello",
        "Closed_Fist": "Stop",
        "Pointing_Up": "I",
        "Pointing": "You",
      };
      
      // Generate text representation of the gesture
      const textRepresentation = gestureToText[bestGesture.gesture] || bestGesture.gesture;
      
      // Update recognition output
      setRecognitionOutput(textRepresentation);
      
      // Add to history if it's a new gesture
      if (!recognitionHistory.includes(textRepresentation)) {
        setRecognitionHistory(prev => [...prev, textRepresentation]);
      }
    }
  };

  const toggleRecognition = async () => {
    if (isRecognizing) {
      // Stop recognition
      setIsRecognizing(false);
      stopWebcam();
    } else {
      // Start recognition
      try {
        setRecognitionOutput(null);
        setDetectedGesture(null);
        setRecognitionHistory([]);
        
        // Start webcam
        await startWebcam();
        
        setIsRecognizing(true);
        
        // Start continuous recognition once webcam is active
        if (videoRef.current && canvasRef.current) {
          signLanguageRecognizer.startContinuousRecognition(
            videoRef.current,
            canvasRef.current,
            handleGestureDetected,
            0.7, // confidence threshold
            3 // stable frames required
          );
        }
      } catch (error) {
        console.error("Failed to start sign language recognition:", error);
        toast({
          title: "Error",
          description: "Failed to start webcam or recognition. Please check your camera permissions.",
          variant: "destructive"
        });
      }
    }
  };

  const saveRecognizedText = () => {
    if (recognitionOutput) {
      // In a real app, this would save to the database via an API call
      toast({
        title: "Saved",
        description: "The recognized text has been saved to your history.",
      });
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
            <div className="relative bg-black aspect-video">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
              />
              
              {!isWebcamActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  {isInitializing ? (
                    <div className="text-center">
                      <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                      <p className="mt-2 text-foreground">Initializing AI models...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Camera is off. Start recognition to activate.</p>
                    </div>
                  )}
                </div>
              )}
              
              {detectedGesture && isRecognizing && (
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-medium text-foreground">
                  Detected: {detectedGesture}
                </div>
              )}
            </div>

            {/* Text Output Section */}
            <CardContent className="p-6 bg-background">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-foreground">Recognition Output</h2>
                {recognitionOutput && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={saveRecognizedText}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                )}
              </div>
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
                      {isRecognizing 
                        ? "Analyzing sign language..." 
                        : isInitializing 
                          ? "Loading AI models..." 
                          : "Waiting for sign language gestures..."}
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
                    
                    {recognitionHistory.length > 1 && (
                      <div className="mt-6 border-t border-border pt-4">
                        <h3 className="text-sm font-medium text-foreground mb-2">Recognition History:</h3>
                        <div className="flex flex-wrap gap-2">
                          {recognitionHistory.map((gesture, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                            >
                              {gesture}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                disabled={isInitializing}
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {isRecognizing ? "Stop Recognition" : "Start Recognition"}
                  </>
                )}
              </Button>
              
              {!isRecognizing && !isInitializing && (
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
