import { useState, useRef } from "react";
import { 
  Save, 
  RefreshCw,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MicButton } from "@/components/mic-button";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { SpeechRecognitionIllustration } from "@/lib/illustrations";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  sender: "user" | "assistant";
}

export default function SpeechToText() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello, welcome to SilentTalk! How can I help you today?",
      time: "10:22 AM",
      sender: "user"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const { 
    isListening, 
    transcript, 
    toggleListening,
  } = useSpeechRecognition({
    onResult: (text) => {
      setInputText(text);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text: string, sender: "user" | "assistant") => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      time: formatTime(new Date()),
      sender
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    
    // Simulate a response
    if (sender === "user") {
      setTimeout(() => {
        const responses = [
          "I understand. Could you tell me more?",
          "That's interesting! How can I help with that?",
          "I'm processing that information. Please continue.",
          "Thank you for sharing. Is there anything else you'd like to add?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        addMessage(randomResponse, "assistant");
      }, 1000);
    }
    
    setTimeout(scrollToBottom, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addMessage(inputText, "user");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Speech-to-Text Conversion</h1>
        <p className="mt-2 text-lg text-muted-foreground">Convert spoken words to text in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <Card className="rounded-2xl shadow-xl overflow-hidden">
            {/* Microphone Control */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-foreground">Microphone Input</h2>
                <p className="text-sm text-muted-foreground">Speak clearly for best results</p>
              </div>
              <MicButton isListening={isListening} onClick={toggleListening} />
            </div>

            {/* Text Output Section */}
            <CardContent className="p-6 bg-background">
              <div className="bg-muted rounded-lg p-4 min-h-[300px] max-h-[400px] border border-border overflow-y-auto">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex ${message.sender === "assistant" ? "justify-end" : ""}`}
                      >
                        {message.sender === "user" && (
                          <div className="flex-shrink-0 mr-3">
                            <div className="h-10 w-10 rounded-full bg-secondary-500 flex items-center justify-center text-white">
                              <span>U</span>
                            </div>
                          </div>
                        )}
                        <div 
                          className={`p-3 rounded-lg max-w-[80%] ${
                            message.sender === "user" 
                              ? "bg-muted/50 rounded-tl-none" 
                              : "bg-accent/10 rounded-tr-none"
                          }`}
                        >
                          <p className="text-foreground">{message.text}</p>
                          <span className="text-xs text-muted-foreground mt-1 block">{message.time}</span>
                        </div>
                        {message.sender === "assistant" && (
                          <div className="flex-shrink-0 ml-3">
                            <div className="h-10 w-10 rounded-full bg-accent-500 flex items-center justify-center text-white">
                              <span>AI</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isListening && (
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-500/10 text-secondary-500">
                        <span>Listening for speech...</span>
                        <div className="ml-1 flex space-x-1">
                          <motion.div 
                            className="h-2 w-2 bg-secondary-500 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <motion.div 
                            className="h-2 w-2 bg-secondary-500 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div 
                            className="h-2 w-2 bg-secondary-500 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {transcript && (
                    <motion.div 
                      className="flex"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-secondary-500 flex items-center justify-center text-white">
                          <span>U</span>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg rounded-tl-none max-w-[80%] border border-dashed border-secondary-500/30">
                        <p className="text-foreground">{transcript}</p>
                        <span className="text-xs text-muted-foreground mt-1 block">Typing...</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 flex">
                <Input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 focus:ring-secondary-500 focus:border-secondary-500"
                  placeholder="Type if speech isn't detected..."
                />
                <Button 
                  type="submit" 
                  className="ml-3 bg-secondary-500 hover:bg-green-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="rounded-2xl shadow-xl overflow-hidden sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Speech Options</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Recognition Language</Label>
                  <Select defaultValue="en-US">
                    <SelectTrigger id="language" className="w-full mt-1">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                      <SelectItem value="ja-JP">Japanese</SelectItem>
                      <SelectItem value="zh-CN">Mandarin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dialect">Dialect</Label>
                  <Select defaultValue="general">
                    <SelectTrigger id="dialect" className="w-full mt-1">
                      <SelectValue placeholder="Select a dialect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General American</SelectItem>
                      <SelectItem value="british">British</SelectItem>
                      <SelectItem value="australian">Australian</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="canadian">Canadian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-foreground">Continuous Recognition</span>
                    <span className="text-sm text-muted-foreground">Keep listening after pauses</span>
                  </span>
                  <Switch defaultChecked id="continuous-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-foreground">Profanity Filter</span>
                    <span className="text-sm text-muted-foreground">Censor inappropriate language</span>
                  </span>
                  <Switch id="profanity-filter" />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Recognition Accuracy</h3>
                <div className="bg-muted rounded-full overflow-hidden">
                  <div className="h-2 bg-secondary-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>Accuracy: 85%</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="inline-flex items-center justify-center"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Transcript
                </Button>
                <Button 
                  className="inline-flex items-center justify-center bg-secondary-500 hover:bg-green-600"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              
              {!isListening && messages.length < 3 && (
                <div className="mt-6 flex justify-center">
                  <SpeechRecognitionIllustration className="w-48 h-48 opacity-70" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
