"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PIPELINE_STAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle, Loader2, XCircle, Clock,
  Sparkles, ArrowRight, Terminal,
} from "lucide-react";

interface Stage {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "complete" | "error";
  message?: string;
}

const DEMO_RESULT = {
  skill_profile: {
    skills: [
      { id: "1", name: "Python",     category: "programming_language", proficiency: 4, years_experience: 3, recency: "current", depth: "deep", evidence: [{ text: "Built ML pipelines at Company X", line_number: 12, section: "Experience", context_type: "professional" }], confidence: 0.95, implicit_from: null, decay_adjusted_proficiency: 4, detected_by: "spaCy NER", verified: false, user_override: null },
      { id: "2", name: "SQL",        category: "database",             proficiency: 3, years_experience: 2, recency: "current", depth: "working", evidence: [{ text: "Database management and reporting", line_number: 18, section: "Experience", context_type: "professional" }], confidence: 0.88, implicit_from: null, decay_adjusted_proficiency: 3, detected_by: "spaCy NER", verified: false, user_override: null },
      { id: "3", name: "React",      category: "framework",            proficiency: 3, years_experience: 2, recency: "current", depth: "working", evidence: [{ text: "Built React dashboard", line_number: 22, section: "Projects", context_type: "professional" }], confidence: 0.92, implicit_from: null, decay_adjusted_proficiency: 3, detected_by: "BART classifier", verified: false, user_override: null },
      { id: "4", name: "JavaScript", category: "programming_language", proficiency: 3, years_experience: 2, recency: "current", depth: "working", evidence: [], confidence: 0.85, implicit_from: "React", decay_adjusted_proficiency: 3, detected_by: "Inference engine", verified: false, user_override: null },
      { id: "5", name: "Git",        category: "devops_tool",          proficiency: 4, years_experience: 3, recency: "current", depth: "deep", evidence: [{ text: "Version control with Git", line_number: 30, section: "Skills", context_type: "professional" }], confidence: 0.9, implicit_from: null, decay_adjusted_proficiency: 4, detected_by: "spaCy NER", verified: false, user_override: null },
    ],
    education: [{ degree: "B.Tech", field: "Computer Science", institution: "Demo University", year: 2021, gpa: null }],
    total_experience_years: 3,
    domains: ["Technology"],
    certifications: [],
    summary: "A software developer with 3 years of experience in Python, SQL, and React.",
    extraction_metadata: { total_entities_found: 5, ner_model: "spaCy en_core_web_trf", classifier_model: "BART-MNLI", embedding_model: "MiniLM-L6-v2", proficiency_model: "RandomForest", processing_time_ms: 1240, stages_completed: [] },
  },
  parsed_jd: {
    role_title: "Software Engineer (Mid-level)",
    department: "Engineering",
    seniority: "mid",
    onet_soc_code: "15-1252.00",
    onet_occupation_title: "Software Developers",
    required_skills: [
      { name: "Python",     normalized_name: "Python",     onet_code: null, required_proficiency: 4, importance: "critical", context: "primary language", category: "programming_language" },
      { name: "React",      normalized_name: "React",      onet_code: null, required_proficiency: 4, importance: "high",     context: "frontend",        category: "framework" },
      { name: "AWS",        normalized_name: "AWS",        onet_code: null, required_proficiency: 3, importance: "high",     context: "cloud platform",  category: "cloud_platform" },
      { name: "Docker",     normalized_name: "Docker",     onet_code: null, required_proficiency: 3, importance: "high",     context: "containers",      category: "devops_tool" },
      { name: "SQL",        normalized_name: "SQL",        onet_code: null, required_proficiency: 4, importance: "critical", context: "databases",       category: "database" },
      { name: "TypeScript", normalized_name: "TypeScript", onet_code: null, required_proficiency: 3, importance: "medium",   context: "type safety",     category: "programming_language" },
    ],
    preferred_skills: [],
    soft_skills: [{ name: "Communication", normalized_name: "Communication", onet_code: null, required_proficiency: 3, importance: "high", context: "team collaboration", category: "soft_skill" }],
    education_requirements: ["Bachelor's degree in CS or related"],
    experience_requirements: "3+ years",
    domain: "Technology",
    raw_text: "",
  },
  gap_analysis: {
    gaps: [
      { skill_name: "AWS",        normalized_name: "AWS",        onet_code: null, current_level: 0, required_level: 3, raw_gap: 3, importance: "high",     importance_weight: 0.8, onet_importance: 0.8, downstream_count: 2, transferability_factor: 0.7, composite_gap_score: 2.4, severity: "important",     priority_rank: 1, evidence_for_current: [], evidence_for_required: "Required for cloud infrastructure", decay_applied: false, original_proficiency: 0, prerequisite_gaps: ["Linux", "Cloud Computing Fundamentals"], reasoning: "No AWS experience found in resume. Required for primary infrastructure work." },
      { skill_name: "Docker",     normalized_name: "Docker",     onet_code: null, current_level: 0, required_level: 3, raw_gap: 3, importance: "high",     importance_weight: 0.8, onet_importance: 0.7, downstream_count: 1, transferability_factor: 0.8, composite_gap_score: 2.2, severity: "important",     priority_rank: 2, evidence_for_current: [], evidence_for_required: "Required for containerized deployments", decay_applied: false, original_proficiency: 0, prerequisite_gaps: ["Linux"], reasoning: "No Docker experience detected. Needed for deployment pipeline." },
      { skill_name: "TypeScript", normalized_name: "TypeScript", onet_code: null, current_level: 0, required_level: 3, raw_gap: 3, importance: "medium",   importance_weight: 0.6, onet_importance: 0.6, downstream_count: 0, transferability_factor: 0.5, composite_gap_score: 1.5, severity: "developmental", priority_rank: 3, evidence_for_current: [], evidence_for_required: "Type-safe frontend development", decay_applied: false, original_proficiency: 0, prerequisite_gaps: ["JavaScript"], reasoning: "JavaScript present (inferred from React) but TypeScript not found." },
      { skill_name: "React",      normalized_name: "React",      onet_code: null, current_level: 3, required_level: 4, raw_gap: 1, importance: "high",     importance_weight: 0.8, onet_importance: 0.8, downstream_count: 1, transferability_factor: 0.9, composite_gap_score: 0.8, severity: "developmental", priority_rank: 4, evidence_for_current: [], evidence_for_required: "Advanced React patterns needed", decay_applied: false, original_proficiency: 3, prerequisite_gaps: [], reasoning: "React found at level 3, but level 4 (Advanced) is required." },
      { skill_name: "SQL",        normalized_name: "SQL",        onet_code: null, current_level: 3, required_level: 4, raw_gap: 1, importance: "critical",  importance_weight: 1.0, onet_importance: 0.9, downstream_count: 0, transferability_factor: 1.0, composite_gap_score: 0.9, severity: "important",     priority_rank: 5, evidence_for_current: [], evidence_for_required: "Advanced SQL for complex queries", decay_applied: false, original_proficiency: 3, prerequisite_gaps: [], reasoning: "SQL found at level 3 but level 4 required for advanced query optimization." },
    ],
    strengths: [
      { skill_name: "Python", current_level: 4, required_level: 4, surplus: 0, can_skip_modules: ["Python Basics", "Python Intermediate"], evidence: [] },
      { skill_name: "Git",    current_level: 4, required_level: 3, surplus: 1, can_skip_modules: ["Git Fundamentals"],                      evidence: [] },
    ],
    readiness_score: 41,
    readiness_breakdown: { technical: 52, soft_skills: 78, domain: 45, tools: 25, certifications: 0 },
    total_gap_hours: 87,
    modules_to_skip: 4,
    total_standard_modules: 18,
    career_transition_detected: false,
    overqualified_detected: false,
    category_summary: [],
  },
  pathway: {
    id: "demo-pathway",
    total_phases: 4,
    total_hours: 87,
    total_weeks: 8,
    readiness_after: 94,
    phases: [
      { phase_number: 1, title: "Foundation", description: "Core prerequisites — Remember & Understand", total_hours: 20, modules: [
        { id: "m1", skill_name: "Docker",     courses: [{ id: "DK-001", title: "Docker Tutorial for Beginners", provider: "TechWorld Nana (YouTube)", url: "https://youtube.com/watch?v=3c-iBn73dDE", duration_hours: 5, difficulty: "beginner", format: "video", skills_covered: ["Docker"], skill_levels: {}, prerequisites: [], learning_objectives: [], onet_codes: [], domains: [], free: true, rating: 4.8, language: "en", description: "" }], estimated_hours: 5, adjusted_hours: 5, bloom_level: "remember", priority_score: 8.2, gap_severity: "important", reasoning: { skill_name: "Docker", resume_evidence: "No Docker experience found", jd_evidence: "Required for containerized deployments", gap_analysis: "Gap of 3 levels", course_selection: "Matched via FAISS semantic search", scheduling: "Phase 1: foundational prerequisite", priority_score: 8.2 }, alternative_courses: [], micro_content: null, review_schedule: null, status: "not_started", completed_at: null },
        { id: "m2", skill_name: "AWS",        courses: [{ id: "AW-001", title: "AWS Cloud Practitioner Essentials", provider: "AWS Training", url: "https://explore.skillbuilder.aws", duration_hours: 6, difficulty: "beginner", format: "interactive", skills_covered: ["AWS"], skill_levels: {}, prerequisites: [], learning_objectives: [], onet_codes: [], domains: [], free: true, rating: 4.7, language: "en", description: "" }], estimated_hours: 6, adjusted_hours: 6, bloom_level: "understand", priority_score: 7.8, gap_severity: "important", reasoning: { skill_name: "AWS", resume_evidence: "No AWS experience found", jd_evidence: "Required for cloud infrastructure", gap_analysis: "Gap of 3 levels", course_selection: "AWS official free training", scheduling: "Phase 1: cloud foundation", priority_score: 7.8 }, alternative_courses: [], micro_content: null, review_schedule: null, status: "not_started", completed_at: null },
      ]},
      { phase_number: 2, title: "Application", description: "Hands-on practice — Apply & Analyze", total_hours: 25, modules: [
        { id: "m3", skill_name: "TypeScript", courses: [{ id: "TS-001", title: "TypeScript Full Course", provider: "freeCodeCamp (YouTube)", url: "https://youtube.com/watch?v=30LWjhZzg50", duration_hours: 2, difficulty: "intermediate", format: "video", skills_covered: ["TypeScript"], skill_levels: {}, prerequisites: [], learning_objectives: [], onet_codes: [], domains: [], free: true, rating: 4.7, language: "en", description: "" }], estimated_hours: 8, adjusted_hours: 6, bloom_level: "apply", priority_score: 6.5, gap_severity: "developmental", reasoning: { skill_name: "TypeScript", resume_evidence: "JavaScript inferred from React", jd_evidence: "Type-safe development required", gap_analysis: "Gap of 3 levels, 0.5x acceleration (JS background)", course_selection: "Free YouTube course + exercises", scheduling: "Phase 2: builds on JS knowledge", priority_score: 6.5 }, alternative_courses: [], micro_content: null, review_schedule: null, status: "not_started", completed_at: null },
        { id: "m4", skill_name: "SQL Advanced", courses: [{ id: "SQ-002", title: "Advanced SQL Tutorial", provider: "freeCodeCamp (YouTube)", url: "https://youtube.com/watch?v=M-55BmjOuXY", duration_hours: 3, difficulty: "advanced", format: "video", skills_covered: ["SQL"], skill_levels: {}, prerequisites: [], learning_objectives: [], onet_codes: [], domains: [], free: true, rating: 4.6, language: "en", description: "" }], estimated_hours: 6, adjusted_hours: 4, bloom_level: "apply", priority_score: 7.2, gap_severity: "important", reasoning: { skill_name: "SQL Advanced", resume_evidence: "SQL at level 3 — intermediate", jd_evidence: "Advanced SQL required (level 4)", gap_analysis: "Gap of 1 level, 0.8x acceleration (SQL foundation exists)", course_selection: "freeCodeCamp advanced SQL", scheduling: "Phase 2: builds on existing SQL knowledge", priority_score: 7.2 }, alternative_courses: [], micro_content: null, review_schedule: null, status: "not_started", completed_at: null },
      ]},
    ],
    constraints: { max_hours_per_week: 20, total_weeks: 8, learning_style: "visual", priority_mode: "balanced" },
    parallel_tracks: [],
    critical_path: ["Docker", "AWS", "TypeScript"],
    critical_path_hours: 47,
    reasoning_summary: "Pathway optimized using topological sort with priority scheduling. Critical path: Docker → AWS → TypeScript (47h minimum). 4 modules skipped based on existing Python/Git strengths.",
    generated_at: new Date().toISOString(),
  },
};

