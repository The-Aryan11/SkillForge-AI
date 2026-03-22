"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, GAP_SEVERITY_CONFIG, PROFICIENCY_LABELS, proficiencyToColor } from "@/lib/utils";
import { SkillGap, SkillStrength, ProficiencyLevel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronRight, ArrowRight, Info, AlertTriangle } from "lucide-react";

interface GapTableProps {
  gaps: SkillGap[];
  strengths: SkillStrength[];
}

export function GapTable({ gaps, strengths }: GapTableProps) {
  const [expandedGap, setExpandedGap] = React.useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = React.useState<string | null>(null);

  const filteredGaps = filterSeverity ? gaps.filter((g) => g.severity === filterSeverity) : gaps;

  const severityCounts = React.useMemo(() => {
    const counts: Record<string, number> = { critical: 0, important: 0, developmental: 0, growth: 0 };
    gaps.forEach((g) => { counts[g.severity] = (counts[g.severity] || 0) + 1; });
    return counts;
  }, [gaps]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-4">
        {/* Severity Filter */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={filterSeverity === null ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setFilterSeverity(null)}
          >
            All ({gaps.length})
          </Badge>
          {(Object.keys(GAP_SEVERITY_CONFIG) as Array<keyof typeof GAP_SEVERITY_CONFIG>).map((sev) => {
            const config = GAP_SEVERITY_CONFIG[sev];
            const count = severityCounts[sev] || 0;
            if (count === 0) return null;
            return (
              <Badge
                key={sev}
                variant={filterSeverity === sev ? "default" : "outline"}
                className={cn("cursor-pointer text-xs", filterSeverity !== sev && config.color)}
                onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
              >
                {config.icon} {config.label} ({count})
              </Badge>
            );
          })}
        </div>

        {/* Gap List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {filteredGaps.map((gap, index) => {
              const isExpanded = expandedGap === gap.skill_name;
              const sevConfig = GAP_SEVERITY_CONFIG[gap.severity as keyof typeof GAP_SEVERITY_CONFIG];

              return (
                <motion.div
                  key={gap.skill_name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn("rounded-xl border transition-all duration-200", sevConfig.bg)}
                >
                  {/* Main Row */}
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/30 rounded-xl transition-colors"
                    onClick={() => setExpandedGap(isExpanded ? null : gap.skill_name)}
                  >
                    {/* Priority Rank */}
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                      #{gap.priority_rank}
                    </div>

                    {/* Skill Name + Severity */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">{gap.skill_name}</span>
                        <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", sevConfig.color)}>
                          {sevConfig.label}
                        </Badge>
                      </div>

                      {/* Progress Bar: Current → Required */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-muted max-w-[120px] relative">
                          {/* Current level */}
                          <div
                            className="absolute h-full rounded-full bg-blue-500"
                            style={{ width: `${(gap.current_level / 5) * 100}%` }}
                          />
                          {/* Required level marker */}
                          <div
                            className="absolute top-0 h-full w-0.5 bg-red-500"
                            style={{ left: `${(gap.required_level / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {gap.current_level} <ArrowRight className="w-2.5 h-2.5 inline" /> {gap.required_level}
                        </span>
                      </div>
                    </div>

                    {/* Composite Score */}
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold">{gap.composite_score.toFixed(2)}</p>
                          <p className="text-[10px] text-muted-foreground">score</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Composite Gap Score = gap × importance × downstream</p>
                      </TooltipContent>
                    </Tooltip>

                    <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", isExpanded && "rotate-90")} />
                  </div>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-border/50"
                      >
                        <div className="p-4 space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2 rounded-lg bg-muted/50">
                              <p className="text-[10px] text-muted-foreground uppercase">Current Level</p>
                              <p className="font-semibold" style={{ color: proficiencyToColor(gap.current_level) }}>
                                {gap.current_level}/5 — {PROFICIENCY_LABELS[Math.round(gap.current_level) as ProficiencyLevel] || "None"}
                              </p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <p className="text-[10px] text-muted-foreground uppercase">Required Level</p>
                              <p className="font-semibold text-red-500">
                                {gap.required_level}/5 — {PROFICIENCY_LABELS[gap.required_level as ProficiencyLevel] || "Unknown"}
                              </p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <p className="text-[10px] text-muted-foreground uppercase">Raw Gap</p>
                              <p className="font-semibold">{gap.raw_gap} levels</p>
                            </div>
                            <div className="p-2 rounded-lg bg-muted/50">
                              <p className="text-[10px] text-muted-foreground uppercase">Importance</p>
                              <p className="font-semibold capitalize">{gap.importance}</p>
                            </div>
                          </div>

                          {gap.reasoning && (
                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
                              <p className="font-semibold text-primary mb-1 flex items-center gap-1">
                                <Info className="w-3 h-3" /> Reasoning
                              </p>
                              <p className="text-muted-foreground">{gap.reasoning}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}