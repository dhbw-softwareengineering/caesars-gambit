import React, { useCallback, useState } from 'react'

export type GameMode = 'view' | 'place' | 'attack' | 'move'

export interface GameLogicProps {
    roomId: string

    token?: string
    gameStateJson?: string | null

    children: (renderProps: GameLogicRenderProps) => React.ReactNode
}

export interface GameLogicRenderProps {
    mode: GameMode
    setMode: (mode: GameMode) => void

    activeRegionId: string | null

    selectedFromRegionId: string | null
    selectedToRegionId: string | null

    troopCount: number
    incrementTroops: () => void
    decrementTroops: () => void
    setTroopCount: (value: number) => void

    handleRegionClick: (regionId: string) => void

    confirmAttack: () => Promise<void>
    confirmMove: () => Promise<void>
    confirmPlacement: () => Promise<void>

    gameStateJson: string | null
}

export const GameLogic: React.FC<GameLogicProps> = ({
    roomId,
    token,
    gameStateJson: propsGameStateJson,
    children,
}) => {
    const [mode, setMode] = useState<GameMode>('view')

    const [activeRegionId, setActiveRegionId] = useState<string | null>(null)
    const [selectedFromRegionId, setSelectedFromRegionId] = useState<
        string | null
    >(null)
    const [selectedToRegionId, setSelectedToRegionId] = useState<string | null>(
        null
    )

    const [troopCount, setTroopCount] = useState<number>(1)

    const buildHeaders = useCallback((): HeadersInit => {
        const headers: HeadersInit = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        return headers
    }, [token])

    const incrementTroops = useCallback(() => {
        setTroopCount((prev) => Math.max(1, prev + 1))
    }, [])

    const decrementTroops = useCallback(() => {
        setTroopCount((prev) => Math.max(1, prev - 1))
    }, [])

    const handleRegionClick = useCallback(
        (regionId: string) => {
            setActiveRegionId(regionId)

            switch (mode) {
                case 'view': {
                    setSelectedFromRegionId(null)
                    setSelectedToRegionId(null)
                    break
                }

                case 'place': {
                    setSelectedFromRegionId(null)
                    setSelectedToRegionId(regionId)
                    break
                }

                case 'attack': {
                    if (!selectedFromRegionId) {
                        setSelectedFromRegionId(regionId)
                        setSelectedToRegionId(null)
                    } else if (
                        selectedFromRegionId &&
                        !selectedToRegionId &&
                        regionId !== selectedFromRegionId
                    ) {
                        setSelectedToRegionId(regionId)
                    } else if (regionId === selectedFromRegionId) {
                        setSelectedFromRegionId(null)
                        setSelectedToRegionId(null)
                    } else {
                        setSelectedFromRegionId(regionId)
                        setSelectedToRegionId(null)
                    }
                    break
                }

                case 'move': {
                    if (!selectedFromRegionId) {
                        setSelectedFromRegionId(regionId)
                        setSelectedToRegionId(null)
                    } else if (
                        selectedFromRegionId &&
                        !selectedToRegionId &&
                        regionId !== selectedFromRegionId
                    ) {
                        setSelectedToRegionId(regionId)
                    } else if (regionId === selectedFromRegionId) {
                        setSelectedFromRegionId(null)
                        setSelectedToRegionId(null)
                    } else {
                        setSelectedFromRegionId(regionId)
                        setSelectedToRegionId(null)
                    }
                    break
                }
                default:
                    break
            }
        },
        [mode, selectedFromRegionId, selectedToRegionId]
    )

    const confirmAttack = useCallback(async () => {
        if (mode !== 'attack') {
            console.warn('confirmAttack aufgerufen, aber Mode ist', mode)
            return
        }
        if (!selectedFromRegionId || !selectedToRegionId) {
            console.warn('Angriff unvollständig: from oder to fehlt')
            return
        }

        const params = new URLSearchParams({
            from: selectedFromRegionId,
            to: selectedToRegionId,
            roomId: roomId,
        })

        console.log(
            '%c[FAKE-ATTACK]',
            'color: orange; font-weight: bold;',
            `Angreifer: ${selectedFromRegionId}  →  Ziel: ${selectedToRegionId}`
        )

        /* try {
            const res = await fetch(`/api/game/attack?${params.toString()}`, {
                method: 'POST',
                headers: buildHeaders(),
            })
            if (!res.ok) {
                console.error('Attack fehlgeschlagen', res.statusText)
            } else {
                console.log(
                    'Attack gesendet:',
                    selectedFromRegionId,
                    '→',
                    selectedToRegionId
                )
            }
        } catch (err) {
            console.error('Fehler beim Attack-Request:', err)
        } */
    }, [mode, selectedFromRegionId, selectedToRegionId, roomId, buildHeaders])

    const confirmMove = useCallback(async () => {
        if (mode !== 'move') {
            console.warn('confirmMove aufgerufen, aber Mode ist', mode)
            return
        }
        if (!selectedFromRegionId || !selectedToRegionId) {
            console.warn('Move unvollständig: from oder to fehlt')
            return
        }

        const params = new URLSearchParams({
            from: selectedFromRegionId,
            to: selectedToRegionId,
            sum: troopCount.toString(),
            roomId: roomId,
        })

        console.log(
            '%c[FAKE-MOVE]',
            'color: orange; font-weight: bold;',
            `${troopCount} Truppen  ${selectedFromRegionId}  →  ${selectedToRegionId}`
        )

        /* try {
            const res = await fetch(`/api/game/Move?${params.toString()}`, {
                method: 'POST',
                headers: buildHeaders(),
            })
            if (!res.ok) {
                console.error('Move fehlgeschlagen', res.statusText)
            } else {
                console.log(
                    'Move gesendet:',
                    troopCount,
                    'Truppen von',
                    selectedFromRegionId,
                    '→',
                    selectedToRegionId
                )
            }
        } catch (err) {
            console.error('Fehler beim Move-Request:', err)
        } */
    }, [
        mode,
        selectedFromRegionId,
        selectedToRegionId,
        troopCount,
        roomId,
        buildHeaders,
    ])

    const confirmPlacement = useCallback(async () => {
        if (mode !== 'place') {
            console.warn('confirmPlacement aufgerufen, aber Mode ist', mode)
            return
        }
        if (!selectedToRegionId) {
            console.warn('Placement unvollständig: Zielregion fehlt')
            return
        }

        const params = new URLSearchParams({
            to: selectedToRegionId,
            sum: troopCount.toString(),
            roomId: roomId,
        })

        console.log(
            '%c[FAKE-PLACEMENT]',
            'color: orange; font-weight: bold;',
            `${troopCount} Truppen  →  ${selectedToRegionId}`
        )

        /* try {
            const res = await fetch(
                `/api/game/distTroops?${params.toString()}`,
                {
                    method: 'POST',
                    headers: buildHeaders(),
                }
            )
            if (!res.ok) {
                console.error('distTroops fehlgeschlagen', res.statusText)
            } else {
                console.log(
                    'distTroops gesendet:',
                    troopCount,
                    'Truppen nach',
                    selectedToRegionId
                )
            }
        } catch (err) {
            console.error('Fehler beim distTroops-Request:', err)
        } */
    }, [mode, selectedToRegionId, troopCount, roomId, buildHeaders])

    return (
        <>
            {children({
                mode,
                setMode,
                activeRegionId,
                selectedFromRegionId,
                selectedToRegionId,
                troopCount,
                incrementTroops,
                decrementTroops,
                setTroopCount,
                handleRegionClick,
                confirmAttack,
                confirmMove,
                confirmPlacement,
                gameStateJson: propsGameStateJson || null,
            })}
        </>
    )
}
