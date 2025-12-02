export async function startGame(id: number) {
    const token =  localStorage.getItem('accessToken');

    if (!token) {
        throw new Error('No access token found. Please login first.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/rooms/start/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to start game: \n' + response.body);
    }

    return;
}