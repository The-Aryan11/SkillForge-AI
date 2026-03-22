import { useStore } from "@/lib/store";
export function useQuiz() {
  const store = useStore();
  return {
    quizState: store.quiz_state,
    quizAvailable: store.quiz_available,
  };
}
