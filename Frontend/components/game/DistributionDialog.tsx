import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface DistributionDialogProps {
    isOpen: boolean
    territoryName: string
    availableTroops: number
    onConfirm: (count: number) => void
    onCancel: () => void
}

import { Item, ItemHeader, ItemTitle, ItemContent, ItemFooter } from '@/components/ui/item'
import { Input } from '@/components/ui/input'

export const DistributionDialog: React.FC<DistributionDialogProps> = ({
    isOpen,
    territoryName,
    availableTroops,
    onConfirm,
    onCancel,
}) => {
    const [count, setCount] = useState(1)

    if (!isOpen) return null

    const handleConfirm = () => {
        if (count > 0 && count <= availableTroops) {
            onConfirm(count)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirm()
        } else if (e.key === 'Escape') {
            onCancel()
        }
    }

    return (
        <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[3000] p-4 animate-in fade-in"
            onClick={onCancel}
        >
            <Item
                variant="outline"
                className="bg-card w-full max-w-sm shadow-2xl p-6 flex flex-col gap-6 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <ItemHeader>
                    <ItemTitle className="text-xl font-bold">Truppen verteilen</ItemTitle>
                </ItemHeader>
                
                <ItemContent className="p-0 flex flex-col gap-4">
                    <div className="bg-muted/50 p-3 rounded-md border border-border/50">
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Gebiet</p>
                        <p className="text-base font-semibold">{territoryName}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
                                Anzahl
                            </label>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                Max: {availableTroops}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-12 h-12 text-lg rounded-full"
                                onClick={() => setCount((prev) => Math.max(1, prev - 1))}
                            >
                                -
                            </Button>
                            <Input
                                type="number"
                                min="1"
                                max={availableTroops}
                                value={count}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10)
                                    if (!isNaN(val) && val >= 1 && val <= availableTroops) {
                                        setCount(val)
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                className="flex-1 text-center text-lg font-bold h-12"
                            />
                            <Button
                                size="sm"
                                variant="secondary"
                                className="w-12 h-12 text-lg rounded-full"
                                onClick={() => setCount((prev) => Math.min(availableTroops, prev + 1))}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </ItemContent>

                <ItemFooter className="pt-2 flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className="flex-1 border-none"
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={count <= 0 || count > availableTroops}
                        className="flex-1 shadow-md shadow-primary/20"
                    >
                        Verteilen
                    </Button>
                </ItemFooter>
            </Item>
        </div>
    )
}
