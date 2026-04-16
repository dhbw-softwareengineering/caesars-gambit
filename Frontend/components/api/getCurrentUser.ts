import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export function useGetCurrentUser() {
    const [data, setData] = useState<{username:string} | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const userData = await apiRequest<{username:string}>('/api/user/currentUser');
                setData(userData);
            } catch (error) {
                console.error('CurrentUser unavailable', error);
            }
        };
        fetchData();
    }, []);

    return data;
}
