import { apiClient } from "./client";

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("avatar", file);
  return apiClient<{ avatarUrl: string }>("/profile/avatar", {
    method: "PUT",
    body: formData,
  });
}

export async function getProfile(): Promise<{ avatarUrl: string | null }> {
  return apiClient<{ avatarUrl: string | null }>("/profile/me");
}
