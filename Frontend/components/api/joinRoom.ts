import { apiRequest } from "@/lib/api";

export async function joinRoom(id: number, host: boolean = false) {
    return apiRequest<void>(`/api/rooms/join/${id}`, {
        method: 'POST',
        body: JSON.stringify({ host }),
    });
}
