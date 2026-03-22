"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { useStore } from "@/lib/store";
import { PathwayView } from "@/lib/types";
import { cn, formatHours, formatWeeks, formatPercentage } from "@/lib/utils";
import { PathwayGraph2D } from "@/components/pathway/graph-2d";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Network, Clock, LayoutList, Columns3, GanttChart, Globe,
  AlertTriangle, Zap, ArrowRight, Route, Download, Calendar,
  TrendingUp, CheckCircle2, ChevronRight
} from "lucide-react";

const VIEW_OPTIONS: { id: PathwayView; label: string; icon: React.ElementType; shortcut: string }[] = [
  { id: "graph_2d", label: "Graph", icon: Network, shortcut: "⌘1" },
  { id: "timeline", label: "Timeline", icon: GanttChart, shortcut: "⌘2" },
  { id: "kanban", label: "Kanban", icon: Columns3, shortcut: "⌘3" },
  { id: "list", label: "List", icon: LayoutList, shortcut: "⌘4" },
  { id: "graph_3d", label: "3D", icon: Globe, shortcut: "⌘5" },
];

export default function PathwayPage() {
  const router = useRouter();
  const { pathway, pathway_view, setPathwayView, gap_analysis } = useStore();

  if (!pathway) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <Card className="max-w-md glass">
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Pathway Generated</h2>
              <p className="text-sm text-muted-foreground mb-6">Upload a resume and JD first.</p>
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
  const totalCourses = phases.reduce((sum, p) => sum + (p.courses?.length || 0), 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Learning <span className="gradient-text">Pathway</span>
              </h1>
              <p className="text-muted-foreground">
                {phases.length} phases • {totalCourses} courses • {formatHours(pathway.total_hours)} total
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => router.push("/reasoning")}>
                <TrendingUp className="w-3.5 h-3.5" /> Reasoning Traces
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <Calendar className="w-3.5 h-3.5" /> Add to Calendar
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: "Phases", value: phases.length, icon: Route, color: "text-primary" },
              { label: "Total Hours", value: formatHours(pathway.total_hours), icon: Clock, color: "text-blue-500" },
              { label: "Weeks", value: formatWeeks(pathway.total_weeks), icon: GanttChart, color: "text-purple-500" },
              { label: "Courses", value: totalCourses, icon: LayoutList, color: "text-emerald-500" },
              { label: "Skipped", value: pathway.modules_skipped, icon: CheckCircle2, color: "text-green-500" },
              { label: "Time Saved", value: `${pathway.time_savings_hours}h`, icon: TrendingUp, color: "text-amber-500" },
            ].map((stat, i) => (
              <Card key={stat.label} className="glass border-border/50">
                <CardContent className="p-3 flex items-center gap-2">
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                  <div>
                    <p className="text-lg font-bold leading-none">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* View Switcher */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/50 w-fit">
            {VIEW_OPTIONS.map((view) => {
              const isActive = pathway_view === view.id;
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setPathwayView(view.id)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{view.label}</span>
                  <span className="text-[10px] text-muted-foreground hidden lg:inline">{view.shortcut}</span>
                  {isActive && (
                    <motion.div layoutId="view-active" className="absolute inset-0 rounded-lg bg-background border border-border shadow-sm -z-10" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                  )}
                </button>
              );
            })}
          </motion.div>

          {/* Main Visualization Area */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="min-h-[600px]">
            {pathway_view === "graph_2d" && <PathwayGraph2D pathway={pathway} gapAnalysis={gap_analysis} />}
            {pathway_view === "timeline" && <TimelineView phases={phases} />}
            {pathway_view === "kanban" && <KanbanView phases={phases} />}
            {pathway_view === "list" && <ListView phases={phases} />}
            {pathway_view === "graph_3d" && (
              <div className="h-[600px] rounded-2xl border border-border/50 bg-muted/20 flex items-center justify-center">
                <p className="text-muted-foreground">3D Graph — requires react-force-graph-3d (install separately)</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}

/* ──── Inline sub-views ──── */

function TimelineView({ phases }: { phases: any[] }) {
  return (
    <Card className="glass border-border/50">
      <CardContent className="p-6">
        <div className="space-y-6">
          {phases.map((phase, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {phase.phase_number}
                </div>
                {i < phases.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{phase.title || `Phase ${phase.phase_number}`}</h3>
                  <Badge variant="secondary" className="text-[10px]">{phase.bloom_level}</Badge>
                  <Badge variant="outline" className="text-[10px]">{formatHours(phase.total_hours)}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(phase.courses || []).map((course: any, ci: number) => (
                    <a key={ci} href={course.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{course.title}</p>
                        <p className="text-[10px] text-muted-foreground">{course.provider} • {formatHours(course.duration_hours)} • {course.format}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanView({ phases }: { phases: any[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {phases.map((phase, i) => (
        <Card key={i} className="glass border-border/50 min-w-[280px] max-w-[320px] flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{phase.title || `Phase ${phase.phase_number}`}</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{phase.courses?.length || 0}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(phase.courses || []).map((course: any, ci: number) => (
              <a key={ci} href={course.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-all">
                <p className="text-xs font-semibold mb-1">{course.title}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[9px] px-1 py-0">{course.provider}</Badge>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0">{formatHours(course.duration_hours)}</Badge>
                </div>
              </a>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ListView({ phases }: { phases: any[] }) {
  return (
    <Card className="glass border-border/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {phases.map((phase, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">{phase.phase_number}</div>
                <h3 className="font-semibold text-sm">{phase.title || `Phase ${phase.phase_number}`}</h3>
                <Badge variant="secondary" className="text-[10px]">{phase.bloom_level}</Badge>
              </div>
              <div className="ml-9 space-y-1.5">
                {(phase.courses || []).map((course: any, ci: number) => (
                  <a key={ci} href={course.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      <input type="checkbox" className="rounded border-border" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{course.title}</p>
                        <p className="text-[10px] text-muted-foreground">{course.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-[10px]">{course.format}</Badge>
                      <span className="text-xs text-muted-foreground">{formatHours(course.duration_hours)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}