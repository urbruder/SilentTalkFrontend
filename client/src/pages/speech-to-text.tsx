import { useState, useRef, useEffect } from "react";
import { 
  Save, 
  RefreshCw,
  Send,
  Loader2,
  List,
  Clock,
  Plus
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
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getConversations, 
  createConversation, 
  getConversationMessages, 
  createMessage 
} from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Conversation } from '@shared/schema';

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  sender: "user" | "assistant";
}

export default function SpeechToText() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hello, welcome to SilentTalk! How can I help you today?",
      time: formatTime(new Date()),
      sender: "assistant"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [continuous, setContinuous] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [conversationTitle, setConversationTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get conversations from the backend
  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: getConversations
  });

  // Create a new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (data) => {
      setCurrentConversationId(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      
      // Add all current messages to the new conversation
      messages.forEach(msg => {
        if (msg.id !== "welcome") {
          createMessageMutation.mutate({
            conversationId: data.id,
            message: {
              content: msg.text,
              type: msg.sender === "user" ? "user" : "system"
            }
          });
        }
      });
      
      toast({
        title: "Conversation Saved",
        description: `"${data.title}" has been saved successfully.`,
      });
      
      setIsSaving(false);
      setSaveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save conversation. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: ({ conversationId, message }: { 
      conversationId: number, 
      message: { content: string, type: string } 
    }) => createMessage(conversationId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/conversations', currentConversationId, 'messages'] 
      });
    }
  });

  // Format time for messages
  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Speech recognition hook
  const { 
    isListening, 
    transcript, 
    toggleListening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: (text) => {
      setInputText(text);
    },
    continuous,
    language: selectedLanguage,
  });

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadConversationMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add a message to the chat
  const addMessage = (text: string, sender: "user" | "assistant") => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      time: formatTime(new Date()),
      sender
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    
    // If we have an active conversation, save the message to the database
    if (currentConversationId) {
      createMessageMutation.mutate({
        conversationId: currentConversationId,
        message: {
          content: text,
          type: sender === "user" ? "user" : "system"
        }
      });
    }
    
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
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addMessage(inputText, "user");
    }
  };

  // Reset conversation
  const resetConversation = () => {
    setMessages([{
      id: "welcome",
      text: "Hello, welcome to SilentTalk! How can I help you today?",
      time: formatTime(new Date()),
      sender: "assistant"
    }]);
    setCurrentConversationId(null);
    setSelectedConversation(null);
    setConversationTitle("");
  };

  // Save the current conversation
  const saveConversation = () => {
    if (!conversationTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the conversation.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Create a new conversation
    createConversationMutation.mutate({
      title: conversationTitle,
      language: selectedLanguage,
      type: "speech-to-text"
    });
  };

  // Load messages from a conversation
  const loadConversationMessages = async (conversationId: number) => {
    try {
      const conversationMessages = await getConversationMessages(conversationId);
      
      // Convert to ChatMessage format
      const chatMessages = conversationMessages.map(msg => ({
        id: msg.id.toString(),
        text: msg.content,
        time: formatTime(new Date(msg.createdAt)),
        sender: msg.type === "user" ? "user" : "assistant"
      }));
      
      // Add welcome message if empty
      if (chatMessages.length === 0) {
        chatMessages.unshift({
          id: "welcome",
          text: "Hello, welcome to SilentTalk! How can I help you today?",
          time: formatTime(new Date()),
          sender: "assistant"
        });
      }
      
      setMessages(chatMessages);
      setCurrentConversationId(conversationId);
      
      // Find the conversation to set the title
      if (conversations) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
          setConversationTitle(conversation.title);
        }
      }
      
    } catch (error) {
      console.error("Error loading conversation messages:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation messages.",
        variant: "destructive",
      });
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
            {/* Conversation Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-foreground">
                  {currentConversationId
                    ? `Conversation: ${conversationTitle}`
                    : "New Conversation"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentConversationId
                    ? "This conversation is being saved automatically"
                    : "Speak clearly for best results"}
                </p>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-foreground">Speech Options</h2>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <List className="mr-2 h-4 w-4" />
                      Conversations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Your Conversations</DialogTitle>
                      <DialogDescription>
                        Select a conversation to continue where you left off.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {isLoadingConversations ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : conversations && conversations.length > 0 ? (
                        conversations.map((conversation) => (
                          <Button
                            key={conversation.id}
                            variant="outline"
                            className="w-full justify-start text-left"
                            onClick={() => {
                              setSelectedConversation(conversation);
                              queryClient.invalidateQueries({ 
                                queryKey: ['/api/conversations', conversation.id, 'messages'] 
                              });
                            }}
                          >
                            <div className="flex items-center w-full">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div className="flex-1 truncate">{conversation.title}</div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(conversation.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </Button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No conversations found. Start a new one!
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          resetConversation();
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Conversation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Recognition Language</Label>
                  <Select 
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
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
                  <Switch 
                    checked={continuous}
                    onCheckedChange={setContinuous}
                    id="continuous-mode" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-foreground">Profanity Filter</span>
                    <span className="text-sm text-muted-foreground">Censor inappropriate language</span>
                  </span>
                  <Switch 
                    checked={profanityFilter}
                    onCheckedChange={setProfanityFilter}
                    id="profanity-filter" 
                  />
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
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="inline-flex items-center justify-center"
                      disabled={messages.length <= 1 || currentConversationId !== null}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Conversation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Conversation</DialogTitle>
                      <DialogDescription>
                        Give your conversation a title to save it for later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Conversation Title</Label>
                        <Input
                          id="title"
                          placeholder="E.g., Meeting Notes, Shopping List, etc."
                          value={conversationTitle}
                          onChange={(e) => setConversationTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveConversation} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  className="inline-flex items-center justify-center bg-secondary-500 hover:bg-green-600"
                  onClick={resetConversation}
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
