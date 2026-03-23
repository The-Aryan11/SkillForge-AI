"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { CONSTRAINT_PRESETS, LEARNING_STYLES, ConstraintPreset, LearningStyle } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Settings, Brain, Clock, Zap } from "lucide-react";

export function StepPreferences({ onStartAnalysis }: { onStartAnalysis?: () => void }) {
  const { pathway_constraints, setPathwayConstraints } = useStore();

  const [selectedPreset, setSelectedPreset] = React.useState<string>("standard");
  const [selectedStyles, setSelectedStyles] = React.useState<string[]>(["visual"]);
  const [wantDiagnostic, setWantDiagnostic] = React.useState(false);
  const [maxHours, setMaxHours] = React.useState<number>(
    pathway_constraints?.max_hours_per_week ?? 20
  );

  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = CONSTRAINT_PRESETS.find((p: ConstraintPreset) => p.id === presetId);
    if (preset) {
      setMaxHours(preset.max_hours_per_week);
      setPathwayConstraints({
        max_hours_per_week: preset.max_hours_per_week,
        total_weeks: preset.total_weeks,
        learning_style: selectedStyles[0] ?? "visual",
        priority_mode: "balanced",
      });
    }
  };

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((current: string[]) => {
      if (current.includes(styleId)) {
        if (current.length <= 1) return current; // keep at least one
        return current.filter((s: string) => s !== styleId);
      }
      return [...current, styleId];
    });
  };

  const handleHoursChange = (values: number[]) => {
    const hrs = values[0] ?? 20;
    setMaxHours(hrs);
    setPathwayConstraints({
      ...(pathway_constraints ?? {}),
      max_hours_per_week: hrs,
    });
  };

  return (
    <Card className="max-w-3xl mx-auto border-border/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle>Learning Preferences</CardTitle>
            <CardDescription>Customize your pathway to fit your schedule and style</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Pace presets */}
        <div>
          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" /> Learning Pace
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CONSTRAINT_PRESETS.map((preset: ConstraintPreset) => (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handlePresetSelect(preset.id)}
                className={cn(
                  "p-4 rounded-xl border text-center transition-all",
                  selectedPreset === preset.id
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                <div className="text-2xl mb-1">{preset.icon}</div>
                <p className="font-semibold text-sm">{preset.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{preset.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Hours slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-muted-foreground" /> Weekly Hours
            </p>
            <Badge variant="secondary">{maxHours}h / week</Badge>
          </div>
          <Slider
            value={[maxHours]}
            onValueChange={handleHoursChange}
            min={2}
            max={60}
            step={2}
            className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>2h (minimal)</span>
            <span>30h (full-time)</span>
            <span>60h (intensive)</span>
          </div>
        </div>

        {/* Learning styles */}
        <div>
          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-muted-foreground" /> Learning Style
            <span className="text-[10px] font-normal text-muted-foreground">(select all that apply)</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            {LEARNING_STYLES.map((style: LearningStyle) => (
              <button
                key={style.id}
                onClick={() => toggleStyle(style.id)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border text-left transition-all",
                  selectedStyles.includes(style.id)
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                <span className="text-xl">{style.icon}</span>
                <div>
                  <p className="font-medium text-sm">{style.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{style.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic quiz toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
          <div>
            <p className="font-medium text-sm">Take Diagnostic Quiz</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Optional — calibrates skill levels more accurately using 2-PL IRT
            </p>
          </div>
          <Switch checked={wantDiagnostic} onCheckedChange={setWantDiagnostic} />
        </div>
      </CardContent>
    </Card>
  );
}
