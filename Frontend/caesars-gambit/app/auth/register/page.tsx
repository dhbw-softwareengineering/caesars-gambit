"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/ui/item";
import { SquareArrowOutUpRight } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.title = "Registrieren - Caesar's Gambit";
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Register failed");
      localStorage.setItem("accessToken", data.accessToken);
      router.push("/mainmenu");
    } catch (e: any) {
      setErr(e?.message || String(e));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Item className="w-full max-w-md p-6">
        <form onSubmit={submit} className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-semibold">Registrieren</h2>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <Input
            label="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Dein Benutzername"
            required
          />
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            required
          />
          <Input
            label="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dein Passwort"
            type="password"
            required
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="cursor-pointer">
              Registrieren
            </Button>
            <Button
              type="button"
              className="cursor-pointer"
              variant="ghost"
              onClick={() => router.push("/auth/login")}
            >
              <SquareArrowOutUpRight size={13} className="mr-2" /> Login
            </Button>
          </div>
        </form>
      </Item>
    </main>
  );
}
