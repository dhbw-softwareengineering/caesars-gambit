"use client";
import { useState } from "react";
import styles from "./mainmenu.module.css"
import { useRouter } from "next/navigation";
import { joinRoom } from "@/components/api/joinRoom";
import { createRoom } from "@/components/api/createRoom";
import Button from "@/components/ui/button";
import signOut from "@/lib/auth";
// @ts-ignore
import packageJson from "@/package.json";

const APP_VERSION = packageJson.version;

export default function MainMenu() {
    const router = useRouter();
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [roomId, setRoomId] = useState("");
    
    const PAYPAL_LINK = "https://paypal.me/knoepsim/100";


    async function signOutAndRedirect() {
        await signOut();
        router.push("/auth/login?m=Du+hast+dich+abgemeldet.+Du+musst+dich+nun+wieder+anmelden.");
    }

    function parseRoomId(value: string): number | null {
        const trimmed = value.trim();
        if (!trimmed) return null;

        if (/^\d+$/.test(trimmed)) {
            return Number(trimmed);
        }

        const match = trimmed.match(/\/room\/(\d+)/i);
        if (match?.[1]) {
            return Number(match[1]);
        }

        return null;
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-6 pointer-events-none">
            <img src="/assets/Karte-neutral.svg" alt="map bg" className="w-full h-full object-cover" />
          </div>
          <main className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <div className="flex items-center gap-3 mb-3">
                      <img src="/assets/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
                      <h1 className={styles.title}>Caesar&apos;s Gambit</h1>
                    </div>
                    <p className={styles.paragraph}>
                        Wähle eine Option, um zu beginnen.
                    </p>
                </header>

                <nav className={styles.nav}>
                    <Button variant="primary" onClick={async () => {
                        const room = await createRoom();
                        await joinRoom(room, true);
                        router.push(`room/${room}`);
                    }}>Spiel erstellen</Button>

                    {!showJoinInput ? (
                        <Button variant="secondary" onClick={() => setShowJoinInput(true)} type="button">
                            Lobby beitreten
                        </Button>
                    ) : (
                        <div className={styles.inputWrapper}>
                            <input
                                placeholder="Room ID oder Link"
                                aria-label="Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className={styles.input}
                            />
                            <Button
                                className={styles.joinBtn}
                                type="button"
                                onClick={async () => {
                                    const parsedRoomId = parseRoomId(roomId);
                                    if (parsedRoomId == null) return;

                                    await joinRoom(parsedRoomId);
                                    router.push(`/room/${parsedRoomId}`);
                                }}
                                disabled={parseRoomId(roomId) == null}
                            >
                                Raum beitreten
                            </Button>
                        </div>
                    )}

                    <Button variant="default" onClick={() => router.push("/settings")}>Einstellungen </Button>
                    <Button
                        variant="default"
                        onClick={() => window.open(PAYPAL_LINK, "_blank", "noopener,noreferrer")}
                        aria-label="Spenden über PayPal öffnen"
                    >
                        Hilf bei der Entwicklung
                    </Button>
                    <Button variant="destructive" onClick={signOutAndRedirect}>Abmelden</Button>
                </nav>

                <footer className={styles.footer}>
                    <span>Version {APP_VERSION}</span>
                    <span>© Caesar&apos;s Gambit</span>
                </footer>
            </div>
        </main>
      </div>
    );
}