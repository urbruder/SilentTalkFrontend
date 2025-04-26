import { useState, useEffect, useCallback } from "react";

interface UseSpeechSynthesisOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeechSynthesis({
  onStart,
  onEnd,
  onError,
  rate = 1,
  pitch = 1,
  volume = 1,
}: UseSpeechSynthesisOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [recentUtterances, setRecentUtterances] = useState<Array<{text: string, timestamp: Date, duration: number}>>([]);

  // Initialize and load voices
  useEffect(() => {
    if (!window.speechSynthesis) {
      onError?.("Speech synthesis is not supported in this browser.");
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set a default voice (preferably English)
      const defaultVoice = availableVoices.find(
        (voice) => voice.lang.includes("en-US") && voice.default
      ) || availableVoices[0];
      
      setSelectedVoice(defaultVoice || null);
    };

    loadVoices();
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [onError]);

  // Create and update utterance when text or voice settings change
  useEffect(() => {
    if (!text || !window.speechSynthesis) return;
    
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      newUtterance.voice = selectedVoice;
    }
    
    newUtterance.rate = rate;
    newUtterance.pitch = pitch;
    newUtterance.volume = volume;
    
    newUtterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };
    
    newUtterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
      
      // Add to recent utterances
      setRecentUtterances((prevUtterances) => [
        {
          text,
          timestamp: new Date(),
          duration: Math.ceil(text.length / 8), // Rough estimate of duration in seconds
        },
        ...prevUtterances.slice(0, 4), // Keep only 5 most recent
      ]);
    };
    
    newUtterance.onerror = (event) => {
      console.error("Speech synthesis error", event);
      setIsSpeaking(false);
      onError?.(event.error || "An error occurred during speech synthesis");
    };
    
    setUtterance(newUtterance);
    
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, selectedVoice, rate, pitch, volume, onStart, onEnd, onError]);

  const speak = useCallback(() => {
    if (!utterance || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  }, [utterance]);

  const pause = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const updateText = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const selectVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    voices,
    selectedVoice,
    isSpeaking,
    text,
    recentUtterances,
    speak,
    pause,
    resume,
    stop,
    updateText,
    selectVoice,
  };
}
