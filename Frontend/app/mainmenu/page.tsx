"use client";
import { useState } from "react";
import styles from "./mainmenu.module.css"
import { useRouter } from "next/navigation";
import { joinRoom } from "@/components/api/joinRoom";
import { createRoom } from "@/components/api/createRoom";
import Button from "@/components/ui/button";
import signOut from "@/lib/auth";

export default function MainMenu() {
    const router = useRouter();
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [roomId, setRoomId] = useState("");
    
    const PAYPAL_LINK = "https://paypal.me/knoepsim/100";


    async function signOutAndRedirect() {
        await signOut();
        router.push("/auth/login?m=Du+hast+dich+abgemeldet.+Du+musst+dich+nun+wieder+anmelden.");
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
                                placeholder="Room ID"
                                aria-label="Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className={styles.input}
                            />
                            <Button
                                className={styles.joinBtn}
                                type="button"
                                onClick={() => {
                                    console.log("Join room:", roomId);
                                    joinRoom(Number(roomId));
                                    router.push(`/room/${roomId}`);
                                }}
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