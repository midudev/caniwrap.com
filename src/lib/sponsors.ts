export interface Sponsor {
  login: string;
  id: number;
}

const QUERY = `{
  user(login: "midudev") {
    sponsors(first: 100) {
      nodes {
        ... on User { login databaseId }
        ... on Organization { login databaseId }
      }
    }
  }
}`;

export async function fetchSponsors(): Promise<Sponsor[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY }),
    });

    if (!res.ok) return [];

    const json = await res.json();
    const nodes = json?.data?.user?.sponsors?.nodes ?? [];

    return nodes
      .filter((n: any) => n?.login)
      .map((n: any) => ({ login: n.login, id: n.databaseId }));
  } catch {
    return [];
  }
}
