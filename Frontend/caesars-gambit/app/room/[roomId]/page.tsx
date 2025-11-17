"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { leaveRoom } from "@/components/api/leaveRoom";


export default function RoomPage() {
  const router = useRouter();
  const { roomId } = useParams() as { roomId?: string };
  const [messages, setMessages] = useState<MessageEvent[]>([]);
  const [playerNames, setPlayerNames] = useState<String[]>([])


  useEffect(() => {
    if (!roomId) return;

    // read token from localStorage and pass as query param (EventSource can't set headers)
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    if (!token) {
      console.error("No access token found for SSE");
      return;
    }

  const url = `${apiBase}/api/game/stream/${roomId}?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener("init", (e: MessageEvent) => {
      console.log("Connected:", e.data);
    });

    eventSource.addEventListener("playerJoined", (e: MessageEvent) => {
      const data: { username: string; host: boolean }[] = JSON.parse(e.data);
      setPlayerNames(data.map(player => player.username));
      console.log(data.map(player => player.username))
    })

    eventSource.addEventListener("playerLeft", (e: MessageEvent) => {
      const data: { username: string; host: boolean }[] = JSON.parse(e.data);
      setPlayerNames(data.map(player => player.username));
      
    })

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
    
      <h1 className="text-2xl font-semibold text-center">Risiko online</h1>

      
      <p className="text-center text-sm text-gray-500">#Raum: {roomId}</p>

      {messages.map( (e:MessageEvent) => {return <span>{e.data}source: {e.source} origin: {e.origin}  {e.ports}</span>})}
      <div className="flex flex-col gap-2 w-56">
        {playerNames.map((name, index) => (
          <div key={index} className="border border-gray-300 rounded-md px-3 py-2">
            {name}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-6 w-48">
        <Button variant="primary">
          Start
        </Button>
        
        <Button variant="primary">
          share room link
        </Button>
        
        <Button variant="destructive" onClick={async () => { await leaveRoom(Number(roomId)); router.push('/mainmenu'); }}>
          Leave room
        </Button>
      </div>
    </div>
  );
}