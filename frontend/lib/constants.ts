export const APP_NAME = "SkillForge";
export const APP_DESCRIPTION = "AI-Adaptive Onboarding Engine";

export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8000";
export const NLP_URL = process.env.NEXT_PUBLIC_NLP_ENGINE_URL || "http://localhost:8001";
export const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_ENGINE_URL || "http://localhost:8002";

export const MAX_FILE_SIZE_MB = 10;
export const SUPPORTED_RESUME_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

export const PROFICIENCY_LABELS = {
  1: "Awareness",
  2: "Beginner",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
} as const;

export const GAP_COLORS = {
  critical: "#ef4444",
  important: "#f97316",
  developmental: "#eab308",
  growth: "#22c55e",
} as const;

export const PIPELINE_STAGES = [
  { id: "text_extraction",    label: "Extracting Text",            description: "Parsing PDF/DOCX content" },
  { id: "section_detection",  label: "Detecting Resume Sections",  description: "Identifying work, education, skills" },
  { id: "ner",                label: "Named Entity Recognition",    description: "spaCy transformer NER pipeline" },
  { id: "classification",     label: "Zero-Shot Classification",   description: "BART-MNLI skill categorization" },
  { id: "embedding",          label: "Embedding Skills",           description: "MiniLM sentence embeddings" },
  { id: "normalization",      label: "O*NET Normalization",        description: "FAISS semantic skill matching" },
  { id: "proficiency",        label: "Proficiency Inference",      description: "ML model scoring skill levels" },
  { id: "decay",              label: "Skill Decay Modeling",       description: "Ebbinghaus recency weighting" },
  { id: "jd_parsing",         label: "Parsing Job Description",    description: "Extracting role requirements" },
  { id: "gap_analysis",       label: "Computing Skill Gaps",       description: "Multi-dimensional gap scoring" },
  { id: "graph_build",        label: "Building Knowledge Graph",   description: "HITS, PageRank, community detection" },
  { id: "llm_verification",   label: "AI Verification",            description: "Multi-agent pipeline review" },
  { id: "pathway_generation", label: "Generating Pathway",         description: "Topological sort + scheduling" },
  { id: "course_matching",    label: "Matching Courses",           description: "FAISS semantic course retrieval" },
] as const;

export const JD_TEMPLATES = [
  { id: "swe-mid",            label: "Software Engineer (Mid)",    domain: "Technology" },
  { id: "data-analyst",       label: "Data Analyst",               domain: "Data" },
  { id: "ml-engineer",        label: "ML Engineer",                domain: "Technology" },
  { id: "devops-engineer",    label: "DevOps Engineer",            domain: "Technology" },
  { id: "marketing-manager",  label: "Marketing Manager",          domain: "Business" },
  { id: "warehouse-supervisor", label: "Warehouse Supervisor",     domain: "Operations" },
  { id: "registered-nurse",   label: "Registered Nurse",           domain: "Healthcare" },
  { id: "financial-analyst",  label: "Financial Analyst",          domain: "Finance" },
] as const;
