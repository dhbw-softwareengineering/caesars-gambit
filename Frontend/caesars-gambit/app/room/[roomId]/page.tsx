"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { leaveRoom } from "@/components/api/leaveRoom";
import { Chat } from "@/components/ui/chat";




export default function RoomPage() {
  const router = useRouter();
  const { roomId } = useParams() as { roomId?: string };
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem("accessToken");
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const url = `${apiBase}/api/game/stream/${roomId}?token=${encodeURIComponent(token!)}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener("init", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("playerJoined", (e: MessageEvent) => playerListUpdated(e));
    eventSource.addEventListener("playerLeft", (e: MessageEvent) => playerListUpdated(e));

    eventSource.addEventListener("chatMessage", (e: MessageEvent) => {
      const data: { username: string; message: string } = JSON.parse(e.data);
      setChatMessages((prev) => [...prev, `${data.username}: ${data.message}`]); //todo map draus machen 
    });

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [roomId]);

  function playerListUpdated(e: MessageEvent) {
    try {
      const parsed = JSON.parse(e.data);
      // parsed may be an array of players or a single player or an array of usernames
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          setPlayerNames([]);
          return;
        }
        // array of objects?
        if (typeof parsed[0] === "object") {
          setPlayerNames(parsed.map((p: any) => String(p.username ?? p.name ?? "")));
          return;
        }
        // array of strings
        setPlayerNames(parsed.map((p: any) => String(p)));
        return;
      }

      // single object with username
      if (parsed && typeof parsed === "object" && typeof parsed.username === "string") {
        setPlayerNames([parsed.username]);
        return;
      }

      // single username string
      if (typeof parsed === "string") {
        setPlayerNames([parsed]);
        return;
      }

      console.warn("playerListUpdated: unexpected payload", parsed);
    } catch (err) {
      console.error("playerListUpdated: parse error", err, e.data);
    }
  }

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Risiko online", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("share failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold  ">Risiko online</h1>
          <p className="text-sm  mt-2">#{roomId}</p>
        </div>
        <div className="grid grid-cols-3 gap-10 items-start">

        {/* LEFT: Player List */}
        <aside className="col-span-1 max-w-[20rem] ">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Spieler</h2>
          <div className="bg-white border rounded-md p-3 shadow-sm w-full mx-auto">
            <div className="flex flex-col gap-2">
              {playerNames.length === 0 && (
                <div className="text-sm text-gray-400">Noch keine Spieler</div>
              )}
              {playerNames.map((name, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md border">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-700">{name.charAt(0).toUpperCase()}</div>
                  <div className="text-sm font-medium">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER: Controls */}
        <main className="col-span-1 self-center flex flex-col items-center">
          <div className="flex flex-col gap-4 w-48">
            <Button variant="primary" className="w-full" disabled={playerNames.length < 2}>
              Start
            </Button>

            <Button variant="default" className="w-full" onClick={handleShare}>
              {copied ? "Kopiert!" : "Raumlink kopieren"}
            </Button>

            <Button variant="destructive" className="w-full" onClick={async () => { await leaveRoom(Number(roomId)); router.push('/mainmenu'); }}>
              Raum verlassen
            </Button>
          </div>
        </main>

        {/* RIGHT: Chat */}
        <aside className="col-span-1 max-w-[20rem]">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Chat</h2>
          <div className="bg-white border rounded-md p-3 shadow-sm">
            <Chat msg={chatMessages} roomId={roomId} />
          </div>
        </aside>

        </div>
      </div>
    </div>
  );
}