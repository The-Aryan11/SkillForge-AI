// Central API client — all fetch calls go through here

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8000";

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function parseResume(formData: FormData) {
  const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Resume parsing failed");
  return res.json();
}

export async function analyzeGap(resumeText: string, jdText: string, constraints = {}) {
  return post(`${GATEWAY}/analyze`, { resume_text: resumeText, jd_text: jdText, constraints });
}

export async function generateQuiz(skillProfile: unknown, parsedJD: unknown) {
  return post(`${GATEWAY}/generate-quiz`, { skill_profile: skillProfile, parsed_jd: parsedJD });
}

export async function submitQuiz(quizResults: unknown, currentPathway: unknown) {
  return post(`${GATEWAY}/submit-quiz`, { quiz_results: quizResults, current_pathway: currentPathway });
}

export async function chatMessage(message: string, context: unknown) {
  return post(`${GATEWAY}/chat`, { message, context });
}
