import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../api/sendMessage";

type ChatProps = {
  msg: string[];
  roomId?: string | number;
};

export function Chat({ msg, roomId }: ChatProps) {
  const [messageInput, setMessageInput] = useState<string>("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const numericRoomId = typeof roomId === "string" ? Number(roomId) : (roomId as number | undefined);

  // scroll to bottom when messages change
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msg]);

  const parseMessage = (raw: string) => {
    // try to split "username: message" else fallback
    const idx = raw.indexOf(":");
    if (idx > 0) {
      const username = raw.slice(0, idx).trim();
      const content = raw.slice(idx + 1).trim();
      return { username, content };
    }
    return { username: "", content: raw };
  };

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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Chat</h3>
        <span className="text-xs text-gray-500">{msg.length} messages</span>
      </div>

      <div
        ref={listRef}
        className="h-80 bg-white border rounded-md p-3 overflow-auto space-y-2 shadow-sm">
        {msg.length === 0 && (
          <div className="text-center text-sm text-gray-400">Kein Chatverlauf</div>
        )}

        {msg.map((raw, index) => {
          const { username, content } = parseMessage(raw);
          const initials = username
            ? username
                .split(" ")
                .map((s) => s.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "?";

          return (
            <div key={index} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                {initials}
              </div>
              <div className="flex-1">
                <div className="text-xs text-slate-500">{username}</div>
                <div className="mt-1 bg-slate-50 px-3 py-2 rounded-md text-sm text-slate-800 border border-slate-100">
                  {content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
          placeholder="Nachricht schreiben..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
        />

        <button
          className={`px-4 py-2 rounded-md font-semibold text-white ${
            messageInput.trim() ? "bg-violet-600 hover:bg-violet-700" : "bg-violet-300 cursor-not-allowed"
          }`}
          onClick={() => void handleSend()}
          disabled={!messageInput.trim() || !numericRoomId || Number.isNaN(numericRoomId)}>
          Senden
        </button>
      </div>
    </div>
  );
}