export async function createRoom() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        throw new Error('No access token found. Please login first.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/rooms/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
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