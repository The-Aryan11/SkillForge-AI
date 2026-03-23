"use client";
import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { BarChart3, Clock, Zap, Trophy, TrendingUp, BookOpen, ArrowRight, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const { gap_analysis, pathway, roi_analysis, xp, badges, streak } = useStore() as any;

  const stats = [
    { icon: TrendingUp, label: "Role Readiness", value: gap_analysis ? `${gap_analysis.readiness_score?.toFixed(0)}%` : "—", color: "text-blue-400" },
    { icon: Clock, label: "Total Hours", value: pathway ? `${pathway.total_hours ?? "?"}h` : "—", color: "text-violet-400" },
    { icon: DollarSign, label: "Cost Savings", value: roi_analysis ? `$${roi_analysis.cost_savings?.toLocaleString() ?? "?"}` : "—", color: "text-green-400" },
    { icon: Zap, label: "XP Earned", value: `${xp?.current_xp ?? 0}`, color: "text-yellow-400" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Progress Dashboard</h1>
            <p className="text-muted-foreground mb-8">Track your learning journey, ROI, and achievements</p>
          </motion.div>

          {!gap_analysis ? (
            <div className="glass-card p-16 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No data yet</h2>
              <p className="text-muted-foreground mb-6">Complete your analysis to see your personalized dashboard.</p>
              <a href="/upload" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
                Get Started <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass-card p-5">
                    <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Streak */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" /> Learning Streak
                </h3>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-yellow-400">{streak?.current ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Current streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{streak?.best ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Best streak</p>
                  </div>
                  <div className="flex gap-1 ml-auto">
                    {(streak?.week_activity ?? [false,false,false,false,false,false,false]).map((active: boolean, i: number) => (
                      <div key={i} className={`w-8 h-8 rounded-lg ${active ? "bg-yellow-400" : "bg-muted"}`} title={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Achievements
                </h3>
                {(badges ?? []).length === 0 ? (
                  <p className="text-muted-foreground text-sm">Complete modules to earn badges!</p>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {(badges ?? []).map((b: any, i: number) => (
                      <div key={i} className={`text-center p-3 rounded-xl border ${b.earned ? "border-amber-500/30 bg-amber-500/5" : "border-border/30 opacity-40"}`}>
                        <div className="text-2xl mb-1">{b.icon ?? "🏆"}</div>
                        <p className="text-[10px] font-medium">{b.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modules progress */}
              {pathway && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" /> Module Progress
                  </h3>
                  <div className="space-y-3">
                    {(pathway.phases ?? []).flatMap((p: any) => p.modules ?? []).slice(0, 8).map((mod: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${mod.status === "completed" ? "bg-green-400" : mod.status === "in_progress" ? "bg-blue-400" : "bg-muted"}`} />
                        <span className="text-sm flex-1">{mod.skill_name}</span>
                        <span className="text-xs text-muted-foreground">{mod.estimated_hours}h</span>
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
