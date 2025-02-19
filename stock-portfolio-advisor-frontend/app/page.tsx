"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth";
import { Button } from "../components/ui/button";
import { Send, ArrowUp, CircleArrowDown } from "lucide-react";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { TextShimmer } from "../components/ui/text-shimmer";
import { sendMessage, saveChatMessage, getChatHistory } from "./actions";

interface Message {
  user: string;
  html: string;
  time: string;
}

function ChatHome() {
  const { token, isAuthenticated } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (isAuthenticated && token) {
        try {
          const history = await getChatHistory(token);
          const formattedHistory = history.map(msg => ({
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

    loadChatHistory();
  }, [isAuthenticated, token]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputLength = input.trim().length;

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
      const html = await sendMessage(input, token);
      
      // Save assistant's response to history
      await saveChatMessage(html, "assistant", token);

      // Add bot's response
      setMessages((prevMessages) => [
        { user: "Stock Advisor", html, time: new Date().toLocaleTimeString() },
        ...prevMessages,
      ]);
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
      setIsLoading(false);
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
    <div className="container mx-auto max-w-4xl h-[80vh] flex flex-col">
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
                      onClick={scrollToBottom}
                      variant="secondary"
                      size="sm"
                      className="h-auto py-1.5 px-3 font-normal text-xs gap-1.5 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors duration-200"
                    >
                      <CircleArrowDown className="h-3 w-3" />
                      Back to bottom
                    </Button>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                      <div className="mb-1 text-sm font-semibold">
                        Stock Advisor • <span className="text-xs opacity-70">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <TextShimmer className="font-mono text-sm" duration={1}>
                        processing...
                      </TextShimmer>
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${message.user === "You" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${message.user === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"}`}
                    >
                      <div className="mb-1 text-sm font-semibold">
                        {message.user} • <span className="text-xs opacity-70">{message.time}</span>
                      </div>
                      <div
                        className="prose prose-sm dark:prose-invert overflow-x-auto max-w-none"
                        dangerouslySetInnerHTML={{ __html: message.html }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex-none p-4 border-t">
          <div className="flex gap-2" id="input">
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
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
    </div>
  );
}


export default ChatHome;