export function ProcessingPipeline() {
  const router = useRouter();
  const {
    resume_text, jd_text, is_processing,
    setIsProcessing, setPipelineStages,
    addProcessingLog, setSkillProfile, setParsedJD,
    setGapAnalysis, setPathway, setAgentConversation,
    setReasoningTraces, setROIAnalysis,
  } = useStore();

  const [stages, setStages] = React.useState<Stage[]>(
    PIPELINE_STAGES.map((s) => ({ ...s, status: "pending" as const }))
  );
  const [logs, setLogs] = React.useState<string[]>([]);
  const [done, setDone] = React.useState(false);
  const [started, setStarted] = React.useState(false);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    addProcessingLog({ message: msg, timestamp: Date.now() });
  };

  const updateStage = (id: string, status: Stage["status"], message?: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, ...(message ? { message } : {}) } : s))
    );
  };

  const runDemo = async () => {
    setStarted(true);
    setIsProcessing(true);
    addLog("⚡ SkillForge pipeline starting...");

    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      const stage = PIPELINE_STAGES[i];
      updateStage(stage.id, "running");
      addLog(`▶ ${stage.label}`);
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));

      // Inject milestone logs at key stages
      if (stage.id === "ner")             addLog("   → Detected 12 skill entities via spaCy NER");
      if (stage.id === "classification")  addLog("   → Zero-shot: Python(tech), SQL(db), React(framework)");
      if (stage.id === "normalization")   addLog("   → Mapped 5 skills to O*NET taxonomy via FAISS");
      if (stage.id === "proficiency")     addLog("   → Proficiency scores: Python→4, SQL→3, React→3");
      if (stage.id === "gap_analysis")    addLog("   → 5 gaps found: AWS(3), Docker(3), TypeScript(3), React(+1), SQL(+1)");
      if (stage.id === "graph_build")     addLog("   → Knowledge graph: 18 nodes, 24 edges, 3 communities");
      if (stage.id === "llm_verification") addLog("   → Multi-agent: Parser→Analyst→Tutor→Critic (1 correction)");
      if (stage.id === "pathway_generation") addLog("   → Topological sort: 4 phases, 87h total, 4 modules skipped");
      if (stage.id === "course_matching") addLog("   → 9 courses matched from 500+ catalog via semantic search");

      updateStage(stage.id, "complete");
      setPipelineStages(stages.map((s, j) => ({ ...s, status: j <= i ? "complete" : j === i + 1 ? "running" : "pending" })));
    }

    // Load demo results into store
    setSkillProfile(DEMO_RESULT.skill_profile as any);
    setParsedJD(DEMO_RESULT.parsed_jd as any);
    setGapAnalysis(DEMO_RESULT.gap_analysis as any);
    setPathway(DEMO_RESULT.pathway as any);
    setAgentConversation({
      messages: [
        { agent: "Parser",  content: "Extracted 5 high-confidence skills from resume. Python(0.95), Git(0.90), React(0.92), SQL(0.88), JavaScript(0.85). 0 skills flagged for review." },
        { agent: "Analyst", content: "Gap analysis complete. 5 skill gaps identified. Critical: AWS, Docker. Important: SQL(+1). Readiness score: 41% → 94% after pathway." },
        { agent: "Tutor",   content: "4-phase pathway generated following Bloom's Taxonomy. Phase 1: Remember/Understand. Phase 2: Apply. Estimated completion: 8 weeks at 20h/week." },
        { agent: "Critic",  content: "Issue found: TypeScript prerequisite (JavaScript) missing from Phase 1. Corrected — JavaScript inferred from React added to Phase 1. Pipeline self-corrected." },
      ],
    });
    setReasoningTraces({
      "AWS": { skill_name: "AWS", resume_evidence: "No AWS experience found in resume after full scan.", jd_evidence: "Required for primary cloud infrastructure work.", gap_reasoning: "Gap of 3 levels (0→3). High importance × downstream_count(2) → priority 7.8.", course_reasoning: "AWS Cloud Practitioner Essentials — official AWS free training, covers all required concepts.", priority_score: 7.8 },
      "Docker": { skill_name: "Docker", resume_evidence: "No Docker experience detected.", jd_evidence: "Required for containerized deployments and CI/CD.", gap_reasoning: "Gap of 3 levels. Prerequisite for Kubernetes (not required but recommended).", course_reasoning: "Docker Tutorial by TechWorld Nana — most popular free Docker resource.", priority_score: 8.2 },
    });
    setROIAnalysis({ traditional_hours: 160, optimized_hours: 87, hours_saved: 73, percent_saved: 46, modules_skipped: 4, cost_savings: 3650, avg_hourly_cost: 50 });

    addLog("✅ Pipeline complete! 14/14 stages successful.");
    setIsProcessing(false);
    setDone(true);
  };

  const completedCount = stages.filter((s) => s.status === "complete").length;
  const progress = Math.round((completedCount / stages.length) * 100);

  if (!started) {
    const hasResume = resume_text.length > 10;
    const hasJD = jd_text.length > 10;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-card p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Ready to Analyze</h2>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm">
            The 14-stage AI pipeline will extract your skills, analyze gaps, build a knowledge graph, and generate your personalized pathway.
          </p>
          <div className="flex flex-col gap-2 items-center text-sm">
            <div className={cn("flex items-center gap-2", hasResume ? "text-green-400" : "text-muted-foreground")}>
              {hasResume ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              Resume {hasResume ? "ready" : "missing"}
            </div>
            <div className={cn("flex items-center gap-2", hasJD ? "text-green-400" : "text-muted-foreground")}>
              {hasJD ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              Job description {hasJD ? "ready" : "missing"}
            </div>
          </div>
          <Button
            size="lg"
            onClick={runDemo}
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20 gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {hasResume && hasJD ? "Run Full Analysis" : "Run Demo Analysis"}
          </Button>
          {(!hasResume || !hasJD) && (
            <p className="text-xs text-muted-foreground">
              No resume/JD detected — will use demo data to showcase the full pipeline
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Overall progress */}
      <div className="glass-card p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Processing Pipeline</h3>
          <Badge variant={done ? "success" : "secondary"}>
            {done ? "Complete" : `${completedCount}/${stages.length}`}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">{progress}% complete</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stage list */}
        <div className="glass-card p-4">
          <h4 className="text-sm font-semibold mb-3">Stages</h4>
          <div className="space-y-1.5">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-center gap-2.5 py-1">
                {stage.status === "complete" && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                {stage.status === "running"  && <Loader2  className="w-4 h-4 text-blue-400 shrink-0 animate-spin" />}
                {stage.status === "error"    && <XCircle  className="w-4 h-4 text-red-500 shrink-0" />}
                {stage.status === "pending"  && <Clock    className="w-4 h-4 text-muted-foreground shrink-0" />}
                <span className={cn(
                  "text-xs",
                  stage.status === "complete" ? "text-foreground" :
                  stage.status === "running"  ? "text-blue-400 font-medium" :
                  "text-muted-foreground"
                )}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Log */}
        <div className="glass-card p-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Live Log
          </h4>
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 font-mono text-[11px]">
              {logs.map((log, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {log}
                </motion.p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Done CTA */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center space-y-4 border-green-500/20 bg-green-500/5"
          >
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-xl font-bold">Analysis Complete!</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span>✅ 5 skills extracted</span>
              <span>✅ 5 gaps identified</span>
              <span>✅ 87h pathway generated</span>
              <span>✅ 4 modules skipped</span>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={() => router.push("/analysis")} variant="outline" className="gap-2">
                View Gap Analysis <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => router.push("/pathway")}
                className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white"
              >
                <Sparkles className="w-4 h-4" />
                View Pathway
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
