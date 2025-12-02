"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Lobby } from "@/components/Lobby";
import GamePage from "@/components/game/GamePage";
import { useRouter } from "next/navigation";

export default function RoomPage() {
  const { roomId } = useParams() as { roomId?: string };
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{username: string; message:string}[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStateJson, setGameStateJson] = useState<string | null>(null);
  const router = useRouter();

  function playerListUpdated(e: MessageEvent) {
      const data: { username: string; host: boolean }[] = JSON.parse(e.data);
      setPlayerNames(data.map(player => player.username));
  }

  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem("accessToken");
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const url = `${apiBase}/api/game/stream/${roomId}?token=${encodeURIComponent(token!)}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener("init", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("playerJoined", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("playerLeft", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("gameStarted", () => setGameStarted(true));
    eventSource.addEventListener("gameStateUpdate", (e: MessageEvent) => setGameStateJson(e.data));

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

  function handleGameStarted() {
    setGameStarted(true);
  }

  return (
    <>
      {gameStarted ? 
        <GamePage roomId={roomId!} gameStateJson={gameStateJson} /> 
        :
        <Lobby roomId={roomId!} playerNames={playerNames} chatMessages={chatMessages} onGameStart={() => handleGameStarted()} router={router} />
      }    
    </>
  );
}