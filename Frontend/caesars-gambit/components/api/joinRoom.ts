export async function joinRoom(id: number, host: boolean = false) {
    const token =  localStorage.getItem('accessToken');

    if (!token) {
        throw new Error('No access token found. Please login first.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/rooms/join/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ host }),
    });

    if (!response.ok) {
        throw new Error('Failed to join room');
    }

    return;
}