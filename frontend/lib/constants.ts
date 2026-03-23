export const APP_NAME = "SkillForge";
export const APP_DESCRIPTION = "AI-Adaptive Onboarding Engine";

export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8000";
export const NLP_URL     = process.env.NEXT_PUBLIC_NLP_ENGINE_URL ?? "http://localhost:8001";
export const GRAPH_URL   = process.env.NEXT_PUBLIC_GRAPH_ENGINE_URL ?? "http://localhost:8002";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ACCEPTED_RESUME_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "text/plain": [".txt"],
};

export const PROFICIENCY_LABELS: Record<number, string> = {
  1: "Awareness",
  2: "Beginner",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export const GAP_COLORS: Record<string, string> = {
  critical:      "#ef4444",
  important:     "#f97316",
  developmental: "#eab308",
  growth:        "#22c55e",
};

export interface JDDomain {
  id: string;
  label: string;
  icon: string;
}

export const JD_DOMAINS: JDDomain[] = [
  { id: "All",        label: "All",        icon: "🌐" },
  { id: "Technology", label: "Technology", icon: "💻" },
  { id: "Data",       label: "Data",       icon: "📊" },
  { id: "Business",   label: "Business",   icon: "📈" },
  { id: "Operations", label: "Operations", icon: "⚙️" },
  { id: "Healthcare", label: "Healthcare", icon: "🏥" },
  { id: "Finance",    label: "Finance",    icon: "💰" },
  { id: "Design",     label: "Design",     icon: "🎨" },
];

export interface ConstraintPreset {
  id: string;
  label: string;
  description: string;
  max_hours_per_week: number;
  total_weeks: number;
  icon: string;
}

export const CONSTRAINT_PRESETS: ConstraintPreset[] = [
  { id: "intensive",  label: "Intensive",  description: "40h/week — fastest path",   max_hours_per_week: 40, total_weeks: 4,  icon: "⚡" },
  { id: "standard",   label: "Standard",   description: "20h/week — balanced",        max_hours_per_week: 20, total_weeks: 8,  icon: "📅" },
  { id: "part-time",  label: "Part-time",  description: "10h/week — relaxed",         max_hours_per_week: 10, total_weeks: 16, icon: "🌱" },
  { id: "weekend",    label: "Weekends",   description: "5h/week — side project",     max_hours_per_week: 5,  total_weeks: 24, icon: "☕" },
];

export interface LearningStyle {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const LEARNING_STYLES: LearningStyle[] = [
  { id: "visual",   label: "Visual",   icon: "👁️", description: "Diagrams, videos, infographics" },
  { id: "reading",  label: "Reading",  icon: "📖", description: "Articles, docs, textbooks" },
  { id: "hands-on", label: "Hands-on", icon: "🛠️", description: "Projects, labs, exercises" },
  { id: "auditory", label: "Auditory", icon: "🎧", description: "Lectures, podcasts, discussions" },
];

export const PIPELINE_STAGES = [
  { id: "text_extraction",    label: "Extracting Text",           description: "Parsing PDF/DOCX content" },
  { id: "section_detection",  label: "Detecting Sections",        description: "Identifying work, education, skills" },
  { id: "ner",                label: "Named Entity Recognition",   description: "spaCy transformer NER" },
  { id: "classification",     label: "Zero-Shot Classification",  description: "BART-MNLI skill categorization" },
  { id: "embedding",          label: "Embedding Skills",          description: "MiniLM sentence embeddings" },
  { id: "normalization",      label: "O*NET Normalization",       description: "FAISS semantic skill matching" },
  { id: "proficiency",        label: "Proficiency Inference",     description: "ML model scoring" },
  { id: "decay",              label: "Skill Decay Modeling",      description: "Ebbinghaus recency weighting" },
  { id: "jd_parsing",         label: "Parsing Job Description",   description: "Extracting role requirements" },
  { id: "gap_analysis",       label: "Computing Skill Gaps",      description: "Multi-dimensional gap scoring" },
  { id: "graph_build",        label: "Building Knowledge Graph",  description: "HITS, PageRank, community detection" },
  { id: "llm_verification",   label: "AI Verification",           description: "Multi-agent review" },
  { id: "pathway_generation", label: "Generating Pathway",        description: "Topological sort + scheduling" },
  { id: "course_matching",    label: "Matching Courses",          description: "FAISS semantic course retrieval" },
];

export const JD_TEMPLATES = [
  { id: "swe-mid",              label: "Software Engineer (Mid)",  domain: "Technology" },
  { id: "data-analyst",         label: "Data Analyst",             domain: "Data" },
  { id: "ml-engineer",          label: "ML Engineer",              domain: "Technology" },
  { id: "devops-engineer",      label: "DevOps Engineer",          domain: "Technology" },
  { id: "marketing-manager",    label: "Marketing Manager",        domain: "Business" },
  { id: "warehouse-supervisor", label: "Warehouse Supervisor",     domain: "Operations" },
  { id: "registered-nurse",     label: "Registered Nurse",         domain: "Healthcare" },
  { id: "financial-analyst",    label: "Financial Analyst",        domain: "Finance" },
];
