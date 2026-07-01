const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

interface AuthTokens {
  access: string;
  refresh: string;
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data.detail ?? data.non_field_errors?.[0] ?? "Não foi possível entrar. Tente novamente.";
    throw new ApiError(message, res.status);
  }

  return data as AuthTokens;
}
