"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Lobby } from "@/components/Lobby";
import GamePage from "@/components/game/GamePage";
import { useGetCurrentUser } from '@/components/api/getCurrentUser';
import { DistributionDialog } from '@/components/game/DistributionDialog';
import { distTroops } from "@/components/api/distTroops";
import { useGameStore } from "@/lib/store";
import { useGameEvents } from "@/hooks/useGameEvents";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();
  const currentUser = useGetCurrentUser();
  
  // Use global store
  const { 
    playerNames, 
    chatMessages, 
    gameStarted, 
    gameState, 
    pendingDistCount,
    setPendingDistCount,
    setGameStarted 
  } = useGameStore();

  // Initialize SSE events
  useGameEvents(roomId);

  const [dialogTerritory, setDialogTerritory] = useState<string | null>(null);

  async function onDistSubmit(territoryId: string) {
    if (pendingDistCount == null) return

    try {
      const territories = gameState?.territories || [];
      const entry = territories.find((e) => e.territory === territoryId);
      const owner = entry?.owner || null;
      
      if (!currentUser || currentUser.username !== owner) {
        return;
      }
    } catch (err) {
      console.error('Fehler beim Prüfen des Besitzers:', err);
      return;
    }

    setDialogTerritory(territoryId);
  }

  async function handleDialogConfirm(num: number) {
    if (pendingDistCount == null || !dialogTerritory) return;

    await distTroops(num, dialogTerritory, roomId!);

    setPendingDistCount(
      pendingDistCount - num > 0 ? pendingDistCount - num : null
    );

    setDialogTerritory(null);
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

          <GamePage 
            roomId={roomId!} 
            gameStateJson={JSON.stringify(gameState?.territories || [])} 
            pendingDistCount={pendingDistCount} 
            onDistSubmit={onDistSubmit} 
          />
        </>
      ) : (
        <Lobby 
          roomId={roomId!} 
          playerNames={playerNames} 
          chatMessages={chatMessages} 
          onGameStart={() => setGameStarted(true)} 
          router={router} 
        />
      )}    
    </>
  );
}
