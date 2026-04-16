"use client";
import { useState } from "react";
import styles from "./mainmenu.module.css"
import { useRouter } from "next/navigation";
import { joinRoom } from "@/components/api/joinRoom";
import { createRoom } from "@/components/api/createRoom";
import Button from "@/components/ui/button";
import signOut from "@/lib/auth";

import { useAppState } from "@/lib/AppStateContext";

import { Input } from "@/components/ui/input";

export default function MainMenu() {
    const router = useRouter();
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [roomId, setRoomId] = useState("");
    const { setError, withLoading } = useAppState();
    
    const PAYPAL_LINK = "https://paypal.me/YourHandle?locale.x=de_DE";

    async function handleCreateRoom() {
        try {
            await withLoading(async () => {
                const room = await createRoom();
                await joinRoom(room, true);
                router.push(`room/${room}`);
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Raum konnte nicht erstellt werden.");
        }
    }

    async function handleJoinRoom() {
        if (!roomId.trim()) return;
        try {
            await withLoading(async () => {
                await joinRoom(Number(roomId));
                router.push(`/room/${roomId}`);
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Beitritt zum Raum fehlgeschlagen.");
        }
    }

    async function signOutAndRedirect() {
        await withLoading(async () => {
            await signOut();
            router.push("/auth/login?m=Du+hast+dich+abgemeldet.+Du+musst+dich+nun+wieder+anmelden.");
        });
    }

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Caesar&apos;s Gambit</h1>
                    <p className={styles.paragraph}>
                        Wähle eine Option, um zu beginnen.
                    </p>
                </header>

                <nav className={styles.nav}>
                    <Button variant="primary" onClick={handleCreateRoom}>Spiel erstellen</Button>

                    {!showJoinInput ? (
                        <Button variant="secondary" onClick={() => setShowJoinInput(true)} type="button">
                            Lobby beitreten
                        </Button>
                    ) : (
                        <div className="flex gap-2 w-full">
                            <Input
                                placeholder="Room ID"
                                aria-label="Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                className="w-auto px-6 whitespace-nowrap"
                                type="button"
                                onClick={handleJoinRoom}
                                disabled={!roomId.trim()}
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
                    <span>Version 1.0</span>
                    <span>© Caesar&apos;s Gambit</span>
                </footer>
            </div>
        </main>
    );
}