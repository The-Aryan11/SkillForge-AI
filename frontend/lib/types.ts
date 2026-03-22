// ============================================================
// SKILLFORGE — COMPLETE TYPE SYSTEM
// Every data structure used across the entire application
// ============================================================

// ──────────────────────────────────────
// SKILL & PROFICIENCY TYPES
// ──────────────────────────────────────

export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export type SkillCategory =
  | "programming_language"
  | "framework"
  | "database"
  | "cloud_platform"
  | "devops_tool"
  | "data_tool"
  | "soft_skill"
  | "domain_knowledge"
  | "methodology"
  | "certification"
  | "tool"
  | "language"
  | "other";

export type RecencyBand = "current" | "1-2_years" | "3-5_years" | "5+_years";

export type DepthLevel = "surface" | "working" | "deep" | "expert";

export type EvidenceContext =
  | "professional"
  | "academic"
  | "personal_project"
  | "leadership"
  | "certification";

export interface SkillEvidence {
  text: string;
  line_number: number;
  section: string;
  context_type: EvidenceContext;
}

export interface ExtractedSkill {
  id: string;
  name: string;
  normalized_name: string;
  onet_code: string | null;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  years_experience: number;
  recency: RecencyBand;
  depth: DepthLevel;
  evidence: SkillEvidence[];
  confidence: number;
  implicit_from: string | null;
  decay_adjusted_proficiency: number;
  detected_by: string;
  verified: boolean;
  user_override: ProficiencyLevel | null;
}

export interface SkillProfile {
  skills: ExtractedSkill[];
  education: Education[];
  total_experience_years: number;
  domains: string[];
  certifications: string[];
  summary: string;
  extraction_metadata: ExtractionMetadata;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: number;
  gpa: number | null;
}

export interface ExtractionMetadata {
  total_entities_found: number;
  ner_model: string;
  classifier_model: string;
  embedding_model: string;
  proficiency_model: string;
  processing_time_ms: number;
  stages_completed: PipelineStage[];
}

// ──────────────────────────────────────
// JOB DESCRIPTION TYPES
// ──────────────────────────────────────

export type SkillImportance = "critical" | "high" | "medium" | "preferred" | "nice_to_have";

export interface JDRequirement {
  name: string;
  normalized_name: string;
  onet_code: string | null;
  required_proficiency: ProficiencyLevel;
  importance: SkillImportance;
  context: string;
  category: SkillCategory;
}

export interface ParsedJD {
  role_title: string;
  department: string;
  seniority: string;
  onet_soc_code: string;
  onet_occupation_title: string;
  required_skills: JDRequirement[];
  preferred_skills: JDRequirement[];
  soft_skills: JDRequirement[];
  education_requirements: string[];
  experience_requirements: string;
  domain: string;
  raw_text: string;
}

// ──────────────────────────────────────
// GAP ANALYSIS TYPES
// ──────────────────────────────────────

export type GapSeverity = "critical" | "important" | "developmental" | "growth";

export interface SkillGap {
  skill_name: string;
  normalized_name: string;
  onet_code: string | null;
  current_level: number;
  required_level: ProficiencyLevel;
  raw_gap: number;
  importance: SkillImportance;
  importance_weight: number;
  onet_importance: number;
  downstream_count: number;
  transferability_factor: number;
  composite_gap_score: number;
  severity: GapSeverity;
  priority_rank: number;
  evidence_for_current: SkillEvidence[];
  evidence_for_required: string;
  decay_applied: boolean;
  original_proficiency: number;
  prerequisite_gaps: string[];
  reasoning: string;
}

export interface SkillStrength {
  skill_name: string;
  current_level: ProficiencyLevel;
  required_level: ProficiencyLevel;
  surplus: number;
  can_skip_modules: string[];
  evidence: SkillEvidence[];
}

export interface GapAnalysis {
  gaps: SkillGap[];
  strengths: SkillStrength[];
  readiness_score: number;
  readiness_breakdown: {
    technical: number;
    soft_skills: number;
    domain: number;
    tools: number;
    certifications: number;
  };
  total_gap_hours: number;
  modules_to_skip: number;
  total_standard_modules: number;
  career_transition_detected: boolean;
  overqualified_detected: boolean;
  category_summary: CategorySummary[];
}

export interface CategorySummary {
  category: SkillCategory;
  total_skills: number;
  skills_met: number;
  skills_partial: number;
  skills_missing: number;
  average_gap: number;
}

// ──────────────────────────────────────
// KNOWLEDGE GRAPH TYPES
// ──────────────────────────────────────

