"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Eye, ChevronDown, ChevronRight, Bot, FileText, BookOpen, ArrowRight } from "lucide-react";

export default function ReasoningPage() {
  const { reasoning_traces, agent_conversation, gap_analysis } = useStore() as any;
  const [expanded, setExpanded] = useState<string | null>(null);

  const traces = Object.values(reasoning_traces ?? {}) as any[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Reasoning Explorer</h1>
            <p className="text-muted-foreground mb-8">Full transparency into every AI decision — evidence chains and agent dialogue</p>
          </motion.div>

          {traces.length === 0 && !agent_conversation ? (
            <div className="glass-card p-16 text-center">
              <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No reasoning data yet</h2>
              <p className="text-muted-foreground mb-6">Complete your analysis to see full reasoning traces for every recommendation.</p>
              <a href="/upload" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
                Start Analysis <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Agent conversation */}
              {agent_conversation && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-violet-400" /> Multi-Agent Pipeline Log
                  </h3>
                  <div className="space-y-3">
                    {(agent_conversation.messages ?? []).map((msg: any, i: number) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-violet-400 mb-1">{msg.agent} Agent</p>
                          <p className="text-sm text-muted-foreground">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Per-skill reasoning traces */}
              {traces.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" /> Per-Recommendation Evidence
                  </h3>
                  <div className="space-y-2">
                    {traces.map((trace: any, i: number) => (
                      <div key={i} className="border border-border/50 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpanded(expanded === trace.skill_name ? null : trace.skill_name)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
                        >
                          <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="font-medium text-sm flex-1">{trace.skill_name}</span>
                          <span className="text-xs text-muted-foreground mr-2">Priority: {trace.priority_score?.toFixed(1)}</span>
                          {expanded === trace.skill_name
                            ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        {expanded === trace.skill_name && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="border-t border-border/50 p-4 space-y-3 text-sm">
                            {trace.resume_evidence && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">FROM YOUR RESUME</p>
                                <p>{trace.resume_evidence}</p>
                              </div>
                            )}
                            {trace.jd_evidence && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">FROM JOB DESCRIPTION</p>
                                <p>{trace.jd_evidence}</p>
                              </div>
                            )}
                            {trace.gap_reasoning && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">GAP ANALYSIS</p>
                                <p>{trace.gap_reasoning}</p>
                              </div>
                            )}
                            {trace.course_reasoning && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">COURSE SELECTION</p>
                                <p>{trace.course_reasoning}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
