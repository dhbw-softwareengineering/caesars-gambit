import { apiRequest } from "@/lib/api";

export async function createRoom() {
    const data = await apiRequest<any>('/api/rooms/create', {
        method: 'POST',
    });
    console.log('Room created:', data);
    return data;
}
