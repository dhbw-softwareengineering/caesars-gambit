import { useState } from "react";
import Button from "./ui/button";
import { leaveRoom } from "./api/leaveRoom";
import { Chat } from "./ui/chat";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { startGame } from "./api/startGame";

type LobbyProps = {
    roomId: string;
    playerNames: string[];
    chatMessages: {username: string; message:string}[];
    onGameStart: () => void;
    router: AppRouterInstance; 
};

import { useAppState } from "@/lib/AppStateContext";

import { Item, ItemContent, ItemTitle, ItemMedia, ItemGroup } from "./ui/item";

export function Lobby({roomId, playerNames, chatMessages, onGameStart, router}: LobbyProps) {
    const [copied, setCopied] = useState(false);
    const { setError, withLoading } = useAppState();

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

    const handleLeaveRoom = async () => {
        try {
            await withLoading(async () => {
                await leaveRoom(Number(roomId));
                router.push('/mainmenu');
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verlassen des Raums fehlgeschlagen.');
        }
    };

    const handleStartGame = async () => {
        try {
            await withLoading(async () => {
                await startGame(Number(roomId));
                onGameStart();
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Spielstart fehlgeschlagen.');
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-6xl px-6 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Caesar&apos;s Gambit
            </h1>
            <p className="text-lg text-muted-foreground mt-4 font-medium uppercase tracking-[0.2em]">
              Lobby #{roomId}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Player List */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2">Spieler</h2>
              <Item variant="outline" className="bg-card shadow-sm p-2">
                <ItemGroup className="w-full">
                  {playerNames.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground italic">Warten auf Spieler...</div>
                  )}
                  {playerNames.map((name, index) => (
                    <Item key={index} className="border-none hover:bg-muted/50 transition-colors">
                      <ItemMedia variant="icon" className="bg-primary/10 text-primary font-bold">
                        {name.charAt(0).toUpperCase()}
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className="font-semibold">{name}</ItemTitle>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </Item>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center gap-6 py-8">
              <div className="flex flex-col gap-3 w-full max-w-[240px]">
                <Button variant="primary" size="lg" className="h-16 text-lg shadow-lg shadow-primary/20" disabled={playerNames.length < 2} onClick={handleStartGame}>
                  Spiel starten
                </Button>

                <Button variant="default" onClick={handleShare}>
                  {copied ? "Link kopiert!" : "Raumlink kopieren"}
                </Button>

                <Button variant="destructive" onClick={handleLeaveRoom}>
                  Raum verlassen
                </Button>
              </div>
            </div>

            {/* Chat */}
            <div className="flex flex-col gap-4">
               <Item variant="outline" className="bg-card shadow-sm p-4 h-full min-h-[450px]">
                 <Chat msg={chatMessages} roomId={roomId} />
               </Item>
            </div>
          </div>
        </div>
      </div>
    );
}