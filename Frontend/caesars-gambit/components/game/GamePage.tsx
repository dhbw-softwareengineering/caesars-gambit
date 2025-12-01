import GameCard from './GameCard'
import { GameLogic } from './GameLogic'
import mainmenuStyles from '../../app/mainmenu/mainmenu.module.css'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface GamePageProps {
    roomId: string
}

export default function GamePage({ roomId }: GamePageProps) {
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
                <div className={mainmenuStyles.container}>
                    <div
                        className={`${mainmenuStyles.card} flex flex-col gap-6 lg:flex-row`}
                    >
                        {/* LEFT: MAP */}
                        <section className="flex-1 flex flex-col gap-3">
                            <header className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold text-[rgba(225,240,255,0.95)]">
                                    Spielkarte
                                </h1>
                                <p className="text-sm text-[rgba(189,215,255,0.85)]">
                                    Klicke auf eine Region, um sie auszuwählen
                                    und oben rechts den Modus zu wechseln.
                                </p>
                            </header>

                            <div className="relative rounded-xl border border-[rgba(59,130,246,0.25)] bg-black/30 overflow-hidden shadow-md">
                                <GameCard onRegionClick={handleRegionClick} />
                            </div>
                        </section>

                        {/* RIGHT: CONTROL PANEL */}
                        <aside className="w-full lg:w-80 flex flex-col gap-4">
                            {/* Mode */}
                            <div className="rounded-xl border border-[rgba(59,130,246,0.18)] bg-[rgba(15,23,42,0.85)] px-4 py-3 flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <h2 className="text-sm font-semibold text-[rgba(225,240,255,0.95)]">
                                            Modus
                                        </h2>
                                        <p className="text-xs text-[rgba(189,215,255,0.75)]">
                                            Wähle, was du auf der Karte tun
                                            möchtest.
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-[rgba(59,130,246,0.16)] text-[rgba(191,219,254,1)] uppercase tracking-wide">
                                        {mode === 'view' && 'Ansehen'}
                                        {mode === 'place' && 'Aufstellen'}
                                        {mode === 'attack' && 'Angreifen'}
                                        {mode === 'move' && 'Verschieben'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        size="sm"
                                        variant={
                                            mode === 'view'
                                                ? 'primary'
                                                : 'default'
                                        }
                                        onClick={() => setMode('view')}
                                    >
                                        Region ansehen
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            mode === 'place'
                                                ? 'primary'
                                                : 'default'
                                        }
                                        onClick={() => setMode('place')}
                                    >
                                        Aufstellen
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            mode === 'attack'
                                                ? 'primary'
                                                : 'default'
                                        }
                                        onClick={() => setMode('attack')}
                                    >
                                        Angreifen
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            mode === 'move'
                                                ? 'primary'
                                                : 'default'
                                        }
                                        onClick={() => setMode('move')}
                                    >
                                        Verschieben
                                    </Button>
                                </div>
                            </div>

                            {/* Selection */}
                            <div className="rounded-xl border border-[rgba(59,130,246,0.18)] bg-[rgba(15,23,42,0.85)] px-4 py-3 flex flex-col gap-3">
                                <h2 className="text-sm font-semibold text-[rgba(225,240,255,0.95)]">
                                    Auswahl
                                </h2>
                                <div className="text-xs text-[rgba(189,215,255,0.85)] space-y-1">
                                    <p>
                                        <span className="text-[rgba(148,163,184,1)]">
                                            Aktiv:{' '}
                                        </span>
                                        <span className="font-mono">
                                            {activeRegionId ?? '–'}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-[rgba(148,163,184,1)]">
                                            Von:{' '}
                                        </span>
                                        <span className="font-mono">
                                            {selectedFromRegionId ?? '–'}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="text-[rgba(148,163,184,1)]">
                                            Nach:{' '}
                                        </span>
                                        <span className="font-mono">
                                            {selectedToRegionId ?? '–'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Troops & Actions */}
                            <div className="rounded-xl border border-[rgba(59,130,246,0.18)] bg-[rgba(15,23,42,0.85)] px-4 py-3 flex flex-col gap-3">
                                <h2 className="text-sm font-semibold text-[rgba(225,240,255,0.95)]">
                                    Truppen
                                </h2>

                                <div className="flex items-center gap-3">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="w-10"
                                        onClick={decrementTroops}
                                    >
                                        -
                                    </Button>
                                    <span className="min-w-[3rem] text-center font-mono text-base text-[rgba(225,240,255,0.95)]">
                                        {troopCount}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="w-10"
                                        onClick={incrementTroops}
                                    >
                                        +
                                    </Button>
                                </div>

                                <Separator className="my-2 bg-[rgba(30,64,175,0.6)]" />

                                <div className="flex flex-col gap-2">
                                    {mode === 'place' && (
                                        <Button
                                            variant="primary"
                                            onClick={confirmPlacement}
                                        >
                                            Truppen aufstellen
                                        </Button>
                                    )}
                                    {mode === 'move' && (
                                        <Button
                                            variant="primary"
                                            onClick={confirmMove}
                                        >
                                            Truppen verschieben
                                        </Button>
                                    )}
                                    {mode === 'attack' && (
                                        <Button
                                            variant="destructive"
                                            onClick={confirmAttack}
                                        >
                                            Angriff starten
                                        </Button>
                                    )}
                                    {mode === 'view' && (
                                        <p className="text-xs text-[rgba(148,163,184,1)]">
                                            Wähle einen Modus, um eine Aktion
                                            durchzuführen.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            )}
        </GameLogic>
    )
}
