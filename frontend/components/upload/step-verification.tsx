"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CheckCircle, XCircle, AlertTriangle, Shield,
  ChevronRight, Sparkles, Eye, Bot,
} from "lucide-react";

const PROFICIENCY_LABELS: Record<number, string> = {
  1: "Awareness", 2: "Beginner", 3: "Intermediate", 4: "Advanced", 5: "Expert",
};

function proficiencyToColor(level: number): string {
  if (level >= 4.5) return "#22c55e";
  if (level >= 3.5) return "#3b82f6";
  if (level >= 2.5) return "#eab308";
  if (level >= 1.5) return "#f97316";
  return "#ef4444";
}

export function StepVerification() {
  const { skill_profile } = useStore() as any;
  const [expandedSkill, setExpandedSkill] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "high" | "low" | "unverified">("all");
  const [localSkills, setLocalSkills] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (skill_profile?.skills) {
      setLocalSkills(skill_profile.skills.map((s: any) => ({ ...s, verified: false })));
    }
  }, [skill_profile]);

  if (!skill_profile || localSkills.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto border-border/50 shadow-xl">
        <CardContent className="py-12 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <p className="text-sm font-medium">No skills extracted yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Complete resume upload and analysis first, then return here to verify.
          </p>
        </CardContent>
      </Card>
    );
  }

  const skills = localSkills;
  const verifiedCount = skills.filter((s) => s.verified).length;
  const lowConfCount = skills.filter((s) => (s.confidence ?? 1) < 0.7).length;

  const filteredSkills = skills.filter((s) => {
    if (filter === "high") return (s.confidence ?? 1) >= 0.8;
    if (filter === "low") return (s.confidence ?? 1) < 0.7;
    if (filter === "unverified") return !s.verified;
    return true;
  });

  const verify = (id: string, verified: boolean, proficiency?: number) => {
    setLocalSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, verified, ...(proficiency !== undefined ? { user_override: proficiency } : {}) }
          : s
      )
    );
  };

  return (
    <Card className="max-w-3xl mx-auto border-border/50 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">Verify Extracted Skills</CardTitle>
            <CardDescription>
              Review what our AI found. Confirm, edit proficiency, or remove incorrect entries.
            </CardDescription>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-lg font-bold">{verifiedCount}/{skills.length}</p>
            <p className="text-xs text-muted-foreground">verified</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {[
            { id: "all" as const, label: `All (${skills.length})` },
            { id: "low" as const, label: `Low Confidence (${lowConfCount})`, warn: lowConfCount > 0 },
            { id: "unverified" as const, label: `Unverified (${skills.length - verifiedCount})` },
          ].map((f) => (
            <Badge
              key={f.id}
              variant={filter === f.id ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-xs transition-colors",
                (f as any).warn && filter !== f.id && "border-amber-500/30 text-amber-500"
              )}
              onClick={() => setFilter(f.id)}
            >
              {(f as any).warn && <AlertTriangle className="w-3 h-3 mr-1" />}
              {f.label}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[420px] pr-4">
          <div className="space-y-2">
            <AnimatePresence>
              {filteredSkills.map((skill, index) => {
                const isExpanded = expandedSkill === skill.id;
                const isLowConf = (skill.confidence ?? 1) < 0.7;

                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      "rounded-xl border transition-all duration-200",
                      skill.verified
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : isLowConf
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-border/50 bg-card/50"
                    )}
                  >
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer"
                      onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{skill.name}</span>
                          {skill.implicit_from && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="text-[9px] px-1 py-0">inferred</Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Inferred from: {skill.implicit_from}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-1.5 rounded-full bg-muted max-w-[100px]">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${((skill.user_override ?? skill.proficiency) / 5) * 100}%`,
                                backgroundColor: proficiencyToColor(skill.user_override ?? skill.proficiency),
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {PROFICIENCY_LABELS[skill.user_override ?? skill.proficiency] ?? "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={cn(
                          "text-xs font-mono px-2 py-0.5 rounded-md",
                          (skill.confidence ?? 1) >= 0.8 ? "bg-emerald-500/10 text-emerald-500"
                          : (skill.confidence ?? 1) >= 0.6 ? "bg-amber-500/10 text-amber-500"
                          : "bg-red-500/10 text-red-500"
                        )}>
                          {((skill.confidence ?? 1) * 100).toFixed(0)}%
                        </div>

                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 rounded-lg"
                          onClick={(e) => { e.stopPropagation(); verify(skill.id, true); }}
                        >
                          <CheckCircle className={cn("w-4 h-4", skill.verified ? "text-emerald-500" : "text-muted-foreground")} />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 rounded-lg"
                          onClick={(e) => { e.stopPropagation(); verify(skill.id, false); }}
                        >
                          <XCircle className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                        <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <Separator />
                          <div className="p-4 space-y-4">
                            {(skill.evidence ?? []).length > 0 && (
                              <div>
                                <p className="text-xs font-semibold mb-2 flex items-center gap-1">
                                  <Eye className="w-3 h-3" /> Evidence from Resume
                                </p>
                                <div className="space-y-1.5">
                                  {(skill.evidence ?? []).map((ev: any, i: number) => (
                                    <div key={i} className="text-xs p-2 rounded-lg bg-muted/50 border border-border/50">
                                      <span className="text-muted-foreground">Line {ev.line_number}: </span>
                                      &quot;{ev.text}&quot;
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {skill.detected_by && (
                                <Badge variant="secondary" className="text-[10px]">
                                  <Bot className="w-3 h-3 mr-1" />{skill.detected_by}
                                </Badge>
                              )}
                              {skill.category && (
                                <Badge variant="secondary" className="text-[10px]">{skill.category}</Badge>
                              )}
                              {skill.onet_code && (
                                <Badge variant="secondary" className="text-[10px]">O*NET: {skill.onet_code}</Badge>
                              )}
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs font-semibold">
                                Adjust Proficiency ({skill.user_override ?? skill.proficiency}/5
                                — {PROFICIENCY_LABELS[skill.user_override ?? skill.proficiency]})
                              </p>
                              <Slider
                                value={[skill.user_override ?? skill.proficiency]}
                                onValueChange={([v]) => verify(skill.id, true, v)}
                                min={1} max={5} step={1}
                                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                              />
                              <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>Awareness</span><span>Beginner</span>
                                <span>Intermediate</span><span>Advanced</span><span>Expert</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline" size="sm" className="text-xs gap-1.5"
            onClick={() => setLocalSkills((prev) => prev.map((s) => ({ ...s, verified: true })))}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Verify All
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5" />
            {lowConfCount > 0 ? `${lowConfCount} skills need your attention` : "All skills look good"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
