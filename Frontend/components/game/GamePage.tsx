import GameCard from './GameCard'
import { GameLogic } from './GameLogic'
import mainmenuStyles from '../../app/mainmenu/mainmenu.module.css'
import { Chat } from '../ui/chat'

interface GamePageProps {
    roomId: string
    gameStateJson: string | null
    pendingDistCount?: number | null
    onDistSubmit?: (territoryId: string) => Promise<void> | void
    playerNames: string[]
    chatMessages: { username: string; message: string }[]
}

export default function GamePage({ roomId, gameStateJson, pendingDistCount = null, onDistSubmit, playerNames, chatMessages }: GamePageProps) {
    if (!chatMessages) alert("Kann net sein")
    return (
        <GameLogic roomId={roomId} gameStateJson={gameStateJson}>
            {({
                mode,
                setMode,
                activeRegionId,
                selectedFromRegionId,
                selectedToRegionId,
                troopCount,
                incrementTroops,
                decrementTroops,
                handleRegionClick,
                confirmAttack,
                confirmMove,
                confirmPlacement,
                gameStateJson: renderGameStateJson,
                ownerColorMap,
                getColorForOwner,
            }) => (
                <div style={{background: '#07142a', height: "100vh", display: "flex", color: "white", width: "100%"}}>
                    <div
                        className={`gap-6 rounded-32`}
                        style={{display: 'flex', flexDirection: 'row', width: '100%', height: 'fit-content', padding: '24px', borderRadius: '12px', boxSizing: 'border-box', alignItems: 'center', background: "rgba(255,255,255,0.02)", border: "1px solid rgba(59,130,246,0.08)", margin: "16px"}}
                    >
                        <div className="flex-1 flex flex-col gap-6 min-w-96" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column' }}>

                            <div className="space-y-2 flex-shrink-0">
                                <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(189,215,255,0.65)' }}>Spieler</h2>
                                {playerNames.map((name, index) => {
                                    const playerColor = getColorForOwner(name)
                                    return (
                                        <div key={index} className="flex items-center gap-3 p-2 rounded-md border border-[rgba(59,130,246,0.1)] hover:border-[rgba(59,130,246,0.3)] transition-colors">
                                            <div 
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white font-semibold flex-shrink-0"
                                                style={{ backgroundColor: playerColor }}
                                            >
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-sm font-medium truncate">{name}</div>
                                        </div>
                                    )
                                })}
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
                                <GameCard onRegionClick={handleRegionClick} gameStateJson={renderGameStateJson} onTerritoryButtonClick={(id) => { if (pendingDistCount && onDistSubmit) { void onDistSubmit(id); } else { handleRegionClick(id); } }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </GameLogic>
    )
}
