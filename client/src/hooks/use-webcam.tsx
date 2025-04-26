import { useState, useEffect, RefObject } from "react";

export function useWebcam(videoRef: RefObject<HTMLVideoElement>) {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startWebcam = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsWebcamActive(true);
    } catch (err) {
      setError("Failed to access camera. Please check permissions.");
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setStream(null);
      setIsWebcamActive(false);
    }
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  return { isWebcamActive, startWebcam, stopWebcam, error };
}
