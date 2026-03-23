"use client";
import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { BarChart3, AlertTriangle, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";

const SEV_COLOR: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  important: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  developmental: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  growth: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function AnalysisPage() {
  const { gap_analysis, skill_profile, parsed_jd } = useStore() as any;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Skill Gap Analysis</h1>
            <p className="text-muted-foreground mb-8">Multi-dimensional gap assessment with priority scoring</p>
          </motion.div>

          {!gap_analysis ? (
            <div className="glass-card p-16 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No analysis yet</h2>
              <p className="text-muted-foreground mb-6">Upload your resume and job description to see your skill gap analysis.</p>
              <a href="/upload" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
                Start Analysis <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Readiness score */}
              <div className="glass-card p-6 flex items-center gap-6">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#3b82f6" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * (gap_analysis.readiness_score / 100)} ${2 * Math.PI * 40}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {gap_analysis.readiness_score?.toFixed(0)}%
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Role Readiness</h2>
                  <p className="text-muted-foreground">for {parsed_jd?.role_title ?? "target role"}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-red-400">{gap_analysis.gaps?.length ?? 0} gaps</span>
                    <span className="text-green-400">{gap_analysis.strengths?.length ?? 0} strengths</span>
                    <span className="text-muted-foreground">{gap_analysis.modules_to_skip ?? 0} modules skipped</span>
                  </div>
                </div>
              </div>

              {/* Gaps */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" /> Skill Gaps
                </h3>
                <div className="space-y-3">
                  {(gap_analysis.gaps ?? []).map((gap: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-3 rounded-lg border ${SEV_COLOR[gap.severity] ?? ""}`}>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{gap.skill_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{gap.reasoning?.slice(0, 80)}...</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">Gap</p>
                        <p className="font-bold">{gap.raw_gap}/5</p>
                      </div>
                      <div className="w-24">
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-full rounded-full bg-current" style={{ width: `${(gap.composite_gap_score / 5) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 text-right">score: {gap.composite_gap_score?.toFixed(1)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              {(gap_analysis.strengths ?? []).length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" /> Your Strengths
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(gap_analysis.strengths ?? []).map((s: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                        <p className="font-medium text-sm">{s.skill_name}</p>
                        <p className="text-xs text-muted-foreground">{s.current_level}/5 — surplus: +{s.surplus}</p>
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
