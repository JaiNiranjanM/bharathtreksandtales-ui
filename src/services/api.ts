// ─── Base API client ──────────────────────────────────────────────────────────
// All service functions use this helper. It reads NEXT_PUBLIC_API_URL from env
// and normalises errors into a consistent ApiError shape.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  message?: string;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    // Next.js: no-store ensures we always get fresh data in Server Components
    // (override per-call for routes that benefit from caching)
    cache: options?.cache ?? "no-store",
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.error ?? "An unexpected error occurred");
  }

  // Most endpoints nest payload under `data`, but a few (bookings,
  // payments, contact) return a flat object — fall back to whole body.
  return (json.data ?? (json as unknown as T)) as T;
}

export { BASE_URL };
