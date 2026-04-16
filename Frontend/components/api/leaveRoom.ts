import { apiRequest } from "@/lib/api";

export async function leaveRoom(id: number) {
    return apiRequest<void>(`/api/rooms/leave/${id}`, {
        method: 'POST',
    });
}
