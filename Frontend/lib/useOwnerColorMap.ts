import { useMemo } from 'react'

const COLOR_PALETTE = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
]

interface TerritoryData {
    territory: string
    owner: string | null
    troops: number
}

export const useOwnerColorMap = (territories: TerritoryData[]) => {
    const ownerColorMap = useMemo(() => {
        const map: Record<string, string> = {}
        let nextIndex = 0

        territories.forEach((t) => {
            if (!t.owner) return
            if (!map[t.owner]) {
                map[t.owner] = COLOR_PALETTE[nextIndex % COLOR_PALETTE.length]
                nextIndex += 1
            }
        })

        return map
    }, [territories])

    return ownerColorMap
}

export const getColorForOwner = (owner: string | null, colorMap: Record<string, string>): string => {
    if (!owner) return '#666666'
    return colorMap[owner] || '#888888'
}
