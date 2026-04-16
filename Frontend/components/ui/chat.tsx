import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../api/sendMessage";
import { useGetCurrentUser } from "../api/getCurrentUser";

type ChatProps = {
  msg: { username: string; message: string }[];
  roomId?: string | number;
};

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";

export function Chat({ msg, roomId }: ChatProps) {
  const [messageInput, setMessageInput] = useState<string>("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const numericRoomId = typeof roomId === "string" ? Number(roomId) : (roomId as number | undefined);
  const user = useGetCurrentUser();

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msg]);

  const handleSend = async () => {
    if (!messageInput.trim()) return;
    if (!numericRoomId || Number.isNaN(numericRoomId)) return;

    try {
      await sendMessage(numericRoomId, messageInput.trim());
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

if (user === null) {
  return <div className="p-4 text-sm text-muted-foreground animate-pulse">Lade Chat...</div>;
}

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-foreground">Chat</h3>
        <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">{msg.length} Nachrichten</span>
      </div>

      <div
        ref={listRef}
        className="h-80 bg-slate-50/50 border border-input rounded-md p-3 overflow-auto space-y-3 shadow-inner scroll-smooth">
        {msg.length === 0 && (
          <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground italic">
            Kein Chatverlauf
          </div>
        )}

        {msg.map((item, index) => {
          const initials = item.username
            ? item.username
                .split(" ")
                .map((s) => s.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "?";

          const isOwnMessage = user && user.username === item.username;

          return (
            <div key={index} className={cn("flex items-start gap-2", isOwnMessage ? "flex-row-reverse" : "flex-row")}>
              {!isOwnMessage && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {initials}
                </div>
              )}
              <div className={cn("flex flex-col gap-1 max-w-[85%]", isOwnMessage ? "items-end" : "items-start")}>
                {!isOwnMessage && <div className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">{item.username}</div>}
                <div className={cn(
                  "px-3 py-2 rounded-2xl text-sm shadow-sm",
                  isOwnMessage 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-white text-foreground border border-input rounded-tl-none"
                )}>
                  {item.message}
                </div>
              </div>
            </div>
          );
        })
      }
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          className="flex-1"
          placeholder="Schreibe etwas..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
        />

        <Button
          className="w-auto px-5"
          variant="primary"
          onClick={() => void handleSend()}
          disabled={!messageInput.trim() || !numericRoomId || Number.isNaN(numericRoomId)}>
          Senden
        </Button>
      </div>
    </div>
  );
}