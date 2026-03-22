import { useStore } from "@/lib/store";
export function usePathway() {
  const store = useStore();
  return {
    pathway: store.pathway,
    pathwayView: store.pathway_view,
    graphData: store.graph_data,
    alternativePathways: store.alternative_pathways,
  };
}
