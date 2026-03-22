import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await userRes.json();

    // Fetch repos
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=30&sort=updated`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );

    const repos = reposRes.ok ? await reposRes.json() : [];

    // Extract languages
    const languageCounts: Record<string, number> = {};
    const topics: Set<string> = new Set();
    const recentRepos: any[] = [];

    for (const repo of repos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
      if (repo.topics) {
        repo.topics.forEach((t: string) => topics.add(t));
      }
      if (recentRepos.length < 5) {
        recentRepos.push({
          name: repo.name,
          language: repo.language,
          description: repo.description,
          stars: repo.stargazers_count,
          updated: repo.updated_at,
        });
      }
    }

    const languages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    return NextResponse.json({
      success: true,
      data: {
        username: user.login,
        name: user.name,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers,
        languages,
        topics: Array.from(topics).slice(0, 20),
        recent_repos: recentRepos,
        total_contributions: null,
        profile_url: user.html_url,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}