export interface GraphNode {
  id: string;
  name: string;
  category: SkillCategory;
  level: ProficiencyLevel;
  estimated_hours: number;
  status: "known" | "gap" | "prerequisite_gap" | "in_progress" | "completed" | "skipped";
  hub_score: number;
  authority_score: number;
  pagerank: number;
  betweenness: number;
  community: number;
  bloom_level: BloomLevel;
  on_critical_path: boolean;
  slack_hours: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  relationship: "prerequisite" | "corequisite" | "recommended" | "transfers_to";
  transfer_coefficient?: number;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  communities: string[][];
  critical_path: string[];
  critical_path_hours: number;
  parallel_branches: string[][];
  hub_skills: string[];
  bridge_skills: string[];
  total_nodes: number;
  total_edges: number;
}

// ──────────────────────────────────────
// COURSE & LEARNING TYPES
// ──────────────────────────────────────

export type CourseFormat = "video" | "article" | "interactive" | "project" | "documentation";
export type CourseDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface Course {
  id: string;
  title: string;
  provider: string;
  url: string;
  duration_hours: number;
  difficulty: CourseDifficulty;
  format: CourseFormat;
  skills_covered: string[];
  skill_levels: Record<string, [number, number]>;
  prerequisites: string[];
  learning_objectives: string[];
  onet_codes: string[];
  domains: string[];
  free: boolean;
  rating: number;
  language: string;
  description: string;
}

export type BloomLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export interface LearningModule {
  id: string;
  skill_name: string;
  courses: Course[];
  estimated_hours: number;
  adjusted_hours: number;
  bloom_level: BloomLevel;
  priority_score: number;
  gap_severity: GapSeverity;
  reasoning: ModuleReasoning;
  alternative_courses: Course[];
  micro_content: MicroContent | null;
  review_schedule: ReviewSchedule | null;
  status: "not_started" | "in_progress" | "completed" | "skipped";
  completed_at: string | null;
}

