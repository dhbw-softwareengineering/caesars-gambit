'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button";
import { leaveRoom } from "@/components/api/leaveRoom";
import { Chat } from "@/components/ui/chat";
import { Button } from '@/components/ui/button'
import { leaveRoom } from '@/components/api/leaveRoom'

import GamePage from '@/components/game/GamePage'

/* Vorschlag TODO : farbauswahl der Spieler aus vorgegebener Palette, jede Farbe aber nur einmal */

export default function RoomPage() {
  const router = useRouter();
  const { roomId } = useParams() as { roomId?: string };
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState<{username: string; message:string}[]>([]);

  function playerListUpdated(e: MessageEvent) {
      const data: { username: string; host: boolean }[] = JSON.parse(e.data);
      setPlayerNames(data.map(player => player.username));
  }

    useEffect(() => {
        if (!roomId) return

    const token = localStorage.getItem("accessToken");
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

        if (!token) {
            console.error('No access token found for SSE')
            return
        }

        const url = `${apiBase}/api/game/stream/${roomId}?token=${encodeURIComponent(token)}`
        const eventSource = new EventSource(url)

        eventSource.addEventListener('init', (e: MessageEvent) => {
            playerListUpdated(e)
        })

        eventSource.addEventListener('playerJoined', (e: MessageEvent) => {
            playerListUpdated(e)
        })

    eventSource.addEventListener("chatMessage", (e: MessageEvent) => {
      const data: { username: string; message: string } = JSON.parse(e.data);
      setChatMessages((prev) => [...prev, data]); 
    });

        eventSource.onerror = (err) => {
            console.error('SSE error', err)
            eventSource.close()
        }

        return () => eventSource.close()
    }, [roomId])

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
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
            <h1 className="text-2xl font-semibold text-center">
                Risiko online
            </h1>

            <p className="text-center text-sm text-gray-500">#Raum: {roomId}</p>

            {messages.map((e: MessageEvent) => {
                return (
                    <span>
                        {e.data}source: {e.source} origin: {e.origin} {e.ports}
                    </span>
                )
            })}
            <div className="flex flex-col gap-2 w-56">
                {playerNames.map((name, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    >
                        {name}
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-4 mt-6 w-48">
                <Button variant="primary">Start</Button>

                <Button
                    variant="primary"
                    onClick={async () => {
                        const url = window.location.href
                        await navigator.clipboard.writeText(url)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                    }}
                >
                    {copied ? 'Kopiert!' : 'Raumlink kopieren'}
                </Button>

                <Button
                    variant="destructive"
                    onClick={async () => {
                        await leaveRoom(Number(roomId))
                        router.push('/mainmenu')
                    }}
                >
                    Raum verlassen
                </Button>
            </div>
        </div>
    )
}
