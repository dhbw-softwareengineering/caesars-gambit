export async function sendMessage(id: number, message: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/rooms/message/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error('Failed to join room');
    }

    return;
}