import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Video, MicOff, Settings } from "lucide-react";
import { useWebcam } from "@/hooks/use-webcam";
import { cn } from "@/lib/utils";

interface WebcamPreviewProps {
  className?: string;
}

export function WebcamPreview({ className }: WebcamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isWebcamActive, startWebcam, stopWebcam } = useWebcam(videoRef);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize webcam when component mounts
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  const toggleCamera = () => {
    if (isWebcamActive) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  return (
    <div className={cn("bg-gray-800 aspect-video relative rounded-t-lg overflow-hidden", className)}>
      {isWebcamActive ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 text-white">
            <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">Camera Off</h3>
            <p className="text-gray-300 mb-4">Enable your camera to start sign language recognition</p>
            <Button
              onClick={toggleCamera}
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Start Camera
            </Button>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button
          type="button"
          onClick={toggleCamera}
          size="icon"
          className="p-2 bg-white bg-opacity-25 rounded-full text-white hover:bg-opacity-40"
          aria-label={isWebcamActive ? "Turn off camera" : "Turn on camera"}
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          size="icon"
          className="p-2 bg-white bg-opacity-25 rounded-full text-white hover:bg-opacity-40"
          aria-label="Toggle microphone"
        >
          <MicOff className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          size="icon"
          className="p-2 bg-white bg-opacity-25 rounded-full text-white hover:bg-opacity-40"
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
