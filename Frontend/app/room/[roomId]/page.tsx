"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Lobby } from "@/components/Lobby";
import GamePage from "@/components/game/GamePage";
import { useRouter } from "next/navigation";
import { useGetCurrentUser } from '@/components/api/getCurrentUser';

export default function RoomPage() {
  const { roomId } = useParams() as { roomId?: string };
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{ username: string; message: string }[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStateJson, setGameStateJson] = useState<string | null>(null);
  const [pendingDistCount, setPendingDistCount] = useState<number | null>(null);
  const router = useRouter();
  const currentUser = useGetCurrentUser();
  const searchParams = useSearchParams();

  function playerListUpdated(e: MessageEvent) {
    const data: { username: string; host: boolean }[] = JSON.parse(e.data);
    setPlayerNames(data.map(player => player.username));
  }

  useEffect(() => {
    if (searchParams.get("started") === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGameStarted(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!roomId) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const url = `${apiBase}/api/game/stream/${roomId}`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.addEventListener("init", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("playerJoined", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("playerLeft", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("gameStarted", () => {
      setGameStarted(true);
      router.push(`/room/${roomId}?started=true`);
    });
    eventSource.addEventListener("gameStateUpdate", (e: MessageEvent) => setGameStateJson(e.data));
    eventSource.addEventListener("askDistTroops", (e: MessageEvent) => {
      const data: number = JSON.parse(e.data);
      setPendingDistCount(data);
    });
    eventSource.addEventListener("chatMessage", (e: MessageEvent) => {
      const data: { username: string; message: string } = JSON.parse(e.data);
      setChatMessages((prev) => [...prev, data]);
    });
    eventSource.addEventListener("currentPlayer", (e: MessageEvent) => {
      if (currentUser && currentUser.username === e.data) {
        alert("Du bist am Zug! Verteile deine Truppen.");
      }
    });
    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [roomId, currentUser]);

  function handleGameStarted() {
    setGameStarted(true);
  }

  return (
    <>
      {gameStarted ? (
        <>
          {pendingDistCount != null && (
            <div style={{ position: 'fixed', right: 16, top: 16, zIndex: 2000 }}>
              <div className="rounded bg-[#0b1220] border border-[rgba(59,130,246,0.25)] px-4 py-3 text-white shadow">
                <div className="flex items-center gap-3">
                  <div>
                    <strong>{pendingDistCount}</strong> Truppen verteilen — klicke auf ein Gebiet, das du besitzt.
                  </div>
                  <div>
                    <button className="ml-2 px-2 py-1 bg-red-600 rounded" onClick={() => setPendingDistCount(null)}>Abbrechen</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <GamePage roomId={roomId!} gameStateJson={gameStateJson} pendingDistCount={pendingDistCount} setPendingDistCount={setPendingDistCount} playerNames={playerNames} chatMessages={chatMessages} />
        </>
      ) : (
        <Lobby roomId={roomId!} playerNames={playerNames} chatMessages={chatMessages} onGameStart={() => handleGameStarted()} router={router} />
      )}
    </>
  );
}