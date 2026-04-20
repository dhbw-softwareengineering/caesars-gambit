export async function createRoom() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/rooms/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to create room');
    }

    const data = await response.json();
    console.log('Room created:', data);
    return data;
}