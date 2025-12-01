import GameCard from './GameCard'
import { GameLogic } from './GameLogic'

export default function GamePage({ roomId }: { roomId: string }) {
    return (
        <GameLogic roomId={roomId}>
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
            }) => (
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 2 }}>
                        <GameCard onRegionClick={handleRegionClick} />
                    </div>

                    <div
                        style={{
                            flex: 1,
                            border: '1px solid #ccc',
                            padding: '8px',
                        }}
                    >
                        <h2 style={{ fontWeight: 'bold' }}>Modus</h2>
                        <button onClick={() => setMode('view')}>
                            Region ansehen
                        </button>
                        <br />
                        <button onClick={() => setMode('place')}>
                            Aufstellen
                        </button>
                        <br />
                        <button onClick={() => setMode('attack')}>
                            Angreifen
                        </button>
                        <br />
                        <button onClick={() => setMode('move')}>
                            Truppen verschieben
                        </button>

                        <hr />

                        <h2 style={{ fontWeight: 'bold' }}>Auswahl</h2>
                        <p>Aktiv: {activeRegionId ?? '-'}</p>
                        <p>Von (from): {selectedFromRegionId ?? '-'}</p>
                        <p>Nach (to): {selectedToRegionId ?? '-'}</p>

                        <hr />

                        <h2 style={{ fontWeight: 'bold' }}>Truppen</h2>
                        <button onClick={decrementTroops}>-</button>
                        <span style={{ margin: '0 8px' }}>{troopCount}</span>
                        <button onClick={incrementTroops}>+</button>

                        <div style={{ marginTop: '8px' }}>
                            {mode === 'place' && (
                                <button onClick={confirmPlacement}>
                                    Aufstellen (OK)
                                </button>
                            )}
                            {mode === 'move' && (
                                <button onClick={confirmMove}>
                                    Truppen verschieben (OK)
                                </button>
                            )}
                            {mode === 'attack' && (
                                <button onClick={confirmAttack}>
                                    Angriff starten
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </GameLogic>
    )
}
