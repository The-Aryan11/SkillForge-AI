import { useStore } from "@/lib/store";
export function useAnalysis() {
  const store = useStore();
  return {
    skillProfile: store.skill_profile,
    parsedJD: store.parsed_jd,
    gapAnalysis: store.gap_analysis,
    isProcessing: store.is_processing,
    pipelineStages: store.pipeline_stages,
    processingLogs: store.processing_logs,
  };
}
