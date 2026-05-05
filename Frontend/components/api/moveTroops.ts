export async function moveTroops(sum: number, from: string, to: string, roomId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/game/move`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, sum, roomId }),
    });

    if (!response.ok) {
        throw new Error('Failed to create room');
    }

    return;
}