"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CONSTRAINT_PRESETS, LEARNING_STYLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings2,
  Clock,
  Zap,
  BookOpen,
  BarChart3,
  Timer,
  Sparkles,
  Video,
  FileText,
  Code2,
  Hammer,
  ScrollText,
  CheckCircle2,
  Brain,
  Gauge,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  video: Video,
  article: FileText,
  interactive: Code2,
  project: Hammer,
  documentation: ScrollText,
};

export function StepPreferences({ onStartAnalysis }: { onStartAnalysis: () => void }) {
  const { pathway_constraints, setPathwayConstraints } = useStore();
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>("full_time");
  const [takeQuiz, setTakeQuiz] = React.useState(false);

  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = CONSTRAINT_PRESETS[presetKey];
    if (preset) {
      setPathwayConstraints({
        max_hours_per_week: preset.max_hours_per_week,
        total_weeks: preset.total_weeks,
        learning_style: preset.learning_style,
        priority_mode: preset.priority_mode,
      });
    }
  };

  const toggleStyle = (styleId: string) => {
    const current = pathway_constraints.learning_style;
    if (current.includes(styleId as any)) {
      if (current.length > 1) {
        setPathwayConstraints({
          learning_style: current.filter((s) => s !== styleId) as any,
        });
      }
    } else {
      setPathwayConstraints({
        learning_style: [...current, styleId] as any,
      });
    }
    setSelectedPreset(null); // custom now
  };

  return (
    <Card className="max-w-3xl mx-auto glass border-border/50 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Settings2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Learning Preferences</CardTitle>
            <CardDescription>
              Customize how your pathway is generated — pace, style, and intensity
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* ── Preset Selection ── */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            Pace Preset
          </Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(CONSTRAINT_PRESETS).map(([key, preset]) => {
              const isSelected = selectedPreset === key;
              return (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handlePresetSelect(key)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200",
                    isSelected
                      ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border/50 bg-card/50 hover:border-primary/20"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                      isSelected ? "border-primary" : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 rounded-full bg-primary"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{preset.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {preset.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px]">
                        <Clock className="w-3 h-3 mr-1" />
                        {preset.max_hours_per_week}h/week
                      </Badge>
                      {preset.total_weeks && (
                        <Badge variant="secondary" className="text-[10px]">
                          <Timer className="w-3 h-3 mr-1" />
                          {preset.total_weeks}w max
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Hours Per Week Slider ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Hours per Week
            </Label>
            <span className="text-2xl font-bold gradient-text">
              {pathway_constraints.max_hours_per_week}h
            </span>
          </div>
          <div className="px-2">
            <Slider
              value={[pathway_constraints.max_hours_per_week]}
              onValueChange={([v]) => {
                setPathwayConstraints({ max_hours_per_week: v });
                setSelectedPreset(null);
              }}
              min={5}
              max={60}
              step={5}
              className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">5h (Casual)</span>
              <span className="text-[10px] text-muted-foreground">60h (Intensive)</span>
            </div>
          </div>
        </div>

        {/* ── Priority Mode ── */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Priority Mode
          </Label>
          <RadioGroup
            value={pathway_constraints.priority_mode}
            onValueChange={(v) => {
              setPathwayConstraints({ priority_mode: v as any });
              setSelectedPreset(null);
            }}
            className="grid sm:grid-cols-3 gap-3"
          >
            {[
              {
                value: "fastest",
                label: "Fastest",
                desc: "Critical skills only, minimum time",
                icon: Zap,
                color: "text-red-500",
              },
              {
                value: "balanced",
                label: "Balanced",
                desc: "Recommended approach, thorough coverage",
                icon: BarChart3,
                color: "text-primary",
              },
              {
                value: "deep_dive",
                label: "Deep Dive",
                desc: "Extra depth, supplementary material",
                icon: BookOpen,
                color: "text-emerald-500",
              },
            ].map((mode) => (
              <Label
                key={mode.value}
                htmlFor={`mode-${mode.value}`}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                  pathway_constraints.priority_mode === mode.value
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/50 hover:border-primary/20"
                )}
              >
                <RadioGroupItem value={mode.value} id={`mode-${mode.value}`} className="mt-1" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <mode.icon className={cn("w-4 h-4", mode.color)} />
                    <span className="text-sm font-semibold">{mode.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{mode.desc}</p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* ── Learning Style ── */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Preferred Learning Formats
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {LEARNING_STYLES.map((style) => {
              const isActive = pathway_constraints.learning_style.includes(style.id as any);
              const Icon = iconMap[style.id] || FileText;
              return (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleStyle(style.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                    isActive
                      ? "border-primary/50 bg-primary/5 shadow-sm"
                      : "border-border/50 bg-card/50 hover:border-primary/20 opacity-60 hover:opacity-100"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      isActive ? "bg-primary/10" : "bg-muted/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {style.label}
                  </span>
                  {isActive && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  )}
                </motion.button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Select at least one. Course recommendations will prioritize your preferred formats.
          </p>
        </div>

        {/* ── Diagnostic Quiz Toggle ── */}
        <div className="p-5 rounded-xl border border-border/50 bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <Label htmlFor="quiz-toggle" className="text-sm font-semibold cursor-pointer">
                  Take Diagnostic Quiz
                </Label>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  A 15-25 question adaptive quiz to validate your skill levels beyond
                  what the resume shows. Uses Item Response Theory for accurate assessment.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-[10px]">
                    ~10 minutes
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Adaptive difficulty
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    +150 XP
                  </Badge>
                </div>
              </div>
            </div>
            <Switch
              id="quiz-toggle"
              checked={takeQuiz}
              onCheckedChange={setTakeQuiz}
            />
          </div>
        </div>

        {/* ── Summary ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Ready to Analyze
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-lg font-bold">{pathway_constraints.max_hours_per_week}h</p>
              <p className="text-[10px] text-muted-foreground">per week</p>
            </div>
            <div>
              <p className="text-lg font-bold capitalize">{pathway_constraints.priority_mode}</p>
              <p className="text-[10px] text-muted-foreground">priority</p>
            </div>
            <div>
              <p className="text-lg font-bold">{pathway_constraints.learning_style.length}</p>
              <p className="text-[10px] text-muted-foreground">formats</p>
            </div>
            <div>
              <p className="text-lg font-bold">{takeQuiz ? "Yes" : "No"}</p>
              <p className="text-[10px] text-muted-foreground">quiz</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Our AI will run a 14-stage pipeline: NER extraction → semantic normalization →
            gap analysis → knowledge graph → adaptive pathing → course matching →
            reasoning traces. This takes about 15-30 seconds.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}