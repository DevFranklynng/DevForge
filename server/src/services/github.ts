import env from "../config/env.js";

export interface GithubRepoPayload {
  name: string;
  owner: string;
  description: string | null;
  branch: string;
  visibility: "private" | "public";
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: Date | null;
  url: string | null;
  source: "github" | "demo";
}

export type GithubRepoInput = Omit<GithubRepoPayload, "source">;

/**
 * Fetches real repository metadata from the GitHub API when a token is
 * configured. Falls back to the caller-provided (or estimated) data and
 * marks it as `demo` so the UI never confuses it with live data.
 */
export async function syncGitHubRepo(input: GithubRepoInput): Promise<GithubRepoPayload> {
  if (!env.githubToken || !input.owner || !input.name) {
    return { ...input, source: "demo" };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${input.owner}/${input.name}`, {
      headers: {
        Authorization: `Bearer ${env.githubToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "DevForge",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return { ...input, source: "demo" };
    }

    const data = (await res.json()) as {
      full_name: string;
      description: string | null;
      default_branch: string;
      private: boolean;
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
      pushed_at: string;
      html_url: string;
    };

    const [owner, name] = data.full_name.split("/");
    return {
      name: name ?? input.name,
      owner: owner ?? input.owner,
      description: data.description,
      branch: data.default_branch,
      visibility: data.private ? "private" : "public",
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      lastCommit: data.pushed_at ? new Date(data.pushed_at) : null,
      url: data.html_url,
      source: "github",
    };
  } catch {
    return { ...input, source: "demo" };
  }
}