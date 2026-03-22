import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ProficiencyLevel,
  GapSeverity,
  SkillImportance,
  BloomLevel,
  SkillCategory,
  PipelineStageStatus,
} from "./types";

// ──────────────────────────────────────
// SHADCN UTILITY
// ──────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ──────────────────────────────────────
// PROFICIENCY UTILITIES
// ──────────────────────────────────────

export const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
  1: "Awareness",
  2: "Beginner",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export const PROFICIENCY_DESCRIPTIONS: Record<ProficiencyLevel, string> = {
  1: "Heard of it, seen in coursework",
  2: "Used in projects or tutorials",
  3: "Used professionally for 1-2 years",
  4: "Used professionally 3+ years, led projects",
  5: "Industry recognition, published, mentored others",
};

export function proficiencyToColor(level: number): string {
  if (level >= 4.5) return "#22c55e";
  if (level >= 3.5) return "#3b82f6";
  if (level >= 2.5) return "#eab308";
  if (level >= 1.5) return "#f97316";
  return "#ef4444";
}

export function proficiencyToWidth(level: number): string {
  return `${(level / 5) * 100}%`;
}

// ──────────────────────────────────────
// GAP SEVERITY UTILITIES
// ──────────────────────────────────────

export const GAP_SEVERITY_CONFIG: Record<
  GapSeverity,
  { label: string; color: string; bg: string; icon: string; description: string }
> = {
  critical: {
    label: "Critical",
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/20",
    icon: "🔴",
    description: "Day 1 essential — needed to function in the role",
  },
  important: {
    label: "Important",
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/20",
    icon: "🟠",
    description: "First 30 days — primary job responsibilities",
  },
  developmental: {
    label: "Developmental",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    icon: "🟡",
    description: "First 90 days — full role competency",
  },
  growth: {
    label: "Growth",
    color: "text-green-500",
    bg: "bg-green-500/10 border-green-500/20",
    icon: "🟢",
    description: "6+ months — career advancement",
  },
};

export function gapToSeverity(compositeScore: number, importance: SkillImportance): GapSeverity {
  if (importance === "critical" && compositeScore > 1.5) return "critical";
  if (importance === "high" || compositeScore > 2.0) return "important";
  if (importance === "medium" || compositeScore > 1.0) return "developmental";
  return "growth";
}

// ──────────────────────────────────────
// BLOOM'S TAXONOMY UTILITIES
// ──────────────────────────────────────

export const BLOOM_CONFIG: Record<
  BloomLevel,
  { order: number; label: string; color: string; verb: string; activities: string[] }
> = {
  remember: {
    order: 1,
    label: "Remember",
    color: "#ef4444",
    verb: "Recall",
    activities: ["Watch videos", "Read documentation", "Review flashcards"],
  },
  understand: {
    order: 2,
    label: "Understand",
    color: "#f97316",
    verb: "Explain",
    activities: ["Follow tutorials", "Summarize concepts", "Discuss ideas"],
  },
  apply: {
    order: 3,
    label: "Apply",
    color: "#eab308",
    verb: "Use",
    activities: ["Guided exercises", "Lab walkthroughs", "Simple implementations"],
  },
  analyze: {
    order: 4,
    label: "Analyze",
    color: "#22c55e",
    verb: "Break down",
    activities: ["Code review", "System analysis", "Debug exercises"],
  },
  evaluate: {
    order: 5,
    label: "Evaluate",
    color: "#3b82f6",
    verb: "Judge",
    activities: ["Compare frameworks", "Architecture decisions", "Trade-off analysis"],
  },
  create: {
    order: 6,
    label: "Create",
    color: "#a855f7",
    verb: "Build",
    activities: ["Build project", "Design system", "Create portfolio piece"],
  },
};

// ──────────────────────────────────────
// SKILL CATEGORY UTILITIES
// ──────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  SkillCategory,
  { label: string; icon: string; color: string }
> = {
  programming_language: { label: "Programming Languages", icon: "💻", color: "#3b82f6" },
  framework: { label: "Frameworks & Libraries", icon: "🏗️", color: "#8b5cf6" },
  database: { label: "Databases", icon: "🗄️", color: "#06b6d4" },
  cloud_platform: { label: "Cloud Platforms", icon: "☁️", color: "#f59e0b" },
  devops_tool: { label: "DevOps & CI/CD", icon: "🔧", color: "#10b981" },
  data_tool: { label: "Data Tools", icon: "📊", color: "#ec4899" },
  soft_skill: { label: "Soft Skills", icon: "🤝", color: "#6366f1" },
  domain_knowledge: { label: "Domain Knowledge", icon: "🎓", color: "#14b8a6" },
  methodology: { label: "Methodologies", icon: "📋", color: "#f97316" },
  certification: { label: "Certifications", icon: "📜", color: "#84cc16" },
  tool: { label: "Tools & Platforms", icon: "🛠️", color: "#a855f7" },
  language: { label: "Languages", icon: "🌐", color: "#0ea5e9" },
  other: { label: "Other", icon: "📌", color: "#6b7280" },
};

