import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './GameCard.module.css'
import { TerritoryLabels } from './TerritoryLabels'

const KARTE_SVG_PATH = '/assets/Karte-neutral.svg'
const KARTE_FABIG_PATH = '/assets/Karte-fabig.jpg'

export interface GameCardProps {
    onRegionClick?: (regionId: string) => void
    gameStateJson?: string | null
}

export default function GameCard({ onRegionClick, gameStateJson }: GameCardProps) {
    const svgContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const container = svgContainerRef.current
        if (!container) return

        fetch(KARTE_SVG_PATH)
            .then((res) => res.text())
            .then((svgText) => {
                container.innerHTML = svgText

                const svg = container.querySelector('svg')
                if (!svg) return

                svg.setAttribute('width', '100%')
                svg.setAttribute('height', '100%')
                svg.style.display = 'block'
                svg.style.opacity = '0'
                svg.style.pointerEvents = 'auto'

                const regions =
                    svg.querySelectorAll<SVGGraphicsElement>('path[id]')

                regions.forEach((region) => {
                    region.style.cursor = 'pointer'
                    region.style.pointerEvents = 'auto'

                    const clickHandler = () => {
                        onRegionClick?.(region.id)
                    }

                    region.addEventListener('click', clickHandler)
                    ;(region as SVGGraphicsElement & { _gcClickHandler?: () => void })._gcClickHandler = clickHandler
                })

                return () => {
                    regions.forEach((region) => {
                        const handler = (region as SVGGraphicsElement & { _gcClickHandler?: () => void })._gcClickHandler
                        if (handler) {
                            region.removeEventListener('click', handler)
                        }
                    })
                }
            })
            .catch((err) => {
                console.error('SVG konnte nicht geladen werden:', err)
            })
    }, [onRegionClick])

    return (
        <>
            <div className={styles.mapWrapper}>
                <Image
                    src={KARTE_FABIG_PATH}
                    alt="Spielkarte"
                    className={styles.mapBg}
                    priority
                    width={2400}
                    height={1600}
                    style={{ width: '100%', height: '100%' }}
                />

                <div ref={svgContainerRef} className={styles.mapSvgContainer} />
                <TerritoryLabels gameStateJson={gameStateJson || null} onTerritoryButtonClick={onRegionClick}  />
            </div>
        </>
    )
}
