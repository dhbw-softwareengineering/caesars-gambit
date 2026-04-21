"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ["/auth"];
    const isPublic = publicPaths.some(p => pathname?.startsWith(p));
    if (isPublic) return;

    fetch(`${API_BASE}/api/user/currentUser`, {
      credentials: "include",
    }).then(res => {
      if (!res.ok) {
        router.replace("/auth/login?m=Du+bist+nicht+angemeldet.+Bitte+logge+dich+ein+oder+registriere+dich+zuerst.");
      }
    }).catch(() => {
      router.replace("/auth/login?m=Du+bist+nicht+angemeldet.+Bitte+logge+dich+ein+oder+registriere+dich+zuerst.");
    });
  }, [pathname, router]);

  return <>{children}</>;
}
