"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { GitBranch, List, LayoutGrid, Clock, ArrowRight, BookOpen, ExternalLink } from "lucide-react";

type View = "graph" | "list" | "timeline";

export default function PathwayPage() {
  const { pathway } = useStore() as any;
  const [view, setView] = useState<View>("list");

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2 gradient-text">Learning Pathway</h1>
                <p className="text-muted-foreground">Your personalized, phase-based onboarding plan</p>
              </div>
              {/* View Toggle */}
              <div className="flex gap-2 bg-muted rounded-lg p-1">
                {([["graph", GitBranch, "Graph"], ["list", List, "List"], ["timeline", Clock, "Timeline"]] as const).map(([v, Icon, label]) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${view === v ? "bg-background shadow text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {!pathway ? (
            <div className="glass-card p-16 text-center">
              <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No pathway generated yet</h2>
              <p className="text-muted-foreground mb-6">Upload your resume and a job description to generate your personalized learning pathway.</p>
              <a href="/upload" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Get Started <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {(pathway.phases ?? []).map((phase: any, i: number) => (
                <motion.div
                  key={phase.phase_number ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {phase.phase_number ?? i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{phase.title ?? `Phase ${i + 1}`}</h3>
                      <p className="text-xs text-muted-foreground">{phase.description ?? ""}</p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">{phase.total_hours ?? "?"} hrs</div>
                  </div>
                  <div className="space-y-3">
                    {(phase.modules ?? []).map((mod: any, j: number) => (
                      <div key={j} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{mod.skill_name}</p>
                          {(mod.courses ?? []).slice(0, 2).map((c: any, k: number) => (
                            <a key={k} href={c.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-400 hover:underline mt-1">
                              {c.title} — {c.provider} <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          mod.gap_severity === "critical" ? "bg-red-500/10 text-red-400" :
                          mod.gap_severity === "important" ? "bg-orange-500/10 text-orange-400" :
                          "bg-blue-500/10 text-blue-400"}`}>
                          {mod.gap_severity ?? "dev"}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
