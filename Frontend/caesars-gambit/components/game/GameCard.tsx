import { useEffect, useRef } from 'react'
import Image from 'next/image'
import KarteFabig from '../../../../assets/Karte-fabig.jpg'
import KarteSvg from '../../../../assets/Karte-neutral.svg'
import styles from './GameCard.module.css'

export interface GameCardProps {
    onRegionClick?: (regionId: string) => void
}

export default function GameCard({ onRegionClick }: GameCardProps) {
    // direkter DOM-Zugang, um später innerHTML = svgText zu setzen
    const svgContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const container = svgContainerRef.current
        if (!container) return

        // fetch weil <img src="..."> kein DOM-SVG ist
        fetch(KarteSvg.src)
            .then((res) => res.text())
            .then((svgText) => {
                container.innerHTML = svgText

                const svg = container.querySelector('svg')
                if (!svg) return

                svg.setAttribute('width', '100%')
                svg.setAttribute('height', '100%')
                svg.style.display = 'block'

                const regions =
                    svg.querySelectorAll<SVGGraphicsElement>('path[id]')

                regions.forEach((region) => {
                    region.style.cursor = 'pointer'

                    const clickHandler = () => {
                        onRegionClick?.(region.id)
                    }

                    region.addEventListener('click', clickHandler)
                    ;(region as any)._gcClickHandler = clickHandler
                })

                return () => {
                    regions.forEach((region) => {
                        const handler = (region as any)._gcClickHandler as
                            | ((e: MouseEvent) => void)
                            | undefined
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
                    src={KarteFabig}
                    alt="Spielkarte"
                    className={styles.mapBg}
                    priority
                />

                <div ref={svgContainerRef} className={styles.mapSvgContainer} />
            </div>
        </>
    )
}
