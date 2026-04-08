"use client"

export async function signOut(): Promise<void> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    // attempt to notify backend (clears cookie if server uses cookies)
    await fetch(`${apiBase}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // ignore network errors - still remove client token
  }

  try {
    if (typeof window !== "undefined") localStorage.removeItem("accessToken");
  } catch {
    // ignore
  }
}

export default signOut;
