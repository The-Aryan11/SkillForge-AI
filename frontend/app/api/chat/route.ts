import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, context } = body;

  const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:8000";

  try {
    // Try gateway
    const response = await fetch(`${gatewayUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fallback: simple response
    return NextResponse.json({
      response: generateFallbackResponse(message, context),
    });
  } catch {
    return NextResponse.json({
      response: generateFallbackResponse(message, context),
    });
  }
}

function generateFallbackResponse(message: string, context: any): string {
  const lower = message.toLowerCase();

  if (lower.includes("how long") || lower.includes("time")) {
    return `Based on your current pathway, the total estimated time is ${context?.pathway_summary || "not yet calculated"}. You can adjust the pace in your preferences.`;
  }
  if (lower.includes("skip")) {
    return `You can potentially skip modules where your proficiency already meets the requirement. Check the Analysis page — your strengths section shows which skills exceed requirements.`;
  }
  if (lower.includes("why") && lower.includes("before")) {
    return `The ordering is determined by our prerequisite graph and adaptive pathing algorithm. Skills are ordered by: 1) Prerequisites (must learn A before B), 2) Priority score (gap severity × importance × downstream impact), 3) Bloom's Taxonomy progression.`;
  }
  if (lower.includes("readiness") || lower.includes("ready")) {
    return `Your current readiness score is ${context?.readiness ? `${(context.readiness * 100).toFixed(0)}%` : "not yet calculated"}. This is based on how many required skills you already possess at the required proficiency level.`;
  }
  if (lower.includes("gap") || lower.includes("missing")) {
    return `You have ${context?.gap_count || 0} skill gaps identified. Visit the Analysis page to see each gap ranked by priority, with full reasoning for why it was identified.`;
  }

  return `I can help you understand your pathway, skill gaps, and recommendations. Try asking:\n• "How long will my pathway take?"\n• "Why is X before Y in my pathway?"\n• "Can I skip any modules?"\n• "What is my readiness score?"`;
}