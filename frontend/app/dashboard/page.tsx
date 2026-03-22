"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useStore, selectPathwayProgress, selectEarnedBadges } from "@/lib/store";
import { cn, formatHours, formatCurrency, formatPercentage } from "@/lib/utils";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Area, AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Trophy, Sparkles, Clock, DollarSign, TrendingUp, Target,
  Zap, AlertTriangle, CheckCircle2, Award, Flame, Calendar,
  ArrowRight, BarChart3, BookOpen, Brain, Route, Star,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const {
    pathway, gap_analysis, roi_analysis, badges,
    xp, streak, competency_trend, skill_profile,
  } = useStore();

  const progress = selectPathwayProgress(useStore.getState());
  const earnedBadges = selectEarnedBadges(useStore.getState());

  if (!pathway || !gap_analysis) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <Card className="max-w-md glass">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Dashboard Data</h2>
              <p className="text-sm text-muted-foreground mb-6">Complete an analysis first.</p>
              <Button onClick={() => router.push("/upload")} className="gap-2">
                <Zap className="w-4 h-4" /> Go to Upload
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const phases = pathway.phases || [];
  const totalModules = phases.reduce((s, p) => s + (p.courses?.length || 0), 0);
  const completedModules = phases.reduce(
    (s, p) => s + (p.courses || []).filter((c: any) => c.status === "completed").length, 0
  );

  // Competency trend data
  const trendData = competency_trend.length > 0
    ? competency_trend
    : [
        { phase: 0, week: 0, readiness: gap_analysis.readiness_score },
        ...phases.map((p, i) => ({
          phase: i + 1,
          week: i + 1,
          readiness: Math.min(0.95, gap_analysis.readiness_score + ((1 - gap_analysis.readiness_score) * (i + 1) / phases.length) * 0.9),
        })),
      ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">
              Progress <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Track your onboarding journey and measure impact.</p>
          </motion.div>

          {/* Top Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Completion Ring */}
            <Card className="glass border-border/50 card-hover">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.91" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15.91" fill="none"
                      stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${progress * 100}, 100`}
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${progress * 100}, 100` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(228, 76%, 59%)" />
                        <stop offset="100%" stopColor="hsl(265, 83%, 57%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{Math.round(progress * 100)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedModules}/{totalModules}</p>
                  <p className="text-xs text-muted-foreground">Modules Complete</p>
                </div>
              </CardContent>
            </Card>

            {/* XP & Level */}
            <Card className="glass border-border/50 card-hover">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="text-2xl font-bold">Level {xp.level}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{xp.current_xp} / {xp.current_xp + xp.xp_to_next_level} XP</span>
                  </div>
                  <Progress value={(xp.current_xp / (xp.current_xp + xp.xp_to_next_level)) * 100} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{xp.total_xp} total XP earned</p>
              </CardContent>
            </Card>

            {/* Streak */}
            <Card className="glass border-border/50 card-hover">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold">{streak.current}</span>
                  <span className="text-sm text-muted-foreground">day streak</span>
                </div>
                <div className="flex gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div key={i} className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold",
                      streak.week_activity[i]
                        ? "bg-orange-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {day}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Best: {streak.best} days</p>
              </CardContent>
            </Card>

            {/* Time Savings */}
            <Card className="glass border-border/50 card-hover">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Time Saved</span>
                </div>
                <p className="text-2xl font-bold text-emerald-500">{roi_analysis?.hours_saved || 0}h</p>
                <p className="text-xs text-muted-foreground">
                  {roi_analysis?.percent_saved ? `${(roi_analysis.percent_saved * 100).toFixed(0)}%` : "0%"} vs standard onboarding
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Middle Row: Competency Trend + ROI */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Competency Trend Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Competency Progression
                  </CardTitle>
                  <CardDescription>Readiness score over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="readinessGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(228, 76%, 59%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(228, 76%, 59%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" tick={{ fontSize: 11 }} label={{ value: "Week", position: "bottom", fontSize: 11 }} />
                        <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                          formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, "Readiness"]}
                        />
                        <Area type="monotone" dataKey="readiness" stroke="hsl(228, 76%, 59%)" fill="url(#readinessGradient)" strokeWidth={2.5} dot={{ fill: "hsl(228, 76%, 59%)", r: 4 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ROI Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass border-border/50 h-full">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" /> ROI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roi_analysis ? (
                    <>
                      <div className="space-y-3">
                        {[
                          { label: "Traditional", value: `${roi_analysis.traditional_hours}h`, sub: "Standard onboarding" },
                          { label: "Optimized", value: `${roi_analysis.optimized_hours}h`, sub: "SkillForge pathway" },
                          { label: "Hours Saved", value: `${roi_analysis.hours_saved}h`, sub: `${(roi_analysis.percent_saved * 100).toFixed(0)}% reduction`, highlight: true },
                        ].map((row) => (
                          <div key={row.label} className={cn("p-3 rounded-lg", row.highlight ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/30")}>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">{row.label}</span>
                              <span className={cn("text-sm font-bold", row.highlight && "text-emerald-500")}>{row.value}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">{row.sub}</p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold">Savings Per Hire</span>
                          <span className="text-lg font-bold text-emerald-500">{formatCurrency(roi_analysis.total_savings_per_hire)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold">Annual (50 hires)</span>
                          <span className="text-lg font-bold gradient-text">{formatCurrency(roi_analysis.annual_savings)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">ROI data not available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Achievements
                  <Badge variant="secondary" className="text-[10px]">{earnedBadges.length}/{badges.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {badges.map((badge) => (
                    <motion.div key={badge.id} whileHover={{ scale: 1.05 }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all",
                        badge.earned
                          ? "border-amber-500/30 bg-amber-500/5"
                          : "border-border/50 bg-muted/20 opacity-40"
                      )}>
                      <span className="text-2xl">{badge.icon}</span>
                      <span className="text-[10px] font-semibold leading-tight">{badge.name}</span>
                      {badge.earned && <CheckCircle2 className="w-3 h-3 text-amber-500" />}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  );
}