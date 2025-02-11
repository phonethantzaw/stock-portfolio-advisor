"use client";

import React, { useState, useRef, useEffect } from "react";

import { Button } from "../components/ui/button";
import { Send, ArrowUp, CircleArrowDown } from "lucide-react";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { TextShimmer } from "../components/ui/text-shimmer";
import { sendMessage } from "./actions";

function ChatHome() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Dummy data for testing
// const dummyData = [
//   { user: "You", html: "What are some good tech stocks to invest in?", time: "2:30 PM" },
//   { user: "Stock Advisor", html: "Based on current market analysis, here are some promising tech stocks:<br/><br/>1. AAPL (Apple) - Strong fundamentals and consistent growth<br/>2. MSFT (Microsoft) - Cloud services expansion and AI initiatives<br/>3. GOOGL (Alphabet) - Digital advertising dominance and AI developments<br/>4. NVDA (NVIDIA) - Leading in AI and gaming chips", time: "2:31 PM" },
//   { user: "You", html: "What's the outlook for NVIDIA?", time: "2:32 PM" },
//   { user: "Stock Advisor", html: "NVIDIA (NVDA) has a strong positive outlook due to:<br/><br/>• Dominant position in AI chips market<br/>• Growing demand in data centers<br/>• Gaming sector recovery<br/>• New AI product launches<br/><br/>However, consider the high valuation and market volatility.", time: "2:33 PM" },
//   { user: "You", html: "Should I invest in AI-focused ETFs?", time: "2:34 PM" },
//   { user: "Stock Advisor", html: "AI-focused ETFs can be a good investment strategy. Consider:<br/><br/>1. ROBO - Robotics & Automation ETF<br/>2. AIQ - Global X Artificial Intelligence ETF<br/>3. BOTZ - Global X Robotics & AI ETF<br/><br/>These provide diversified exposure to AI technology.", time: "2:35 PM" },
//   { user: "You", html: "What's your take on cryptocurrency investments?", time: "2:36 PM" },
//   { user: "Stock Advisor", html: "Cryptocurrency investments carry high risk:<br/><br/>Pros:<br/>• High potential returns<br/>• Portfolio diversification<br/>• Growing institutional adoption<br/><br/>Cons:<br/>• High volatility<br/>• Regulatory uncertainty<br/>• Security risks<br/><br/>Consider limiting crypto to 5-10% of your portfolio.", time: "2:37 PM" },
//   { user: "You", html: "How should I diversify my portfolio?", time: "2:38 PM" },
//   { user: "Stock Advisor", html: "A well-diversified portfolio might include:<br/><br/>• 40% Large-cap stocks<br/>• 15% Mid-cap stocks<br/>• 10% Small-cap stocks<br/>• 20% International stocks<br/>• 10% Bonds<br/>• 5% Real estate/REITs<br/><br/>Adjust based on your risk tolerance and goals.", time: "2:39 PM" },
//   { user: "You", html: "What are some good dividend stocks?", time: "2:40 PM" },
//   { user: "Stock Advisor", html: "Here are some reliable dividend stocks:<br/><br/>1. JNJ (Johnson & Johnson) - Healthcare<br/>2. PG (Procter & Gamble) - Consumer goods<br/>3. KO (Coca-Cola) - Beverages<br/>4. VZ (Verizon) - Telecommunications<br/><br/>All have consistent dividend growth history.", time: "2:41 PM" },
//   { user: "You", html: "How do I analyze a stock's fundamentals?", time: "2:42 PM" },
//   { user: "Stock Advisor", html: "Key fundamental analysis metrics:<br/><br/>1. P/E Ratio - Price to Earnings<br/>2. EPS Growth - Earnings Per Share Growth<br/>3. Debt-to-Equity Ratio<br/>4. ROE - Return on Equity<br/>5. Profit Margins<br/>6. Cash Flow<br/><br/>Also consider industry trends and competitive position.", time: "2:43 PM" },
//   { user: "You", html: "What's a good investment strategy for beginners?", time: "2:44 PM" },
//   { user: "Stock Advisor", html: "For beginners, consider:<br/><br/>1. Start with index funds (S&P 500)<br/>2. Use dollar-cost averaging<br/>3. Reinvest dividends<br/>4. Keep emergency fund separate<br/>5. Focus on long-term growth<br/>6. Learn before expanding to individual stocks<br/><br/>Remember: diversification reduces risk.", time: "2:45 PM" },
//   { user: "You", html: "Tell me about ESG investing", time: "2:46 PM" },
//   { user: "Stock Advisor", html: "ESG (Environmental, Social, Governance) investing focuses on:<br/><br/>Environmental:<br/>• Climate change impact<br/>• Resource usage<br/>• Pollution<br/><br/>Social:<br/>• Employee relations<br/>• Community impact<br/>• Human rights<br/><br/>Governance:<br/>• Board diversity<br/>• Corporate ethics<br/>• Shareholder rights", time: "2:47 PM" },
//   { user: "You", html: "What are some common investing mistakes to avoid?", time: "2:48 PM" },
//   { user: "Stock Advisor", html: "Common investing mistakes:<br/><br/>1. Timing the market<br/>2. Emotional trading<br/>3. Lack of diversification<br/>4. Ignoring fees<br/>5. Not having a plan<br/>6. Chasing past performance<br/>7. Neglecting research<br/>8. Investing emergency funds<br/><br/>Stay disciplined and focused on long-term goals.", time: "2:49 PM" },
//   { user: "You", html: "How often should I rebalance my portfolio?", time: "2:50 PM" },
//   { user: "Stock Advisor", html: "Portfolio rebalancing guidelines:<br/><br/>• Annually is standard<br/>• Consider rebalancing when allocations drift 5-10%<br/>• Review quarterly for major market changes<br/>• Tax implications should be considered<br/>• Use new contributions to rebalance when possible<br/><br/>Keep transaction costs in mind.", time: "2:51 PM" }
// ];

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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { user: string; html: string; time: string }[]
  >([]);
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

  const handleSendMessage = async () => {
    const time = new Date().toLocaleTimeString();
    const userMessage = { user: "You", html: input, time };
    
    // Immediately show user's message
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setInput(""); // Clear input right away
    
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      const html = await sendMessage(input);

      // Dummy response
      // const html = "Thank you for your question. This is a dummy response. In a real implementation, this would come from the API.";
      
      // Add bot's response
      setMessages((prevMessages) => [
        { user: "Stock Advisor", html, time: new Date().toLocaleTimeString() },
        ...prevMessages,
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error message in chat
      setMessages((prevMessages) => [
        { 
          user: "Stock Advisor", 
          html: "Sorry, I encountered an error while processing your request. Please try again.", 
          time: new Date().toLocaleTimeString() 
        },
        ...prevMessages,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputLength > 0) {
      handleSendMessage();
    }
  };

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
                        thinking...
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
