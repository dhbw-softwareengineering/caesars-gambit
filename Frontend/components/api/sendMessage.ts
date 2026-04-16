import { apiRequest } from "@/lib/api";

export async function sendMessage(id: number, message: string) {
    return apiRequest<void>(`/api/rooms/message/${id}`, {
        method: 'POST',
        body: JSON.stringify({ message }),
    });
}