export interface MicroContent {
  flashcards: Flashcard[];
  key_concepts: string[];
  practice_prompt: string;
  self_check: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface ReviewSchedule {
  intervals_days: number[];
  next_review: string | null;
  repetition_count: number;
  easiness_factor: number;
}

// ──────────────────────────────────────
// PATHWAY TYPES
// ──────────────────────────────────────

export interface PathwayPhase {
  phase_number: number;
  title: string;
  description: string;
  bloom_focus: BloomLevel;
  modules: LearningModule[];
  total_hours: number;
  week_start: number;
  week_end: number;
  assessment: Assessment | null;
  parallel_tracks: string[][];
}

export interface Pathway {
  id: string;
  name: string;
  description: string;
  phases: PathwayPhase[];
  total_hours: number;
  total_weeks: number;
  total_modules: number;
  modules_skipped: number;
  readiness_before: number;
  readiness_after: number;
  time_savings_hours: number;
  time_savings_percent: number;
  critical_path_hours: number;
  created_at: string;
  constraints: PathwayConstraints;
  graph_data: KnowledgeGraphData;
}

export interface PathwayConstraints {
  max_hours_per_week: number;
  total_weeks: number | null;
  learning_style: CourseFormat[];
  priority_mode: "fastest" | "balanced" | "deep_dive";
}

export interface AlternativePathway {
  name: string;
  description: string;
  pathway: Pathway;
  trade_offs: string[];
}

export interface PathwayDiff {
  added_modules: LearningModule[];
  removed_modules: LearningModule[];
  moved_modules: { module: LearningModule; from_phase: number; to_phase: number }[];
  merged_phases: number[];
  hours_changed: number;
  weeks_changed: number;
  trigger: string;
}

// ──────────────────────────────────────
// QUIZ & ASSESSMENT TYPES
// ──────────────────────────────────────

export type QuestionType =
  | "multiple_choice"
  | "scenario_based"
  | "ordering"
  | "code_review"
  | "self_assessment";

export interface QuizQuestion {
  id: string;
  skill: string;
  type: QuestionType;
  difficulty: number;
  discrimination: number;
  question_text: string;
  options: string[];
  correct_answer: number | number[];
  explanation: string;
  code_snippet?: string;
  bloom_level: BloomLevel;
}

export interface QuizResponse {
  question_id: string;
  selected_answer: number | number[];
  correct: boolean;
  time_taken_seconds: number;
}

export interface QuizState {
  questions: QuizQuestion[];
  responses: QuizResponse[];
  current_question_index: number;
  theta_estimate: number;
  theta_history: number[];
  standard_error: number;
  skill_estimates: Record<string, number>;
  is_complete: boolean;
}

export interface Assessment {
  type: "diagnostic" | "checkpoint" | "review";
  skill_targets: string[];
  questions_count: number;
  passing_threshold: number;
}

// ──────────────────────────────────────
// REASONING & TRACE TYPES
// ──────────────────────────────────────

export interface ReasoningTrace {
  module_id: string;
  skill_name: string;
  resume_evidence: ResumeEvidence;
  jd_evidence: JDEvidence;
  onet_cross_reference: OnetReference;
  gap_calculation: GapCalculation;
  prerequisite_check: PrerequisiteCheck;
  course_selection: CourseSelectionReasoning;
  scheduling_reasoning: SchedulingReasoning;
  confidence_level: "high" | "medium" | "low";
  confidence_score: number;
}

export interface ResumeEvidence {
  found: boolean;
  mentions: number;
  excerpts: { text: string; line: number }[];
  inferred_level: number;
  evidence_strength: string;
}

export interface JDEvidence {
  mentioned: boolean;
  times_mentioned: number;
  context: string;
  importance_level: SkillImportance;
  in_responsibilities: boolean;
  in_requirements: boolean;
}

export interface OnetReference {
  occupation: string;
  soc_code: string;
  importance_score: number;
  level_score: number;
  validates_jd: boolean;
}

export interface GapCalculation {
  current: number;
  required: number;
  raw_gap: number;
  importance_multiplier: number;
  downstream_impact: number;
  composite_score: number;
  priority_rank: number;
  total_gaps: number;
}

export interface PrerequisiteCheck {
  prerequisites: { skill: string; satisfied: boolean; level: number }[];
  all_satisfied: boolean;
  missing_prerequisites: string[];
}

export interface CourseSelectionReasoning {
  courses_searched: number;
  courses_matched: number;
  selected_course: string;
  selection_reasons: string[];
  coverage_score: number;
  alternatives: { title: string; reason_not_selected: string }[];
}

export interface SchedulingReasoning {
  assigned_phase: number;
  reason_for_phase: string;
  blocked_by: string[];
  blocks: string[];
  parallel_with: string[];
  on_critical_path: boolean;
}

// ──────────────────────────────────────
// AGENT CONVERSATION TYPES
// ──────────────────────────────────────

export type AgentRole = "parser" | "analyst" | "tutor" | "critic" | "orchestrator";

export interface AgentMessage {
  agent: AgentRole;
  agent_name: string;
  message: string;
  timestamp: string;
  stage: string;
  corrections?: string[];
  data?: Record<string, unknown>;
}

export interface AgentConversation {
  messages: AgentMessage[];
  total_agents_used: number;
  self_corrections: number;
  issues_found: string[];
  issues_resolved: string[];
}

// ──────────────────────────────────────
// PROCESSING PIPELINE TYPES
// ──────────────────────────────────────

export type PipelineStageStatus = "pending" | "running" | "complete" | "error";

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: PipelineStageStatus;
  progress: number;
  result_preview: string | null;
  duration_ms: number | null;
  model_used: string | null;
  error: string | null;
}

export interface ProcessingLog {
  timestamp: string;
  stage: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  data?: Record<string, unknown>;
}

// ──────────────────────────────────────
// ANALYTICS & ROI TYPES
// ──────────────────────────────────────

export interface ROIAnalysis {
  traditional_hours: number;
  optimized_hours: number;
  hours_saved: number;
  percent_saved: number;
  modules_skipped: number;
  modules_added: number;
  employee_cost_saved: number;
  trainer_cost_saved: number;
  productivity_weeks_saved: number;
  total_savings_per_hire: number;
  annual_savings: number;
  methodology: string;
}

export interface CompetencyTrend {
  phase: number;
  week: number;
  readiness: number;
  technical: number;
  soft_skills: number;
  domain: number;
}

// ──────────────────────────────────────
// COMPARISON TYPES
// ──────────────────────────────────────

export interface RoleComparison {
  role_title: string;
  readiness: number;
  gap_count: number;
  learning_hours: number;
  estimated_weeks: number;
  modules_to_skip: number;
  difficulty: number;
  fit_score: number;
  pathway_preview: Pathway;
}

export interface WhatIfScenario {
  skill_toggled: string;
  direction: "add" | "remove";
  impact: {
    hours_changed: number;
    modules_changed: number;
    readiness_changed: number;
    phases_changed: number;
  };
}

