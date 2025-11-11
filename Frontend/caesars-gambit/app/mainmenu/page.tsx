"use client";
import { useState } from "react";
import styles from "./mainmenu.module.css"
import {useRouter} from "next/navigation";
import { joinRoom } from "@/components/api/joinRoom";
import { createRoom } from "@/components/api/createRoom";

export default function MainMenu() {
    const router = useRouter();
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [roomId, setRoomId] = useState("");

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Caesar's Gambit</h1>
                    <p className={styles.paragraph}>
                        Wähle eine Option, um zu beginnen.
                    </p>
                </header>

                <nav className={styles.nav}>
                    <button className={`${styles.buttonBase} ${styles.btnCreateGame}`} onClick={async () => {
                        const room = await createRoom();
                        await joinRoom(room);
                        router.push(`room/${room}`);
                    }}>Spiel erstellen</button>

                    {!showJoinInput ? (
                        <button
                            className={`${styles.buttonBase} ${styles.btnDefault}`}
                            onClick={() => setShowJoinInput(true)}
                            type="button"
                        >
                            Lobby beitreten
                        </button>
                    ) : (
                        <div className={styles.inputWrapper}>
                            <input
                                placeholder="Room ID"
                                aria-label="Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className={styles.input}
                            />
                            <button
                                className={`${styles.buttonBase} ${styles.joinBtn}`}
                                type="button"
                                onClick={() => {
                                    console.log("Join room:", roomId);
                                    joinRoom(Number(roomId));
                                    router.push(`/room/${roomId}`);
                                }}
                                disabled={!roomId.trim()}
                            >
                                Join room
                            </button>
                        </div>
                    )}

                    <button className={`${styles.buttonBase} ${styles.btnDefault}`}>Einstellungen</button>
                    <button className={`${styles.buttonBase} ${styles.btnDefault}`}>Hilf bei der Entwicklung</button>
                    <button className={`${styles.buttonBase} ${styles.btnLogOut}`}>Abmelden</button>
                </nav>

                <footer className={styles.footer}>
                    <span>Version 1.0</span>
                    <span>© Caesar's Gambit</span>
                </footer>
            </div>
        </main>
    );
}
