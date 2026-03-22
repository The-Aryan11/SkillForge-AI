"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { PIPELINE_STAGES, stageStatusToColor, stageStatusToIcon } from "@/lib/utils";
import { PipelineStage, ProcessingLog, StreamEvent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Terminal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Clock,
  Brain,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export function ProcessingPipeline() {
  const router = useRouter();
  const {
    resume_text,
    jd_text,
    pathway_constraints,
    setIsProcessing,
    setPipelineStages,
    updatePipelineStage,
    addProcessingLog,
    setSkillProfile,
    setParsedJD,
    setGapAnalysis,
    setPathway,
    setAlternativePathways,
    setGraphData,
    setTsneCoords,
    setReasoningTraces,
    setAgentConversation,
    setROIAnalysis,
    setCompetencyTrend,
    setQuizAvailable,
    earnBadge,
    addXP,
  } = useStore();

  const [stages, setLocalStages] = React.useState<PipelineStage[]>(
    PIPELINE_STAGES.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      status: "pending" as const,
      progress: 0,
      result_preview: null,
      duration_ms: null,
      model_used: null,
      error: null,
    }))
  );
  const [logs, setLogs] = React.useState<ProcessingLog[]>([]);
  const [showLogs, setShowLogs] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const [isFailed, setIsFailed] = React.useState(false);
  const [totalTime, setTotalTime] = React.useState(0);
  const [currentStageIndex, setCurrentStageIndex] = React.useState(0);
  const [extractedSkillsPreview, setExtractedSkillsPreview] = React.useState<string[]>([]);
  const [gapsPreview, setGapsPreview] = React.useState<string[]>([]);

  const logEndRef = React.useRef<HTMLDivElement>(null);
  const startTimeRef = React.useRef<number>(Date.now());

  // Timer
  React.useEffect(() => {
    if (isComplete || isFailed) return;
    const interval = setInterval(() => {
      setTotalTime((Date.now() - startTimeRef.current) / 1000);
    }, 100);
    return () => clearInterval(interval);
  }, [isComplete, isFailed]);

  // Auto-scroll logs
  React.useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // ── Run the analysis pipeline ──
  React.useEffect(() => {
    runPipeline();
  }, []);

  const addLog = (stage: string, level: ProcessingLog["level"], message: string) => {
    const log: ProcessingLog = {
      timestamp: new Date().toISOString(),
      stage,
      level,
      message,
    };
    setLogs((prev) => [...prev, log]);
    addProcessingLog(log);
  };

  const updateStage = (
    index: number,
    updates: Partial<PipelineStage>
  ) => {
    setLocalStages((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  };

  const runPipeline = async () => {
    setIsProcessing(true);
    startTimeRef.current = Date.now();

    addLog("system", "info", "SkillForge Analysis Pipeline initialized");
    addLog("system", "info", `Resume: ${resume_text.length} characters`);
    addLog("system", "info", `JD: ${jd_text.length} characters`);

    try {
      // Use SSE streaming endpoint
      const response = await fetch("/api/stream-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text,
          jd_text,
          constraints: pathway_constraints,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event: StreamEvent = JSON.parse(line.slice(6));
              handleStreamEvent(event);
            } catch (e) {
              // skip malformed events
            }
          }
        }
      }

      // Pipeline complete
      setIsComplete(true);
      setIsProcessing(false);
      addLog("system", "success", `Pipeline complete in ${((Date.now() - startTimeRef.current) / 1000).toFixed(1)}s`);
      earnBadge("first_steps");
      addXP(100);
      toast.success("Analysis Complete!", {
        description: "Your personalized learning pathway is ready.",
      });

    } catch (error: any) {
      console.error("Pipeline error:", error);
      setIsFailed(true);
      setIsProcessing(false);
      addLog("system", "error", `Pipeline failed: ${error.message}`);

      // Fallback: try non-streaming endpoint
      addLog("system", "info", "Attempting fallback non-streaming analysis...");
      await runFallbackAnalysis();
    }
  };

  const handleStreamEvent = (event: StreamEvent) => {
    const stageIndex = PIPELINE_STAGES.findIndex((s) => s.id === event.stage);
    if (stageIndex === -1) return;

    setCurrentStageIndex(stageIndex);

    switch (event.status) {
      case "running":
        updateStage(stageIndex, {
          status: "running",
          progress: event.progress || 0,
          model_used: event.data?.model as string || null,
        });
        addLog(event.stage, "info", event.message);
        break;

      case "complete":
        updateStage(stageIndex, {
          status: "complete",
          progress: 100,
          result_preview: event.message,
          duration_ms: event.data?.duration_ms as number || null,
          model_used: event.data?.model as string || null,
        });
        addLog(event.stage, "success", event.message);

        // Extract previews for UI display
        if (event.data?.skills_found) {
          setExtractedSkillsPreview(event.data.skills_found as string[]);
        }
        if (event.data?.gaps_found) {
          setGapsPreview(event.data.gaps_found as string[]);
        }

        // Store results in global state
        if (event.data?.skill_profile) {
          setSkillProfile(event.data.skill_profile as any);
        }
        if (event.data?.parsed_jd) {
          setParsedJD(event.data.parsed_jd as any);
        }
        if (event.data?.gap_analysis) {
          setGapAnalysis(event.data.gap_analysis as any);
        }
        if (event.data?.pathway) {
          setPathway(event.data.pathway as any);
        }
        if (event.data?.graph_data) {
          setGraphData(event.data.graph_data as any);
        }
        if (event.data?.reasoning_traces) {
          setReasoningTraces(event.data.reasoning_traces as any);
        }
        if (event.data?.agent_conversation) {
          setAgentConversation(event.data.agent_conversation as any);
        }
        if (event.data?.roi_analysis) {
          setROIAnalysis(event.data.roi_analysis as any);
        }
        break;

      case "error":
        updateStage(stageIndex, {
          status: "error",
          error: event.message,
        });
        addLog(event.stage, "error", event.message);
        break;
    }
  };

  const runFallbackAnalysis = async () => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text,
          jd_text,
          constraints: pathway_constraints,
        }),
      });

      if (!response.ok) throw new Error("Fallback failed");

      const data = await response.json();

      if (data.success) {
        setSkillProfile(data.data.skill_profile);
        setParsedJD(data.data.parsed_jd);
        setGapAnalysis(data.data.gap_analysis);
        setPathway(data.data.pathway);
        setGraphData(data.data.graph_data);
        setReasoningTraces(data.data.reasoning_traces);
        setAgentConversation(data.data.agent_conversation);
        setROIAnalysis(data.data.roi_analysis);

        // Mark all stages complete
        setLocalStages((prev) =>
          prev.map((s) => ({ ...s, status: "complete" as const, progress: 100 }))
        );

        setIsComplete(true);
        setIsFailed(false);
        setIsProcessing(false);
        addLog("system", "success", "Fallback analysis complete");
        earnBadge("first_steps");
        addXP(100);
        toast.success("Analysis Complete!");
      }
    } catch (err: any) {
      addLog("system", "error", `Fallback also failed: ${err.message}`);
      toast.error("Analysis failed. Please try again.");
    }
  };

  const completedStages = stages.filter((s) => s.status === "complete").length;
  const overallProgress = (completedStages / stages.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Header Card ── */}
      <Card className="glass border-border/50 shadow-xl overflow-hidden">
        <div className="relative">
          {/* Animated gradient bar at top */}
          {!isComplete && !isFailed && (
            <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
              <motion.div
                className="h-full gradient-bg"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                style={{ width: "50%" }}
              />
            </div>
          )}
          {isComplete && <div className="h-1 bg-emerald-500 w-full" />}
          {isFailed && <div className="h-1 bg-destructive w-full" />}

          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                    isComplete
                      ? "bg-emerald-500"
                      : isFailed
                      ? "bg-destructive"
                      : "gradient-bg"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : isFailed ? (
                    <XCircle className="w-6 h-6 text-white" />
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {isComplete
                      ? "Analysis Complete!"
                      : isFailed
                      ? "Analysis Failed"
                      : "Analyzing Your Profile..."}
                  </CardTitle>
                  <CardDescription>
                    {isComplete
                      ? "Your personalized learning pathway is ready"
                      : isFailed
                      ? "Something went wrong. Please try again."
                      : `Stage ${currentStageIndex + 1} of ${stages.length} — ${stages[currentStageIndex]?.name || ""}`}
                  </CardDescription>
                </div>
              </div>

              {/* Timer */}
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-lg font-mono font-bold">
                    {totalTime.toFixed(1)}s
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {completedStages}/{stages.length} stages
                </p>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Overall Progress
                </span>
                <span className="text-xs font-bold">{Math.round(overallProgress)}%</span>
              </div>
              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={cn(
                    "absolute h-full rounded-full",
                    isComplete ? "bg-emerald-500" : "gradient-bg"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                {!isComplete && !isFailed && (
                  <div className="absolute inset-0 progress-glow" style={{ width: `${overallProgress}%` }} />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* ── Stage List ── */}
            <div className="space-y-2">
              {stages.map((stage, index) => {
                const stageConfig = PIPELINE_STAGES[index];
                const isActive = stage.status === "running";
                const isDone = stage.status === "complete";
                const isError = stage.status === "error";

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                      isActive && "bg-primary/5 border border-primary/20 shadow-sm",
                      isDone && "bg-muted/30",
                      isError && "bg-destructive/5 border border-destructive/20"
                    )}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center">
                      {isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Loader2 className="w-5 h-5 text-primary" />
                        </motion.div>
                      ) : isDone ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </motion.div>
                      ) : isError ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : (
                        <span className="text-lg">{stageConfig?.icon}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "text-sm font-medium truncate",
                            isActive && "text-primary",
                            isDone && "text-foreground",
                            !isActive && !isDone && !isError && "text-muted-foreground"
                          )}
                        >
                          {stageConfig?.name || stage.name}
                        </p>
                        {stage.model_used && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">
                            {stage.model_used}
                          </Badge>
                        )}
                      </div>
                      {(isActive || isDone) && stage.result_preview && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-muted-foreground truncate mt-0.5"
                        >
                          {stage.result_preview}
                        </motion.p>
                      )}
                    </div>

                    {/* Duration */}
                    {isDone && stage.duration_ms !== null && (
                      <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
                        {stage.duration_ms < 1000
                          ? `${stage.duration_ms}ms`
                          : `${(stage.duration_ms / 1000).toFixed(1)}s`}
                      </span>
                    )}

                    {/* Progress bar for active stage */}
                    {isActive && (
                      <div className="w-16 flex-shrink-0">
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full gradient-bg rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${stage.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ── Live Previews ── */}
            <AnimatePresence>
              {extractedSkillsPreview.length > 0 && !isComplete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
                >
                  <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Skills detected so far:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedSkillsPreview.map((skill, i) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Badge variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Processing Log (Collapsible) ── */}
            <div className="mt-4">
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                Processing Log ({logs.length} entries)
                {showLogs ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              <AnimatePresence>
                {showLogs && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ScrollArea className="h-[200px] mt-2 rounded-lg bg-[#0d1117] border border-border/50 p-3">
                      <div className="space-y-0.5 font-mono text-xs">
                        {logs.map((log, i) => (
                          <div key={i} className="flex gap-2">
                            <span className="text-muted-foreground/60 flex-shrink-0">
                              [{new Date(log.timestamp).toISOString().split("T")[1].split(".")[0]}]
                            </span>
                            <span
                              className={cn(
                                "flex-shrink-0 w-16",
                                log.level === "success" && "text-emerald-400",
                                log.level === "error" && "text-red-400",
                                log.level === "warning" && "text-amber-400",
                                log.level === "info" && "text-blue-400"
                              )}
                            >
                              [{log.stage.substring(0, 12)}]
                            </span>
                            <span className="text-gray-300">{log.message}</span>
                          </div>
                        ))}
                        <div ref={logEndRef} />
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Completion Actions ── */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 space-y-4"
                >
                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Skills Found",
                        value: extractedSkillsPreview.length || "—",
                        icon: Sparkles,
                        color: "text-blue-500",
                      },
                      {
                        label: "Gaps Detected",
                        value: gapsPreview.length || "—",
                        icon: Eye,
                        color: "text-red-500",
                      },
                      {
                        label: "Processing Time",
                        value: `${totalTime.toFixed(1)}s`,
                        icon: Clock,
                        color: "text-amber-500",
                      },
                      {
                        label: "Models Used",
                        value: stages.filter((s) => s.model_used).length,
                        icon: Brain,
                        color: "text-purple-500",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center p-3 rounded-xl bg-muted/30 border border-border/50"
                      >
                        <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                        <p className="text-lg font-bold">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => router.push("/analysis")}
                      className="flex-1 h-12 gap-2 gradient-bg border-0 shadow-lg shadow-primary/20 text-base font-semibold"
                    >
                      View Skill Analysis
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/pathway")}
                      className="flex-1 h-12 gap-2 text-base"
                    >
                      <Zap className="w-4 h-4" />
                      Jump to Pathway
                    </Button>
                  </div>

                  {/* XP Earned Toast */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 text-sm text-amber-500"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">+100 XP earned!</span>
                    <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">
                      🏅 First Steps badge unlocked
                    </Badge>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}