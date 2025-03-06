"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth";
import { Button } from "../components/ui/button";
import { Send, ArrowUp, CircleArrowDown, Copy, Check, Trash2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { TextShimmer } from "../components/ui/text-shimmer";
import { TypingAnimation, LoadingDots } from "../components/ui/typing-animation";
import { sendMessage, saveChatMessage, getChatHistory, getRateLimit ,deleteChatMessage } from "./actions"; 
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id?: number;
  user: string;
  html: string;
  time: string;
}

function ChatHome() {
  const { token, isAuthenticated } = useAuth();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (typeof window !== 'undefined' && isAuthenticated && token) {
        try {
          const history = await getChatHistory(token);
          const formattedHistory = history.map(msg => ({
            id: msg.id,
            user: msg.role === 'user' ? 'You' : 'Stock Advisor',
            html: msg.message,
            time: new Date(msg.timestamp).toLocaleTimeString()
          }));
          setMessages(formattedHistory.reverse());
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      loadChatHistory();
    }
  }, [isAuthenticated, token]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);
  const inputLength = input.trim().length;

  // Load rate limit on mount and after each message
  const updateRateLimit = async () => {
    if (typeof window !== 'undefined' && isAuthenticated && token) {
      try {
        const limit = await getRateLimit(token);
        setRemainingRequests(limit);
      } catch (error) {
        console.error('Error fetching rate limit:', error);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateRateLimit();
    }
  }, [isAuthenticated, token]);

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    const scrollableArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
    if (scrollableArea) {
      const scrollHeight = scrollableArea.scrollHeight;
      scrollableArea.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const viewport = event.target as HTMLDivElement;
    const scrolledFromBottom = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;
    setShowScrollTop(scrolledFromBottom > 300); // Show when 300px away from bottom
  };

  const scrollToBottom = (smooth = true) => {
    if (scrollAreaRef.current) {
      const scrollableArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (scrollableArea) {
        const scrollHeight = scrollableArea.scrollHeight;
        scrollableArea.scrollTo({
          top: scrollHeight,
          behavior: smooth ? 'smooth' : 'auto'
        });
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const time = new Date().toLocaleTimeString();
    const userMessage = { user: "You", html: input, time };
    
    try {
      // Check authentication before showing user message
      if (!isAuthReady) {
        throw new Error("Authentication is still initializing. Please wait...");
      }

      if (!isAuthenticated) {
        throw new Error("You need to log in to send messages.");
      }

      if (!token) {
        // Try to refresh the page to get a new token
        window.location.reload();
        throw new Error("Session expired. Refreshing the page...");
      }

      // Only show user message if auth checks pass
      setMessages((prevMessages) => [userMessage, ...prevMessages]);
      setInput(""); // Clear input right away

      // Save user message to history
      await saveChatMessage(input, "user", token);

      setIsLoading(true);
      
      // Add a small delay to make the loading animation visible
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const html = await sendMessage(input, token);
      
      // Save assistant's response to history
      await saveChatMessage(html, "assistant", token);

      // Add bot's response with a small delay for smoother transition
      setTimeout(() => {
        setMessages((prevMessages) => [
          { user: "Stock Advisor", html, time: new Date().toLocaleTimeString() },
          ...prevMessages,
        ]);
        
        // Update rate limit after message
        updateRateLimit();
      }, 300);
    } catch (error: any) {
      console.error("Error sending message:", error);
      // Show a more specific error message
      setMessages((prevMessages) => [
        { 
          user: "Stock Advisor", 
          html: error.message || "Sorry, I encountered an error while processing your request. Please try again.", 
          time: new Date().toLocaleTimeString() 
        },
        ...prevMessages,
      ]);

      // If token is missing, trigger a page reload after a short delay
      if (error.message.includes("Session expired")) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300); // Small delay before removing loading indicator
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputLength > 0) {
      handleSendMessage();
    }
  };

  // Handle authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Wait a bit to ensure Keycloak is properly initialized
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (isAuthenticated !== null) {
          setIsAuthReady(true);
          setAuthError(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError('Failed to initialize authentication');
      }
    };

    initAuth();
  }, [isAuthenticated]);

  // Show loading state while authentication is initializing
  if (!isAuthReady) {
    return (
      <div className="container mx-auto max-w-4xl h-[80vh] flex items-center justify-center flex-col gap-4">
        <TextShimmer>Initializing chat...</TextShimmer>
        {authError && (
          <p className="text-sm text-destructive">{authError}</p>
        )}
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl h-[80vh] flex items-center justify-center flex-col gap-4">
        <TextShimmer>Please log in to continue...</TextShimmer>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl h-[80vh] flex flex-col">
        <div className="flex-1 overflow-hidden p-4">
          <div className="relative h-full">
            <ScrollArea 
              className="h-full pr-4" 
              ref={scrollAreaRef} 
              onScrollCapture={handleScroll}
              type="hover"
            >
              <div className="flex flex-col-reverse space-y-4 space-y-reverse">
                {showScrollTop && (
                  <div className="sticky bottom-0 left-0 right-0 flex justify-center py-4 bg-gradient-to-t from-background to-background/0">
                    <Button
                      onClick={() => scrollToBottom(true)}
                      variant="secondary"
                      size="sm"
                      className="h-auto py-1.5 px-3 font-normal text-xs gap-1.5 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors duration-200"
                    >
                      <CircleArrowDown className="h-3 w-3" />
                      Back to bottom
                    </Button>
                  </div>
                )}

                <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-start"
                  >
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="mb-1 text-sm font-semibold">
                        Stock Advisor • <span className="text-xs opacity-70">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono text-sm">
                        <TypingAnimation text="Processing" speed={150} loop={true} />
                        <LoadingDots />
                      </div>
                    </div>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.1 * Math.min(index, 3), // Only delay the first few messages
                      type: "spring",
                      stiffness: 100
                    }}
                    className={`group flex flex-col ${message.user === "You" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-start gap-2">
                      {message.user === "You" && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-background/20"
                            onClick={() => {
                              navigator.clipboard.writeText(message.html.replace(/<[^>]*>/g, ''));
                              setCopiedIndex(index);
                              setTimeout(() => setCopiedIndex(null), 2000);
                            }}
                          >
                            {copiedIndex === index ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          {message.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-background/20"
                              onClick={async () => {
                                try {
                                  const messageId = message.id;
                                  if (messageId === undefined) return;
                                  await deleteChatMessage(messageId, token!);
                                  setMessages(prevMessages => 
                                    prevMessages.filter(msg => 
                                      !(msg.id === messageId && msg.time === message.time)
                                    )
                                  );
                                } catch (error) {
                                  console.error('Error deleting message:', error);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className={`max-w-[80%] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300 ${message.user === "You"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"}`}
                      >
                        <div className="mb-1 text-sm font-semibold flex justify-between items-center">
                          <div>
                            {message.user} • <span className="text-xs opacity-70">{message.time}</span>
                          </div>
                        </div>
                        <div
                          className="prose prose-sm dark:prose-invert overflow-x-auto max-w-none"
                          dangerouslySetInnerHTML={{ __html: message.html }}
                        />
                      </motion.div>
                      {message.user !== "You" && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-background/20"
                            onClick={() => {
                              navigator.clipboard.writeText(message.html.replace(/<[^>]*>/g, ''));
                              setCopiedIndex(index);
                              setTimeout(() => setCopiedIndex(null), 2000);
                            }}
                          >
                            {copiedIndex === index ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex-none border-t">
            {remainingRequests !== null && (
            <div className="text-center text-sm text-muted-foreground py-2 border-b">
              Remaining requests today: {remainingRequests}
            </div>
          )}  
          <motion.div 
            className="flex gap-2 p-4" 
            id="input"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={inputLength === 0 || isLoading}
              size="icon"
              className="transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute inset-0 bg-primary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <Send className="h-4 w-4 relative z-10" />
            </Button>
          </motion.div>
        </div>
    </div>
  );
}

export default ChatHome;
