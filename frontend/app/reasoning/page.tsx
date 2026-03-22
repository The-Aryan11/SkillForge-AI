"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useStore } from "@/lib/store";
import { cn, GAP_SEVERITY_CONFIG } from "@/lib/utils";
import { ReasoningTrace } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Brain, FileText, Briefcase, BarChart3, Link2, BookOpen, Calendar,
  AlertTriangle, Zap, ChevronRight, ChevronDown, Eye, Shield,
  Bot, CheckCircle2, XCircle, Search, Sparkles, ArrowRight, Info
} from "lucide-react";

export default function ReasoningPage() {
  const router = useRouter();
  const { reasoning_traces, agent_conversation, gap_analysis } = useStore();
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);
  const [showAgents, setShowAgents] = React.useState(false);

  const traceEntries = Object.entries(reasoning_traces || {});

  if (traceEntries.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <Card className="max-w-md glass">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Reasoning Data</h2>
              <p className="text-sm text-muted-foreground mb-6">Complete an analysis to see reasoning traces.</p>
              <Button onClick={() => router.push("/upload")} className="gap-2"><Zap className="w-4 h-4" /> Go to Upload</Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const selectedTrace = selectedSkill ? reasoning_traces[selectedSkill] : null;
  const agentMessages = agent_conversation?.messages || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12">
        <div className="fixed inset-0 -z-10"><div className="absolute inset-0 mesh-gradient opacity-20" /></div>

        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Reasoning <span className="gradient-text">Transparency</span></h1>
            <p className="text-muted-foreground">Complete evidence chain for every recommendation. Click a skill to explore.</p>
          </motion.div>

          {/* Agent Conversation Toggle */}
          {agentMessages.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="glass border-border/50">
                <button onClick={() => setShowAgents(!showAgents)} className="w-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary" /> Multi-Agent Conversation
                        <Badge variant="secondary" className="text-[10px]">{agentMessages.length} messages</Badge>
                        {agent_conversation?.self_corrections ? (
                          <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">
                            {agent_conversation.self_corrections} corrections
                          </Badge>
                        ) : null}
                      </CardTitle>
                      {showAgents ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </CardHeader>
                </button>
                <AnimatePresence>
                  {showAgents && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <CardContent className="pt-0">
                        <ScrollArea className="h-[250px]">
                          <div className="space-y-3">
                            {agentMessages.map((msg, i) => {
                              const agentColors: Record<string, string> = {
                                parser: "border-blue-500/30 bg-blue-500/5",
                                analyst: "border-purple-500/30 bg-purple-500/5",
                                tutor: "border-emerald-500/30 bg-emerald-500/5",
                                critic: "border-amber-500/30 bg-amber-500/5",
                                orchestrator: "border-primary/30 bg-primary/5",
                              };
                              const agentIcons: Record<string, string> = {
                                parser: "🔍", analyst: "📊", tutor: "🎓", critic: "🛡️", orchestrator: "🤖",
                              };
                              return (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                  className={cn("p-3 rounded-xl border", agentColors[msg.agent] || "border-border/50")}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm">{agentIcons[msg.agent] || "🤖"}</span>
                                    <span className="text-xs font-bold">{msg.agent_name}</span>
                                    <Badge variant="secondary" className="text-[9px] px-1 py-0">{msg.stage}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{msg.message}</p>
                                  {msg.corrections && msg.corrections.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {msg.corrections.map((c, ci) => (
                                        <div key={ci} className="text-[10px] text-amber-500 flex items-start gap-1">
                                          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                          <span>{c}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Main Layout: Skill List + Trace Detail */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Skill List */}
            <div className="lg:col-span-2">
              <Card className="glass border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" /> Skill Traces ({traceEntries.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-1.5 pr-4">
                      {traceEntries.map(([skillName, trace], i) => {
                        const isSelected = selectedSkill === skillName;
                        const gap = (gap_analysis?.gaps || []).find(g => g.skill_name === skillName);
                        const sevConfig = gap ? GAP_SEVERITY_CONFIG[gap.severity as keyof typeof GAP_SEVERITY_CONFIG] : null;

                        return (
                          <motion.button key={skillName} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            onClick={() => setSelectedSkill(skillName)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200",
                              isSelected ? "border-primary/50 bg-primary/5 shadow-sm" : "border-transparent hover:bg-muted/50"
                            )}>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{skillName}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {sevConfig && <Badge variant="secondary" className={cn("text-[9px] px-1 py-0", sevConfig.color)}>{sevConfig.label}</Badge>}
                                <span className="text-[10px] text-muted-foreground">
                                  {trace.confidence_level} confidence
                                </span>
                              </div>
                            </div>
                            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", isSelected && "text-primary rotate-90")} />
                          </motion.button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Trace Detail */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selectedTrace ? (
                  <motion.div key={selectedSkill} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <Card className="glass border-border/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          Reasoning: {selectedSkill}
                        </CardTitle>
                        <CardDescription>Complete evidence chain for this recommendation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[450px] pr-4">
                          <div className="space-y-4">
                            {/* Resume Evidence */}
                            <TraceSection icon={FileText} title="Resume Evidence" color="text-blue-500" bgColor="bg-blue-500/5" borderColor="border-blue-500/20">
                              <p className="text-xs text-muted-foreground">
                                {selectedTrace.resume_evidence.found
                                  ? `Found in resume. Inferred level: ${selectedTrace.resume_evidence.inferred_level}/5. Strength: ${selectedTrace.resume_evidence.evidence_strength}`
                                  : "Not found in resume — this is a new skill to learn"}
                              </p>
                            </TraceSection>

                            {/* JD Evidence */}
                            <TraceSection icon={Briefcase} title="JD Evidence" color="text-amber-500" bgColor="bg-amber-500/5" borderColor="border-amber-500/20">
                              <p className="text-xs text-muted-foreground">
                                Importance: <span className="font-semibold capitalize">{selectedTrace.jd_evidence.importance_level}</span>
                                {selectedTrace.jd_evidence.in_requirements && " • Listed in requirements"}
                                {selectedTrace.jd_evidence.in_responsibilities && " • Listed in responsibilities"}
                              </p>
                            </TraceSection>

                            {/* Gap Calculation */}
                            <TraceSection icon={BarChart3} title="Gap Calculation" color="text-red-500" bgColor="bg-red-500/5" borderColor="border-red-500/20">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded-lg bg-muted/50">
                                  <p className="text-[10px] text-muted-foreground">Current</p>
                                  <p className="text-sm font-bold">{selectedTrace.gap_calculation.current}/5</p>
                                </div>
                                <div className="p-2 rounded-lg bg-muted/50">
                                  <p className="text-[10px] text-muted-foreground">Required</p>
                                  <p className="text-sm font-bold">{selectedTrace.gap_calculation.required}/5</p>
                                </div>
                                <div className="p-2 rounded-lg bg-muted/50">
                                  <p className="text-[10px] text-muted-foreground">Composite Score</p>
                                  <p className="text-sm font-bold">{selectedTrace.gap_calculation.composite_score.toFixed(2)}</p>
                                </div>
                                <div className="p-2 rounded-lg bg-muted/50">
                                  <p className="text-[10px] text-muted-foreground">Priority</p>
                                  <p className="text-sm font-bold">#{selectedTrace.gap_calculation.priority_rank} of {selectedTrace.gap_calculation.total_gaps}</p>
                                </div>
                              </div>
                            </TraceSection>

                            {/* Course Selection */}
                            <TraceSection icon={BookOpen} title="Course Selection" color="text-emerald-500" bgColor="bg-emerald-500/5" borderColor="border-emerald-500/20">
                              <p className="text-xs text-muted-foreground mb-2">
                                Searched {selectedTrace.course_selection.courses_searched} courses.
                                Matched {selectedTrace.course_selection.courses_matched}.
                              </p>
                              {selectedTrace.course_selection.selected_course && (
                                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    ✓ Selected: {selectedTrace.course_selection.selected_course}
                                  </p>
                                </div>
                              )}
                              {selectedTrace.course_selection.selection_reasons.map((reason, i) => (
                                <p key={i} className="text-[10px] text-muted-foreground mt-1">• {reason}</p>
                              ))}
                            </TraceSection>

                            {/* Scheduling */}
                            <TraceSection icon={Calendar} title="Scheduling Reasoning" color="text-purple-500" bgColor="bg-purple-500/5" borderColor="border-purple-500/20">
                              <p className="text-xs text-muted-foreground">
                                {selectedTrace.scheduling_reasoning.reason_for_phase}
                              </p>
                              {selectedTrace.scheduling_reasoning.on_critical_path && (
                                <Badge variant="secondary" className="text-[10px] mt-2 bg-red-500/10 text-red-500 border-red-500/20">
                                  ⚡ On Critical Path
                                </Badge>
                              )}
                            </TraceSection>
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="glass border-border/50 h-[550px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">Select a skill to view its reasoning trace</p>
                        <p className="text-xs mt-1">Every recommendation has a complete evidence chain</p>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function TraceSection({ icon: Icon, title, color, bgColor, borderColor, children }: {
  icon: React.ElementType; title: string; color: string; bgColor: string; borderColor: string; children: React.ReactNode;
}) {
  return (
    <div className={cn("p-4 rounded-xl border", bgColor, borderColor)}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
      </div>
      {children}
    </div>
  );
}