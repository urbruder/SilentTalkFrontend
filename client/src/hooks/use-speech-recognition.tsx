import { useState, useEffect, useCallback } from "react";

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
}

interface SpeechRecognitionMessage {
  text: string;
  timestamp: Date;
}

export function useSpeechRecognition({
  onResult,
  onStart,
  onEnd,
  onError,
  continuous = true,
  language = "en-US",
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<SpeechRecognitionMessage[]>([]);
  const [recognition, setRecognition] = useState<any | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      onError?.("Speech recognition is not supported in this browser.");
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;
    
    recognitionInstance.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptValue = result[0].transcript;
      
      setTranscript(transcriptValue);
      onResult?.(transcriptValue);
      
      if (result.isFinal) {
        const newMessage: SpeechRecognitionMessage = {
          text: transcriptValue,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, newMessage]);
        setTranscript("");
      }
    };
    
    recognitionInstance.onstart = () => {
      setIsListening(true);
      onStart?.();
    };
    
    recognitionInstance.onend = () => {
      if (continuous && isListening) {
        recognitionInstance.start();
      } else {
        setIsListening(false);
        onEnd?.();
      }
    };
    
    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      onError?.(event.error);
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [continuous, language, onEnd, onError, onResult, onStart]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  }, [recognition]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    messages,
    startListening,
    stopListening,
    toggleListening,
  };
}
