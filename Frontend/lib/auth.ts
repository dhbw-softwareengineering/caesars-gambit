"use client"

import { apiRequest } from "./api";

export async function signOut(): Promise<void> {
  try {
    // attempt to notify backend
    await apiRequest('/api/auth/signout', {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    // ignore network errors - still remove client token
    console.warn("Signout request failed", error);
  }

  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  } catch {
    // ignore
  }
}

export default signOut;
