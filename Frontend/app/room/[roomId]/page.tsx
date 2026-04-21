"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Lobby } from "@/components/Lobby";
import GamePage from "@/components/game/GamePage";
import { useRouter } from "next/navigation";
import { useGetCurrentUser } from '@/components/api/getCurrentUser';
import { DistributionDialog } from '@/components/game/DistributionDialog';
import { distTroops } from "@/components/api/distTroops";

export default function RoomPage() {
  const { roomId } = useParams() as { roomId?: string };
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{username: string; message:string}[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStateJson, setGameStateJson] = useState<string | null>(null);
  const [pendingDistCount, setPendingDistCount] = useState<number | null>(null);
  const [dialogTerritory, setDialogTerritory] = useState<string | null>(null);
  const router = useRouter();
  const currentUser = useGetCurrentUser();

  function playerListUpdated(e: MessageEvent) {
      const data: { username: string; host: boolean }[] = JSON.parse(e.data);
      setPlayerNames(data.map(player => player.username));
  }

  useEffect(() => {
    if (!roomId) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const url = `${apiBase}/api/game/stream/${roomId}`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.addEventListener("init", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("playerJoined", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("playerLeft", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("gameStarted", () => setGameStarted(true));
    eventSource.addEventListener("gameStateUpdate", (e: MessageEvent) => setGameStateJson(e.data));
    eventSource.addEventListener("askDistTroops", (e: MessageEvent) => {
      const data: number = JSON.parse(e.data);
      setPendingDistCount(data);
    });

    eventSource.addEventListener("chatMessage", (e: MessageEvent) => {
      const data: { username: string; message: string } = JSON.parse(e.data);
      setChatMessages((prev) => [...prev, data]); 
    });

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [roomId]);

  async function onDistSubmit(territoryId: string) {
    if (pendingDistCount == null) return

    try {
      const parsed = gameStateJson ? JSON.parse(gameStateJson) : []
      const entry = parsed.find((e: Record<string, unknown>) => e.territory === territoryId)
      const owner = (entry?.owner as string | null) || null
      if (!currentUser || currentUser.username !== owner) {
        return
      }
    } catch (err) {
      console.error('Fehler beim Prüfen des Besitzers:', err)
      return
    }

    setDialogTerritory(territoryId)
  }

  async function handleDialogConfirm(num: number) {
    if (pendingDistCount == null || !dialogTerritory) return

    await distTroops(num, dialogTerritory, roomId!);


    setPendingDistCount((prev) => {
      if (prev == null) return null
      const remaining = prev - num
      return remaining > 0 ? remaining : null
    })

    setDialogTerritory(null)
  }

  function handleGameStarted() {
    setGameStarted(true);
  }

  return (
    <>
      {gameStarted ? (
        <>
          {pendingDistCount != null && (
            <div style={{position: 'fixed', right: 16, top: 16, zIndex: 2000}}>
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

          <DistributionDialog
            isOpen={dialogTerritory != null}
            territoryName={dialogTerritory || ''}
            availableTroops={pendingDistCount || 0}
            onConfirm={handleDialogConfirm}
            onCancel={() => setDialogTerritory(null)}
          />

          <GamePage roomId={roomId!} gameStateJson={gameStateJson} pendingDistCount={pendingDistCount} onDistSubmit={onDistSubmit} />
        </>
      ) : (
        <Lobby roomId={roomId!} playerNames={playerNames} chatMessages={chatMessages} onGameStart={() => handleGameStarted()} router={router} />
      )}    
    </>
  );
}