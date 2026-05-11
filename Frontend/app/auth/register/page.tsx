"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/ui/item";
import { SquareArrowOutUpRight } from "lucide-react";
// @ts-ignore
import packageJson from "@/package.json";

const APP_VERSION = packageJson.version;

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Register failed");
      router.push("/mainmenu");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-6 pointer-events-none">
        <img src="/assets/Karte-neutral.svg" alt="map bg" className="w-full h-full object-cover" />
      </div>

      <nav className="border-b border-slate-700/30 bg-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/assets/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
            <span className="sr-only">Startseite</span>
          </Link>
          <h1 className="text-xl font-semibold">Caesar&apos;s Gambit</h1>
        </div>
      </nav>

      <main className="flex min-h-[70vh] items-center justify-center z-10">
        <Item className="w-full max-w-md p-6">
        <form onSubmit={submit} className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-semibold">Register</h2>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
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
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            type="password"
            required
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="cursor-pointer">Register</Button>
            <Button type="button" className="cursor-pointer" variant="ghost" onClick={() => router.push("/auth/login")}><SquareArrowOutUpRight size={13} className="mr-2"/> Login</Button>
          </div>
        </form>
        </Item>
      </main>

      <footer className="border-t border-slate-700/30 py-8 mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>© 2026 Caesar&apos;s Gambit</p>
          <p className="text-xs text-slate-500 mt-1">Version {APP_VERSION}</p>
        </div>
      </footer>
    </div>
  );
}
