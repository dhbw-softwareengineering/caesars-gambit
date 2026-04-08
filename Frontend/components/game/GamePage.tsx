import GameCard from './GameCard'
import { Chat } from '../ui/chat'
import { useEffect, useState } from 'react'
import { DistributionDialog } from './DistributionDialog'
import { getColorForOwner, useOwnerColorMap } from '@/lib/useOwnerColorMap'
import { distTroops } from '../api/distTroops'
import { useGetCurrentUser } from '../api/getCurrentUser'

type GamePageProps = {
    roomId: string
    gameStateJson: string | null
    setPendingDistCount: (count: number) => void
    pendingDistCount?: number | null
    playerNames: string[]
    chatMessages: { username: string; message: string }[]
}

type TerritoryData = {
    territory: string
    owner: string | null
    troops: number
}

export default function GamePage({ roomId, gameStateJson, pendingDistCount = null, playerNames, chatMessages, setPendingDistCount }: GamePageProps) {
    const [regionClicked, setRegionClicked] = useState<string | null>(null)
    const [dialogTerritory, setDialogTerritory] = useState<string | null>(null);
    const [territories, setTerritories] = useState<TerritoryData[]>([])
    const ownerColorMap = useOwnerColorMap(territories)
    const currentUser = useGetCurrentUser()

    useEffect(() => {
        if (!gameStateJson) return

        try {
            const parsed = JSON.parse(gameStateJson)
            if (Array.isArray(parsed)) {
                setTerritories(parsed)
            }
        } catch (err) {
            console.error('Fehler beim Parsen von gameStateJson:', err)
        }
    }, [gameStateJson])

    function territoryOwnedByCurrentUser(territoryId: string): boolean {
        const territory = territories.find((t) => t.territory === territoryId)
        return territory?.owner === currentUser?.username
    }

    function onDistSubmit(territoryId: string) {
        if (pendingDistCount == null) return
        if (!territoryOwnedByCurrentUser(territoryId)) {
            console.log("Hier noch was einbauen für UX")
            return;
        }

        setDialogTerritory(territoryId)
    }

    async function handleDialogConfirm(num: number) {
        if (pendingDistCount == null || !dialogTerritory) return

        await distTroops(num, dialogTerritory, roomId!);


        setPendingDistCount((prev) => {
            const remaining = prev - num
            return remaining > 0 ? remaining : null
        })

        setDialogTerritory(null)
    }

    function handleRegionClick(regionId: string) {
        if (!regionClicked && !territoryOwnedByCurrentUser(regionId)) {
            console.log("Hier einbauen, dass nicht eigenes Gebiert ist")
            return
        }

        if (pendingDistCount) {
            onDistSubmit(regionId)
            return
        }

        if (regionClicked === regionId) {
            return;
        }
        if (regionClicked) {
            if (territoryOwnedByCurrentUser(regionId)) {
                console.log("Hier Dialog aufrufen wie viele dahin verschoben werden sollen")
                setRegionClicked(null)
                return;
            } else {
                console.log("Hier einbauen dass angegriffen wird")
                setRegionClicked(null)
                return;
            }
        }
        console.log('Region angeklickt:', regionId, regionClicked)
        setRegionClicked(regionId)
    }
    return (
        <div style={{ background: '#07142a', height: "100vh", display: "flex", color: "white", width: "100%" }}>
            <div
                className={`gap-6 rounded-32`}
                style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'fit-content', padding: '24px', borderRadius: '12px', boxSizing: 'border-box', alignItems: 'center', background: "rgba(255,255,255,0.02)", border: "1px solid rgba(59,130,246,0.08)", margin: "16px" }}
            >
                <div className="flex-1 flex flex-col gap-6 min-w-96" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column' }}>

                    <div className="space-y-2 flex-shrink-0">
                        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(189,215,255,0.65)' }}>Spieler</h2>
                        {playerNames.map((name, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 rounded-md border border-[rgba(59,130,246,0.1)] hover:border-[rgba(59,130,246,0.3)] transition-colors">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-semibold flex-shrink-0"
                                    style={{ backgroundColor: getColorForOwner(name, ownerColorMap) }}
                                >
                                    {name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm font-medium truncate">{name}</div>
                            </div>
                        )
                        )}
                    </div>
                    <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(189,215,255,0.65)' }}>Chat</h2>
                        <div className="bg-white border rounded-md p-3 shadow-sm flex-grow flex flex-col overflow-hidden w-full">
                            <Chat msg={chatMessages} roomId={roomId} />
                        </div>
                    </div>
                </div>

                <div className="flex-grow flex flex-col">
                    <div className="relative rounded-xl border border-[rgba(59,130,246,0.25)] bg-black/30 overflow-hidden shadow-md w-full" style={{}}>
                        <GameCard
                            onRegionClick={handleRegionClick}
                            gameStateJson={gameStateJson}
                        />
                        <button onClick={() => console.log("EndTurn")}>EndTurn</button>
                    </div>
                </div>
            </div>
            <DistributionDialog
                isOpen={dialogTerritory != null}
                territoryName={dialogTerritory || ''}
                availableTroops={pendingDistCount || 0}
                onConfirm={handleDialogConfirm}
                onCancel={() => setDialogTerritory(null)}
            />
        </div>

    )
}
