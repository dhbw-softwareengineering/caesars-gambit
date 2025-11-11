"use client";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function RoomPage() {
  const params = useParams();
  const roomId = typeof params === "object" ? (params as any).roomId : params;
  const [messages, setMessages] = useState<string[]>([]);

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

    // generic message handler
    eventSource.onmessage = (e: MessageEvent) => {
      setMessages((prev) => [...prev, e.data]);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [roomId]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Room {roomId}</h1>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}