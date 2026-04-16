"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/ui/item";
import { SquareArrowOutUpRight } from "lucide-react";

import { apiRequest } from "@/lib/api";
import { useAppState } from "@/lib/AppStateContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setError, clearError, withLoading } = useAppState();
  const [message, setMessage] = useState<string | null>(null); 
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryMessage = searchParams.get("m");
    if (queryMessage) {
      setMessage(queryMessage);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("m");
      router.replace(currentUrl.toString()); 
    }
  }, [searchParams, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await withLoading(async () => {
        const data = await apiRequest<{ accessToken: string }>('/api/auth/login', {
          method: "POST",
          body: JSON.stringify({ email, password }),
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
        {message && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
            {message}
          </div>
        )}
        <form onSubmit={submit} className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-semibold">Login</h2>
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
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
