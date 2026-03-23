import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppStore {
  // ── Upload ───────────────────────────────────────────────────
  resume_file: File | null;
  resume_text: string;
  jd_text: string;
  jd_source: "upload" | "paste" | "template" | "url";
  selected_template: string | null;
  github_username: string;

  // ── Processing ───────────────────────────────────────────────
  pipeline_stages: any[];
  processing_logs: any[];
  is_processing: boolean;
  current_stage: string;
  wizard_step: "resume" | "jd" | "preferences" | "verification" | "processing";

  // ── Analysis ─────────────────────────────────────────────────
  skill_profile: any | null;
  parsed_jd: any | null;
  gap_analysis: any | null;

  // ── Pathway ──────────────────────────────────────────────────
  pathway: any | null;
  alternative_pathways: any[];
  pathway_view: "graph_3d" | "graph_2d" | "timeline" | "kanban" | "list";
  pathway_constraints: any;
  pathway_diff: any | null;

  // ── Quiz ─────────────────────────────────────────────────────
  quiz_state: any | null;
  quiz_available: boolean;

  // ── Reasoning ────────────────────────────────────────────────
  reasoning_traces: Record<string, any>;
  agent_conversation: any | null;
  counterfactuals: any[];

  // ── Graph ────────────────────────────────────────────────────
  graph_data: any | null;
  tsne_coords: any[];

  // ── Dashboard ────────────────────────────────────────────────
  roi_analysis: any | null;
  competency_trend: any[];
  badges: any[];
  streak: any;
  xp: any;

  // ── Comparison / Batch ───────────────────────────────────────
  role_comparisons: any[];
  cohort_analysis: any | null;
  mentor_matches: any[];

  // ── UI ───────────────────────────────────────────────────────
  sidebar_open: boolean;
  chatbot_open: boolean;
  dark_mode: boolean;

  // ── Actions ──────────────────────────────────────────────────
  setResumeFile: (file: File | null) => void;
  setResumeText: (text: string) => void;
  setJDText: (text: string) => void;
  setJdText: (text: string) => void;
  setJDSource: (source: "upload" | "paste" | "template" | "url") => void;
  setJdSource: (source: "upload" | "paste" | "template" | "url") => void;
  setSelectedTemplate: (id: string | null) => void;
  setGithubUsername: (username: string) => void;
  setIsProcessing: (v: boolean) => void;
  setPipelineStages: (stages: any[]) => void;
  updatePipelineStage: (id: string, status: string, message?: string) => void;
  setCurrentStage: (stage: string) => void;
  addProcessingLog: (log: any) => void;
  setWizardStep: (step: "resume" | "jd" | "preferences" | "verification" | "processing") => void;
  setSkillProfile: (profile: any) => void;
  setParsedJD: (jd: any) => void;
  setGapAnalysis: (analysis: any) => void;
  setPathway: (pathway: any) => void;
  setAlternativePathways: (paths: any[]) => void;
  setPathwayView: (view: "graph_3d" | "graph_2d" | "timeline" | "kanban" | "list") => void;
  setPathwayConstraints: (constraints: any) => void;
  setPathwayDiff: (diff: any | null) => void;
  setQuizState: (state: any) => void;
  setQuizAvailable: (v: boolean) => void;
  setReasoningTraces: (traces: Record<string, any>) => void;
  setAgentConversation: (conv: any) => void;
  setGraphData: (data: any) => void;
  setTsneCoords: (coords: any[]) => void;
  setROIAnalysis: (roi: any) => void;
  setCompetencyTrend: (trend: any[]) => void;
  setBadges: (badges: any[]) => void;
  earnBadge: (badgeId: string) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  setRoleComparisons: (comparisons: any[]) => void;
  setCohortAnalysis: (analysis: any | null) => void;
  setMentorMatches: (matches: any[]) => void;
  setSidebarOpen: (v: boolean) => void;
  setChatbotOpen: (v: boolean) => void;
  toggleChatbot: () => void;
  setDarkMode: (v: boolean) => void;
  updateSkillVerification: (skillId: string, verified: boolean, proficiency?: number) => void;
  updateModuleStatus: (moduleId: string, status: string) => void;
  resetAnalysis: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      // ── State ────────────────────────────────────────────────
      resume_file: null,
      resume_text: "",
      jd_text: "",
      jd_source: "paste",
      selected_template: null,
      github_username: "",
      pipeline_stages: [],
      processing_logs: [],
      is_processing: false,
      current_stage: "",
      wizard_step: "resume",
      skill_profile: null,
      parsed_jd: null,
      gap_analysis: null,
      pathway: null,
      alternative_pathways: [],
      pathway_view: "graph_2d",
      pathway_constraints: { max_hours_per_week: 20, total_weeks: 8, learning_style: "visual", priority_mode: "balanced" },
      pathway_diff: null,
      quiz_state: null,
      quiz_available: false,
      reasoning_traces: {},
      agent_conversation: null,
      counterfactuals: [],
      graph_data: null,
      tsne_coords: [],
      roi_analysis: null,
      competency_trend: [],
      badges: [],
      streak: { current: 0, best: 0, total_active_days: 0, week_activity: [false, false, false, false, false, false, false] },
      xp: { current_xp: 0, level: 1, xp_to_next_level: 100, total_xp: 0 },
      role_comparisons: [],
      cohort_analysis: null,
      mentor_matches: [],
      sidebar_open: false,
      chatbot_open: false,
      dark_mode: true,

      // ── Actions ──────────────────────────────────────────────
      setResumeFile: (file) => set({ resume_file: file }),
      setResumeText: (text) => set({ resume_text: text }),
      setJDText: (text) => set({ jd_text: text }),
      setJdText: (text) => set({ jd_text: text }),
      setJDSource: (source) => set({ jd_source: source }),
      setJdSource: (source) => set({ jd_source: source }),
      setSelectedTemplate: (id) => set({ selected_template: id }),
      setGithubUsername: (username) => set({ github_username: username }),
      setIsProcessing: (v) => set({ is_processing: v }),
      setPipelineStages: (stages) => set({ pipeline_stages: stages }),
      updatePipelineStage: (id, status, message) =>
        set((s) => ({
          pipeline_stages: s.pipeline_stages.map((stage: any) =>
            stage.id === id ? { ...stage, status, ...(message ? { message } : {}) } : stage
          ),
        })),
      setCurrentStage: (stage) => set({ current_stage: stage }),
      addProcessingLog: (log) => set((s) => ({ processing_logs: [...s.processing_logs, log] })),
      setWizardStep: (step) => set({ wizard_step: step }),
      setSkillProfile: (profile) => set({ skill_profile: profile }),
      setParsedJD: (jd) => set({ parsed_jd: jd }),
      setGapAnalysis: (analysis) => set({ gap_analysis: analysis }),
      setPathway: (pathway) => set({ pathway }),
      setAlternativePathways: (paths) => set({ alternative_pathways: paths }),
      setPathwayView: (view) => set({ pathway_view: view }),
      setPathwayConstraints: (constraints) => set({ pathway_constraints: constraints }),
      setPathwayDiff: (diff) => set({ pathway_diff: diff }),
      setQuizState: (state) => set({ quiz_state: state }),
      setQuizAvailable: (v) => set({ quiz_available: v }),
      setReasoningTraces: (traces) => set({ reasoning_traces: traces }),
      setAgentConversation: (conv) => set({ agent_conversation: conv }),
      setGraphData: (data) => set({ graph_data: data }),
      setTsneCoords: (coords) => set({ tsne_coords: coords }),
      setROIAnalysis: (roi) => set({ roi_analysis: roi }),
      setCompetencyTrend: (trend) => set({ competency_trend: trend }),
      setBadges: (badges) => set({ badges }),
      earnBadge: (badgeId) =>
        set((s) => ({
          badges: s.badges.map((b: any) =>
            b.id === badgeId ? { ...b, earned: true, earned_at: new Date().toISOString() } : b
          ),
        })),
      addXP: (amount) =>
        set((s) => {
          const total = (s.xp?.total_xp ?? 0) + amount;
          const level = Math.floor(total / 100) + 1;
          const current_xp = total % 100;
          return { xp: { current_xp, level, xp_to_next_level: 100 - current_xp, total_xp: total } };
        }),
      incrementStreak: () =>
        set((s) => ({
          streak: {
            ...s.streak,
            current: (s.streak?.current ?? 0) + 1,
            best: Math.max(s.streak?.best ?? 0, (s.streak?.current ?? 0) + 1),
          },
        })),
      setRoleComparisons: (comparisons) => set({ role_comparisons: comparisons }),
      setCohortAnalysis: (analysis) => set({ cohort_analysis: analysis }),
      setMentorMatches: (matches) => set({ mentor_matches: matches }),
      setSidebarOpen: (v) => set({ sidebar_open: v }),
      setChatbotOpen: (v) => set({ chatbot_open: v }),
      toggleChatbot: () => set((s) => ({ chatbot_open: !s.chatbot_open })),
      setDarkMode: (v) => set({ dark_mode: v }),
      updateSkillVerification: (skillId, verified, proficiency) =>
        set((s) => ({
          skill_profile: s.skill_profile
            ? {
                ...s.skill_profile,
                skills: (s.skill_profile as any).skills?.map((sk: any) =>
                  sk.id === skillId
                    ? { ...sk, verified, ...(proficiency !== undefined ? { user_override: proficiency } : {}) }
                    : sk
                ),
              }
            : null,
        })),
      updateModuleStatus: (moduleId, status) =>
        set((s) => ({
          pathway: s.pathway
            ? {
                ...s.pathway,
                phases: (s.pathway as any).phases?.map((ph: any) => ({
                  ...ph,
                  modules: ph.modules?.map((m: any) =>
                    m.id === moduleId ? { ...m, status } : m
                  ),
                })),
              }
            : null,
        })),
      resetAnalysis: () =>
        set({
          resume_file: null,
          resume_text: "",
          jd_text: "",
          skill_profile: null,
          parsed_jd: null,
          gap_analysis: null,
          pathway: null,
          graph_data: null,
          pipeline_stages: [],
          processing_logs: [],
          quiz_state: null,
          reasoning_traces: {},
          agent_conversation: null,
          wizard_step: "resume",
          is_processing: false,
        }),
    }),
    {
      name: "skillforge-storage",
      partialize: (state) => ({
        dark_mode: state.dark_mode,
        pathway_view: state.pathway_view,
        badges: state.badges,
        xp: state.xp,
        streak: state.streak,
        pathway_constraints: state.pathway_constraints,
      }),
    }
  )
);