// ──────────────────────────────────────
// BATCH / COHORT TYPES
// ──────────────────────────────────────

export interface CohortMember {
  id: string;
  name: string;
  skill_profile: SkillProfile;
  gap_analysis: GapAnalysis;
  pathway: Pathway;
  readiness: number;
}

export interface CohortAnalysis {
  members: CohortMember[];
  role: ParsedJD;
  common_gaps: { skill: string; count: number; percentage: number }[];
  common_strengths: { skill: string; count: number; percentage: number }[];
  recommended_group_training: string[];
  individual_pathways_needed: string[];
  team_heatmap: Record<string, Record<string, number>>;
}

export interface MentorMatch {
  gap_skill: string;
  mentor_name: string;
  mentor_proficiency: ProficiencyLevel;
  match_score: number;
}

// ──────────────────────────────────────
// GAMIFICATION TYPES
// ──────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at: string | null;
  criteria: string;
}

export interface LearningStreak {
  current: number;
  best: number;
  total_active_days: number;
  week_activity: boolean[];
}

export interface XPProgress {
  current_xp: number;
  level: number;
  xp_to_next_level: number;
  total_xp: number;
}

// ──────────────────────────────────────
// UI STATE TYPES
// ──────────────────────────────────────

export type PathwayView = "graph_3d" | "graph_2d" | "timeline" | "kanban" | "list";

export type WizardStep = "resume" | "jd" | "preferences" | "verification" | "processing";

export interface AppState {
  // Upload state
  resume_file: File | null;
  resume_text: string;
  jd_text: string;
  jd_source: "upload" | "paste" | "template" | "url";
  selected_template: string | null;
  github_username: string;

  // Processing state
  pipeline_stages: PipelineStage[];
  processing_logs: ProcessingLog[];
  is_processing: boolean;
  current_stage: string;

  // Analysis state
  skill_profile: SkillProfile | null;
  parsed_jd: ParsedJD | null;
  gap_analysis: GapAnalysis | null;

  // Pathway state
  pathway: Pathway | null;
  alternative_pathways: AlternativePathway[];
  pathway_view: PathwayView;
  pathway_constraints: PathwayConstraints;
  pathway_diff: PathwayDiff | null;

  // Quiz state
  quiz_state: QuizState | null;
  quiz_available: boolean;

  // Reasoning state
  reasoning_traces: Record<string, ReasoningTrace>;
  agent_conversation: AgentConversation | null;
  counterfactuals: WhatIfScenario[];

  // Graph data
  graph_data: KnowledgeGraphData | null;
  tsne_coords: { skill: string; x: number; y: number; type: string }[];

  // Dashboard state
  roi_analysis: ROIAnalysis | null;
  competency_trend: CompetencyTrend[];
  badges: Badge[];
  streak: LearningStreak;
  xp: XPProgress;

  // Comparison state
  role_comparisons: RoleComparison[];

  // Batch state
  cohort_analysis: CohortAnalysis | null;
  mentor_matches: MentorMatch[];

  // UI state
  wizard_step: WizardStep;
  sidebar_open: boolean;
  chatbot_open: boolean;
  dark_mode: boolean;
}

// ──────────────────────────────────────
// API RESPONSE TYPES
// ──────────────────────────────────────

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
  processing_time_ms: number;
  models_used: string[];
}

export interface StreamEvent {
  stage: string;
  status: PipelineStageStatus;
  message: string;
  progress: number;
  data?: Record<string, unknown>;
}

// ──────────────────────────────────────
// ALIGNMENT / HEATMAP TYPES
// ──────────────────────────────────────

export interface AlignmentCell {
  resume_sentence: string;
  jd_requirement: string;
  similarity: number;
  resume_index: number;
  jd_index: number;
}

export interface AlignmentMatrix {
  resume_sentences: string[];
  jd_sentences: string[];
  matrix: number[][];
  overall_alignment: number;
  best_matches: AlignmentCell[];
  unmatched_jd: string[];
  unmatched_resume: string[];
}

// ──────────────────────────────────────
// SKILL PASSPORT TYPE
// ──────────────────────────────────────

export interface SkillPassport {
  user_name: string;
  generated_at: string;
  verification_code: string;
  verified_skills: {
    name: string;
    proficiency: ProficiencyLevel;
    verification_method: "resume" | "quiz" | "resume+quiz";
  }[];
  pathway_progress: {
    target_role: string;
    readiness: number;
    modules_completed: number;
    modules_total: number;
    skills_gained: string[];
  };
}