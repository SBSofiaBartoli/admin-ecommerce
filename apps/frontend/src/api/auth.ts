import { apiClient } from "./client";
import { AuthResponse } from "../types/auth";

interface LoginInput {
  email: string;
  password: string;
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout(): void {
  localStorage.removeItem("access_token");
}

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
