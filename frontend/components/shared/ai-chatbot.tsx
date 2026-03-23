"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles, Minimize2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChatbot() {
  const { chatbot_open, toggleChatbot, pathway, gap_analysis } = useStore();
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your SkillForge assistant. Ask me anything about your pathway, skill gaps, or recommendations. For example:\n\n• \"Why is Docker before Kubernetes?\"\n• \"Can I skip the SQL module?\"\n• \"How long will Phase 3 take?\"",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          context: {
            pathway_summary: pathway ? `${pathway.phases?.length} phases, ${pathway.total_hours}h total` : null,
            gap_count: gap_analysis?.gaps?.length || 0,
            readiness: gap_analysis?.readiness_score || 0,
          },
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response || "I couldn't process that request. Please try again.",
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {chatbot_open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-2xl border border-border/50 shadow-2xl overflow-hidden flex flex-col glass-strong"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">SkillForge AI</p>
                <p className="text-[10px] text-muted-foreground">Ask about your pathway</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => toggleChatbot()}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted/50 border border-border/50 rounded-bl-md"
                  )}>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border/50 bg-card/80">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about your pathway..."
                className="min-h-[40px] max-h-[80px] resize-none text-sm bg-muted/30 border-border/50 rounded-xl"
                rows={1}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="h-10 w-10 rounded-xl gradient-bg border-0 flex-shrink-0">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}