// ──────────────────────────────────────
// PIPELINE STAGE UTILITIES
// ──────────────────────────────────────

export const PIPELINE_STAGES = [
  { id: "text_extraction", name: "Text Extraction", icon: "📄", description: "Extracting text from uploaded document" },
  { id: "section_segmentation", name: "Section Segmentation", icon: "📑", description: "Identifying resume sections" },
  { id: "ner_extraction", name: "Entity Recognition", icon: "🔍", description: "Running NER model to detect skills" },
  { id: "skill_classification", name: "Skill Classification", icon: "🏷️", description: "Categorizing detected skills" },
  { id: "embedding_normalization", name: "Semantic Normalization", icon: "🧮", description: "Mapping to O*NET taxonomy via embeddings" },
  { id: "proficiency_inference", name: "Proficiency Inference", icon: "📊", description: "Inferring skill proficiency levels" },
  { id: "llm_verification", name: "AI Verification", icon: "🤖", description: "Multi-agent verification & enrichment" },
  { id: "gap_analysis", name: "Gap Analysis", icon: "📐", description: "Computing multi-dimensional skill gaps" },
  { id: "graph_construction", name: "Knowledge Graph", icon: "🕸️", description: "Building skill dependency graph" },
  { id: "graph_algorithms", name: "Graph Algorithms", icon: "⚡", description: "Running HITS, PageRank, CPM" },
  { id: "pathway_generation", name: "Pathway Generation", icon: "🗺️", description: "Generating adaptive learning pathway" },
  { id: "course_matching", name: "Course Matching", icon: "📚", description: "Matching courses from catalog" },
  { id: "reasoning_generation", name: "Reasoning Traces", icon: "🧠", description: "Generating per-recommendation reasoning" },
  { id: "bloom_mapping", name: "Bloom's Mapping", icon: "🌸", description: "Mapping to cognitive progression levels" },
] as const;

export function stageStatusToColor(status: PipelineStageStatus): string {
  switch (status) {
    case "complete": return "text-green-500";
    case "running": return "text-blue-500";
    case "error": return "text-red-500";
    case "pending": return "text-muted-foreground";
  }
}

export function stageStatusToIcon(status: PipelineStageStatus): string {
  switch (status) {
    case "complete": return "✅";
    case "running": return "⏳";
    case "error": return "❌";
    case "pending": return "⬜";
  }
}

// ──────────────────────────────────────
// FORMATTING UTILITIES
// ──────────────────────────────────────

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours === 1) return "1 hour";
  if (hours % 1 === 0) return `${hours} hours`;
  return `${hours.toFixed(1)} hours`;
}

export function formatWeeks(weeks: number): string {
  if (weeks < 1) return `${Math.round(weeks * 7)} days`;
  if (weeks === 1) return "1 week";
  if (weeks % 1 === 0) return `${weeks} weeks`;
  return `${weeks.toFixed(1)} weeks`;
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ──────────────────────────────────────
// COMPUTATION UTILITIES
// ──────────────────────────────────────

export function calculateDecayedProficiency(
  baseProficiency: number,
  yearsSinceLastUsed: number
): number {
  const stability = baseProficiency * 2;
  const retention = Math.exp(-yearsSinceLastUsed / stability);
  return Math.round(baseProficiency * retention * 10) / 10;
}

export function calculateTransferFactor(
  sourceSkill: string,
  targetSkill: string,
  transferMap: Record<string, Record<string, number>>
): number {
  return transferMap[sourceSkill]?.[targetSkill] ?? 0;
}

export function computeCompositeGapScore(
  rawGap: number,
  importanceWeight: number,
  onetImportance: number,
  downstreamCount: number,
  transferabilityFactor: number
): number {
  return (
    rawGap *
    importanceWeight *
    (onetImportance / 5) *
    (1 + 0.3 * downstreamCount) *
    (1 - transferabilityFactor * 0.3)
  );
}

// ──────────────────────────────────────
// UNIQUE ID GENERATION
// ──────────────────────────────────────

export function generateId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

// ──────────────────────────────────────
// COLOR INTERPOLATION
// ──────────────────────────────────────

export function interpolateColor(value: number, min: number, max: number): string {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = Math.round(239 * (1 - ratio) + 34 * ratio);
  const g = Math.round(68 * (1 - ratio) + 197 * ratio);
  const b = Math.round(68 * (1 - ratio) + 94 * ratio);
  return `rgb(${r}, ${g}, ${b})`;
}

// ──────────────────────────────────────
// API URL BUILDERS
// ──────────────────────────────────────

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8000";
const NLP_ENGINE_URL = process.env.NEXT_PUBLIC_NLP_ENGINE_URL || "http://localhost:8001";
const GRAPH_ENGINE_URL = process.env.NEXT_PUBLIC_GRAPH_ENGINE_URL || "http://localhost:8002";

export function getGatewayUrl(path: string): string {
  return `${GATEWAY_URL}${path}`;
}

export function getNlpEngineUrl(path: string): string {
  return `${NLP_ENGINE_URL}${path}`;
}

export function getGraphEngineUrl(path: string): string {
  return `${GRAPH_ENGINE_URL}${path}`;
}