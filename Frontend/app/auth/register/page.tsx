"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/ui/item";
import { SquareArrowOutUpRight } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiRequest } from "@/lib/api";
import { useAppState } from "@/lib/AppStateContext";
import { AuthResponseDTO } from "@/types/api";

const registerSchema = z.object({
  username: z.string().min(3, "Benutzername muss mindestens 3 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { setError, clearError, withLoading } = useAppState();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    clearError();
    try {
      await withLoading(async () => {
        const data = await apiRequest<AuthResponseDTO>('/api/auth/register', {
          method: "POST",
          body: JSON.stringify(values),
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-semibold">Register</h2>
          <Input
            label="Username"
            placeholder="Your username"
            error={errors.username?.message}
            {...register("username")}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            placeholder="Choose a password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
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
