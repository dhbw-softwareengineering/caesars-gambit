import { apiRequest } from "@/lib/api";

export async function distTroops(sum: number, to: string, roomId: string) {
    return apiRequest<void>('/api/game/distTroops', {
        method: 'POST',
        body: JSON.stringify({ to, sum, roomId }),
    });
}
