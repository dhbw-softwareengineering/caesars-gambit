"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ["/auth"];
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const isPublic = publicPaths.some(p => pathname?.startsWith(p));
    if (!isPublic && !token) {
      router.push('auth/login?m=Du+bist+nicht+angemeldet.+Bitte+logge+dich+ein+oder+registriere+dich+zuerst.');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
