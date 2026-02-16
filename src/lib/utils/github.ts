export function parseGithubRepo(input: string): { owner: string; repo: string } | null {
  // Accept "owner/repo" or full URL
  const urlMatch = input.match(/github\.com\/([^/]+)\/([^/\s]+)/);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, "") };
  }

  const slashMatch = input.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (slashMatch) {
    return { owner: slashMatch[1], repo: slashMatch[2] };
  }

  return null;
}

export async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        Accept: "application/vnd.github.raw+json",
        "User-Agent": "AlloyMC-Web",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}
