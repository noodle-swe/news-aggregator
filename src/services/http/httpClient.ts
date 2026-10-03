export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type QueryValue = string | number | undefined | null | false;

/** Builds a query string, dropping empty values so adapters stay declarative. */
export function buildQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === false || value === '') continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

function describeStatus(status: number): string {
  if (status === 401 || status === 403) return 'API key is missing or invalid';
  if (status === 426) return 'This request needs a paid plan';
  if (status === 429) return 'Rate limit reached — try again in a minute';
  if (status >= 500) return 'The service is temporarily unavailable';
  return `Request failed (${status})`;
}

/** Thin typed wrapper around fetch — the only place the app touches the network. */
export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'Network error — check your connection');
  }

  if (!response.ok) throw new ApiError(response.status, describeStatus(response.status));
  return (await response.json()) as T;
}
