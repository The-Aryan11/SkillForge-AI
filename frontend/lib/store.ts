import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppStore {
  // upload
  resume_file: File | null;
  resume_text: string;
  jd_text: string;
  jd_source: "upload" | "paste" | "template" | "url";
  selected_template: string | null;
  github_username: string;

  // processing
  pipeline_stages: any[];
  processing_logs: any[];
  is_processing: boolean;
  current_stage: string;

  // analysis
  skill_profile: any | null;
  parsed_jd: any | null;
  gap_analysis: any | null;

  // pathway
  pathway: any | null;
  alternative_pathways: any[];
  pathway_view: "graph_3d" | "graph_2d" | "timeline" | "kanban" | "list";
  pathway_constraints: any;
  pathway_diff: any | null;

  // quiz
  quiz_state: any | null;
  quiz_available: boolean;

  // reasoning
  reasoning_traces: Record<string, any>;
  agent_conversation: any | null;
  counterfactuals: any[];

  // graph
  graph_data: any | null;
  tsne_coords: any[];

  // dashboard
  roi_analysis: any | null;
  competency_trend: any[];
  badges: any[];
  streak: any;
  xp: any;

  // comparison
  role_comparisons: any[];
  cohort_analysis: any | null;
  mentor_matches: any[];

  // ui
  wizard_step: "resume" | "jd" | "preferences" | "verification" | "processing";
  sidebar_open: boolean;
  chatbot_open: boolean;
  dark_mode: boolean;

  // actions
  setResumeFile: (file: File | null) => void;
  setResumeText: (text: string) => void;
  setJDText: (text: string) => void;
  setJDSource: (source: "upload" | "paste" | "template" | "url") => void;
  setSelectedTemplate: (id: string | null) => void;
  setGithubUsername: (username: string) => void;
  setIsProcessing: (v: boolean) => void;
  setPipelineStages: (stages: any[]) => void;
  addProcessingLog: (log: any) => void;
  setSkillProfile: (profile: any) => void;
  setParsedJD: (jd: any) => void;
  setGapAnalysis: (analysis: any) => void;
  setPathway: (pathway: any) => void;
  setPathwayView: (view: "graph_3d" | "graph_2d" | "timeline" | "kanban" | "list") => void;
  setGraphData: (data: any) => void;
  setWizardStep: (step: "resume" | "jd" | "preferences" | "verification" | "processing") => void;
  toggleChatbot: () => void;
  resetAnalysis: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
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
      skill_profile: null,
      parsed_jd: null,
      gap_analysis: null,
      pathway: null,
      alternative_pathways: [],
      pathway_view: "graph_2d",
      pathway_constraints: { max_hours_per_week: 20, total_weeks: 8, learning_style: "visual" },
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
      streak: { current: 0, best: 0, total_active_days: 0, week_activity: [] },
      xp: { current_xp: 0, level: 1, xp_to_next_level: 100, total_xp: 0 },
      role_comparisons: [],
      cohort_analysis: null,
      mentor_matches: [],
      wizard_step: "resume",
      sidebar_open: false,
      chatbot_open: false,
      dark_mode: true,

      setResumeFile: (file) => set({ resume_file: file }),
      setResumeText: (text) => set({ resume_text: text }),
      setJDText: (text) => set({ jd_text: text }),
      setJDSource: (source) => set({ jd_source: source }),
      setSelectedTemplate: (id) => set({ selected_template: id }),
      setGithubUsername: (username) => set({ github_username: username }),
      setIsProcessing: (v) => set({ is_processing: v }),
      setPipelineStages: (stages) => set({ pipeline_stages: stages }),
      addProcessingLog: (log) => set((s) => ({ processing_logs: [...s.processing_logs, log] })),
      setSkillProfile: (profile) => set({ skill_profile: profile }),
      setParsedJD: (jd) => set({ parsed_jd: jd }),
      setGapAnalysis: (analysis) => set({ gap_analysis: analysis }),
      setPathway: (pathway) => set({ pathway }),
      setPathwayView: (view) => set({ pathway_view: view }),
      setGraphData: (data) => set({ graph_data: data }),
      setWizardStep: (step) => set({ wizard_step: step }),
      toggleChatbot: () => set((s) => ({ chatbot_open: !s.chatbot_open })),
      resetAnalysis: () => set({
        resume_file: null, resume_text: "", jd_text: "", skill_profile: null,
        parsed_jd: null, gap_analysis: null, pathway: null, graph_data: null,
        pipeline_stages: [], processing_logs: [], quiz_state: null,
        reasoning_traces: {}, agent_conversation: null, wizard_step: "resume",
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
      }),
    }
  )
);
