import { useState } from "react";
import { 
  Play, 
  Pause, 
  StopCircle, 
  Download, 
  X, 
  Clipboard, 
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AudioPlayer } from "@/components/ui/audio-player";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { TextToSpeechIllustration } from "@/lib/illustrations";
import { motion } from "framer-motion";

export default function TextToSpeech() {
  const [voiceStyle, setVoiceStyle] = useState("calm");
  const { 
    updateText, 
    speak, 
    pause, 
    stop, 
    isSpeaking, 
    text, 
    recentUtterances 
  } = useSpeechSynthesis();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateText(e.target.value);
  };
  
  const handleClearText = () => {
    updateText("");
  };
  
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      updateText(clipboardText);
    } catch (error) {
      console.error("Failed to read clipboard contents:", error);
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return "Just now";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Text-to-Speech Synthesis</h1>
        <p className="mt-2 text-lg text-muted-foreground">Convert written text into natural-sounding speech</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <Card className="rounded-2xl shadow-xl overflow-hidden">
            {/* Text Input Section */}
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Enter Text</h2>
              <div className="relative">
                <Textarea 
                  rows={8} 
                  className="focus:ring-accent-500 focus:border-accent-500 block w-full text-base resize-none"
                  placeholder="Type or paste text here to convert to speech..."
                  value={text}
                  onChange={handleTextChange}
                  aria-label="Text to convert to speech"
                />
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="p-1.5 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground"
                    onClick={handleClearText}
                    aria-label="Clear text"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="p-1.5 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground"
                    onClick={handlePasteFromClipboard}
                    aria-label="Paste from clipboard"
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap sm:flex-nowrap gap-4">
                <Button
                  type="button"
                  className="flex-1 bg-accent-500 hover:bg-violet-600 text-white"
                  onClick={speak}
                  disabled={!text || isSpeaking}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Speak
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={pause}
                  disabled={!isSpeaking}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={stop}
                  disabled={!isSpeaking}
                >
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={!text}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download MP3
                </Button>
              </div>
            </CardContent>

            {/* Audio Player */}
            <AudioPlayer />

            {/* Recently Generated */}
            <CardContent className="p-6 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Recently Generated</h3>
              <div className="space-y-3">
                {recentUtterances.length > 0 ? (
                  recentUtterances.map((utterance, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {utterance.text.length > 30 
                            ? `${utterance.text.substring(0, 30)}...` 
                            : utterance.text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(utterance.timestamp)} • {utterance.duration} seconds
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="p-1 text-muted-foreground hover:text-foreground"
                          aria-label="Play"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="p-1 text-muted-foreground hover:text-foreground"
                          aria-label="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent utterances. Try speaking some text!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="rounded-2xl shadow-xl overflow-hidden sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Voice Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="voice-type">Voice Type</Label>
                  <Select defaultValue="female1">
                    <SelectTrigger id="voice-type" className="w-full mt-1">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female1">Female 1</SelectItem>
                      <SelectItem value="female2">Female 2</SelectItem>
                      <SelectItem value="male1">Male 1</SelectItem>
                      <SelectItem value="male2">Male 2</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Speaking Style</Label>
                  <RadioGroup 
                    defaultValue="calm" 
                    className="mt-1 grid grid-cols-3 gap-3"
                    value={voiceStyle}
                    onValueChange={setVoiceStyle}
                  >
                    <div>
                      <RadioGroupItem 
                        value="calm" 
                        id="voice-calm"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="voice-calm"
                        className={`flex p-3 w-full h-full border rounded-md text-center items-center justify-center text-sm font-medium uppercase bg-background shadow-sm hover:bg-muted cursor-pointer ${
                          voiceStyle === "calm" 
                            ? "border-accent-500 bg-accent-500/10" 
                            : "border-border"
                        }`}
                      >
                        Calm
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="friendly" 
                        id="voice-friendly"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="voice-friendly"
                        className={`flex p-3 w-full h-full border rounded-md text-center items-center justify-center text-sm font-medium uppercase bg-background shadow-sm hover:bg-muted cursor-pointer ${
                          voiceStyle === "friendly" 
                            ? "border-accent-500 bg-accent-500/10" 
                            : "border-border"
                        }`}
                      >
                        Friendly
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="assertive" 
                        id="voice-assertive"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="voice-assertive"
                        className={`flex p-3 w-full h-full border rounded-md text-center items-center justify-center text-sm font-medium uppercase bg-background shadow-sm hover:bg-muted cursor-pointer ${
                          voiceStyle === "assertive" 
                            ? "border-accent-500 bg-accent-500/10" 
                            : "border-border"
                        }`}
                      >
                        Assertive
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="voice-language">Language</Label>
                  <Select defaultValue="en-US">
                    <SelectTrigger id="voice-language" className="w-full mt-1">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                      <SelectItem value="ja-JP">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="voice-speed" className="block text-sm font-medium text-foreground">Speaking Speed</Label>
                  <Slider
                    id="voice-speed"
                    defaultValue={[1]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full mt-2"
                    aria-label="Speaking speed"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Slower</span>
                    <span>Normal</span>
                    <span>Faster</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="voice-pitch" className="block text-sm font-medium text-foreground">Pitch</Label>
                  <Slider
                    id="voice-pitch"
                    defaultValue={[0]}
                    min={-20}
                    max={20}
                    step={1}
                    className="w-full mt-2"
                    aria-label="Voice pitch"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Lower</span>
                    <span>Normal</span>
                    <span>Higher</span>
                  </div>
                </div>
              </div>

              <Button 
                type="button" 
                className="mt-6 w-full bg-accent-500 hover:bg-violet-600 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Voice Settings
              </Button>
              
              {!text && !isSpeaking && (
                <motion.div 
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <TextToSpeechIllustration className="w-48 h-48 opacity-70" />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
