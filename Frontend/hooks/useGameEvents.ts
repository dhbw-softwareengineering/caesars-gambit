import { useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { API_BASE_URL } from "@/lib/api";
import { PlayerDTO, ChatMessageDTO, GameStateDTO } from "@/types/api";

export function useGameEvents(roomId: string | null) {
  const { 
    setPlayerNames, 
    addChatMessage, 
    setGameStarted, 
    setGameState, 
    setPendingDistCount 
  } = useGameStore();

  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem("accessToken");
    const url = `${API_BASE_URL}/api/game/stream/${roomId}?token=${encodeURIComponent(token!)}`;
    const eventSource = new EventSource(url);

    const playerListUpdated = (e: MessageEvent) => {
      const data: PlayerDTO[] = JSON.parse(e.data);
      setPlayerNames(data.map(p => p.username));
    };

    eventSource.addEventListener("init", playerListUpdated);
    eventSource.addEventListener("playerJoined", playerListUpdated);
    eventSource.addEventListener("playerLeft", playerListUpdated);
    
    eventSource.addEventListener("gameStarted", () => {
      setGameStarted(true);
    });

    eventSource.addEventListener("gameStateUpdate", (e: MessageEvent) => {
      const data: GameStateDTO = JSON.parse(e.data);
      setGameState(data);
    });

    eventSource.addEventListener("askDistTroops", (e: MessageEvent) => {
      const data: number = JSON.parse(e.data);
      setPendingDistCount(data);
    });

    eventSource.addEventListener("chatMessage", (e: MessageEvent) => {
      const data: ChatMessageDTO = JSON.parse(e.data);
      addChatMessage(data);
    });

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [roomId, setPlayerNames, addChatMessage, setGameStarted, setGameState, setPendingDistCount]);
}
