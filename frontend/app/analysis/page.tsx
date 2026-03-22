"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useStore, selectReadiness, selectTotalGaps, selectCriticalGaps } from "@/lib/store";
import { cn, formatPercentage, formatHours, GAP_SEVERITY_CONFIG, CATEGORY_CONFIG } from "@/lib/utils";
import { RadarChart } from "@/components/analysis/radar-chart";
import { GapTable } from "@/components/analysis/gap-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3, Route, AlertTriangle, CheckCircle2, Clock, Sparkles, TrendingUp,
  ArrowRight, Brain, Shield, Zap, Eye, ChevronRight, Target
} from "lucide-react";

export default function AnalysisPage() {
  const router = useRouter();
  const { skill_profile, parsed_jd, gap_analysis, roi_analysis } = useStore();
  const readiness = selectReadiness(useStore.getState());
  const totalGaps = selectTotalGaps(useStore.getState());
  const criticalGaps = selectCriticalGaps(useStore.getState());

  if (!gap_analysis || !skill_profile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <Card className="max-w-md mx-auto glass">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Analysis Data</h2>
              <p className="text-sm text-muted-foreground mb-6">Upload a resume and JD first to see your skill analysis.</p>
              <Button onClick={() => router.push("/upload")} className="gap-2">
                <Zap className="w-4 h-4" /> Go to Upload
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const gaps = gap_analysis.gaps || [];
  const strengths = gap_analysis.strengths || [];
  const skills = skill_profile.skills || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 mesh-gradient opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Skill Gap <span className="gradient-text">Analysis</span>
              </h1>
              <p className="text-muted-foreground">
                {parsed_jd?.role_title || "Target Role"} — {skills.length} skills extracted, {gaps.length} gaps identified
              </p>
            </div>
            <Button onClick={() => router.push("/pathway")} className="gap-2 gradient-bg border-0 shadow-lg shadow-primary/20">
              View Learning Pathway <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Readiness", value: formatPercentage(readiness), icon: Target, color: readiness > 0.6 ? "text-emerald-500" : readiness > 0.3 ? "text-amber-500" : "text-red-500", bg: "bg-emerald-500/10" },
              { label: "Skills Found", value: skills.length.toString(), icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Total Gaps", value: totalGaps.toString(), icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Critical Gaps", value: criticalGaps.toString(), icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
              { label: "Time Savings", value: roi_analysis ? `${roi_analysis.hours_saved}h` : "—", icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Card className="glass border-border/50 card-hover">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div>
                      <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Readiness Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Role Readiness</span>
                  </div>
                  <span className="text-2xl font-bold gradient-text">{formatPercentage(readiness)}</span>
                </div>
                <div className="relative h-4 rounded-full bg-muted overflow-hidden">
                  <motion.div className="absolute h-full rounded-full gradient-bg" initial={{ width: 0 }} animate={{ width: formatPercentage(readiness) }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>0% — Not Ready</span>
                  <span>50% — Partial</span>
                  <span>100% — Fully Ready</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content: Radar + Gap Table */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Radar Chart */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
              <Card className="glass border-border/50 h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" /> Skill Radar
                  </CardTitle>
                  <CardDescription>Current skills vs. required skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadarChart skills={skills} gaps={gaps} parsedJD={parsed_jd} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Gap Table */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" /> Skill Gap Details
                  </CardTitle>
                  <CardDescription>{gaps.length} gaps ranked by priority</CardDescription>
                </CardHeader>
                <CardContent>
                  <GapTable gaps={gaps} strengths={strengths} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Strengths Section */}
          {strengths.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Your Strengths
                  </CardTitle>
                  <CardDescription>{strengths.length} skills that meet or exceed requirements — these modules can be skipped</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {strengths.map((s, i) => (
                      <motion.div key={s.skill_name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.03 }}>
                        <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1.5" />
                          {s.skill_name}
                          <span className="ml-1.5 text-xs opacity-60">({s.current_level}/{s.required_level})</span>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}