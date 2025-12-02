"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/ui/item";
import { SquareArrowOutUpRight } from "lucide-react";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // Zustand für die Nachricht
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Hole den Query-Parameter "m" und speichere ihn im Zustand
    const queryMessage = searchParams.get("m");
    if (queryMessage) {
      setMessage(queryMessage); // Nachricht im Zustand speichern
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("m");
      router.replace(currentUrl.toString()); // Query-Parameter aus der URL entfernen
    }
  }, [searchParams, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("accessToken", data.accessToken);
      router.push("/mainmenu");
    } catch (e: any) {
      setErr(e?.message || String(e));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Item className="w-full max-w-md p-6">
        {/* Zeige die Nachricht, wenn sie im Zustand gespeichert ist */}
        {message && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
            {message}
          </div>
        )}
        <form onSubmit={submit} className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-semibold">Login</h2>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            required
          />
          <Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            type="password"
            required
          />
          <div className="flex gap-2">
            <Button type="submit" className="cursor-pointer">Login</Button>
            <Button
              type="button"
              className="cursor-pointer"
              variant="ghost"
              onClick={() => router.push("/auth/register")}
            >
              <SquareArrowOutUpRight size={13} className="mr-2" /> Register
            </Button>
          </div>
        </form>
      </Item>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
