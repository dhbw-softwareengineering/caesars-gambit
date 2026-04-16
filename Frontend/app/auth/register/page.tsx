"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/ui/item";
import { SquareArrowOutUpRight } from "lucide-react";

import { apiRequest } from "@/lib/api";
import { useAppState } from "@/lib/AppStateContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setError, clearError, withLoading } = useAppState();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await withLoading(async () => {
        const data = await apiRequest<{ accessToken: string }>('/api/auth/register', {
          method: "POST",
          body: JSON.stringify({ username, email, password }),
        });
        localStorage.setItem("accessToken", data.accessToken);
        router.push("/mainmenu");
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ein unerwarteter Fehler ist aufgetreten.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Item className="w-full max-w-md p-6">
        <form onSubmit={submit} className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-semibold">Register</h2>
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
  );
}
