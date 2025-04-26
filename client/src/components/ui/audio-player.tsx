import { useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  className?: string;
}

export function AudioPlayer({ className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
  };

  return (
    <div className={cn("p-6 bg-muted border-t border-border", className)}>
      <div className="flex items-center">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="rounded-full w-10 h-10 flex items-center justify-center text-accent bg-accent/20 hover:bg-accent/30"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <div className="ml-4 flex-1">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
          <div className="relative">
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleProgressChange}
              className="h-2"
              aria-label="Playback progress"
            />
          </div>
        </div>
        
        <div className="ml-4 flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label="Adjust volume"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
          <div className="w-20 ml-2">
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="h-1.5"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
