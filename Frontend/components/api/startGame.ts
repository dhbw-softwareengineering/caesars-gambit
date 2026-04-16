import { apiRequest } from "@/lib/api";

export async function startGame(id: number) {
    return apiRequest<void>(`/api/rooms/start/${id}`, {
        method: 'POST',
    });
}
