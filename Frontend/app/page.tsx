'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import signOut from "@/lib/auth";
import { Swords, Users, Map, Github } from "lucide-react";
import { useGetCurrentUser } from "@/components/api/getCurrentUser";
// @ts-ignore - package.json is valid JSON
import packageJson from "@/package.json";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const APP_VERSION = packageJson.version;

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useGetCurrentUser();

  useEffect(() => {
    // Check if user is authenticated
    fetch(`${API_BASE}/api/user/currentUser`, {
      credentials: "include",
    })
      .then((res) => {
        setIsAuthenticated(res.ok);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Graphics - blasse SVGs */}
      <div className="absolute inset-0 opacity-80 pointer-events-none">
        <img
          src="/assets/Karte-neutral.svg"
          alt="Map background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute top-10 right-10 opacity-10 pointer-events-none w-64 h-64">
        <img
          src="/assets/logo.svg"
          alt="Logo background"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="border-b border-slate-700/30 bg-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.svg" alt="Caesar's Gambit logo" className="w-8 h-8 object-contain" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Caesar&apos;s Gambit
            </h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        {isAuthenticated && currentUser ? (
          // LOGGED IN VIEW
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Willkommen, <span className="text-blue-400">{currentUser.username}</span>! 🎮
              </h2>
              <p className="text-xl text-slate-300">
                Bist du bereit für dein nächstes Abenteuer?
              </p>
            </div>

            {/* CTA Buttons - Logged In */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/mainmenu")}
                className="sm:flex-1"
              >
                Zum Hauptmenü
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleLogout}
                className="sm:flex-1"
              >
                Abmelden
              </Button>
            </div>
          </div>
        ) : (
          // NOT LOGGED IN VIEW
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Erobere die Welt
              </h2>
              <p className="text-xl text-slate-300">
                Strategisches Kriegsspiel für Meisterdenker. Baue Armeen auf, plane Offensiven und besiege deine Feinde in epischen Schlachten.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <Swords className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Strategisches Gameplay</h3>
                  <p className="text-slate-300 text-sm">
                    Taktische Entscheidungen in Echtzeit. Jeder Zug zählt!
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Users className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Multiplayer</h3>
                  <p className="text-slate-300 text-sm">
                    Spiele mit Freunden online. Erstelle oder betrete Spielräume in Sekunden.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Map className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Globales Spielfeld</h3>
                  <p className="text-slate-300 text-sm">
                    Kontrolliere Territorien auf der ganzen Welt. Dominiere die Landkarte!
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Not Logged In */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/auth/login")}
                className="sm:flex-1"
              >
                Login
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push("/auth/register")}
                className="sm:flex-1"
              >
                Registrieren
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Info Section - Only show when not logged in */}
      {!isAuthenticated && (
        <div className="bg-slate-800/50 border-y border-slate-700/30 py-16 mt-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">2-6</div>
                <p className="text-slate-300">Spieler pro Partie</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">~30min</div>
                <p className="text-slate-300">Durchschnittliche Spieldauer</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">Online</div>
                <p className="text-slate-300">Multiplayer Echtzeit</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700/30 py-8 mt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left text-slate-400 text-sm">
              <p>© 2026 Caesar&apos;s Gambit - Strategisches Kriegsspiel</p>
              <p className="text-xs text-slate-500 mt-1">Version {APP_VERSION}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a
                href="https://github.com/dhbw-softwareengineering/caesars-gambit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <span className="text-slate-500">|</span>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Datenschutz
              </a>
              <span className="text-slate-500">|</span>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Impressum
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
