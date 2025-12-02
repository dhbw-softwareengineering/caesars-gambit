import { useEffect, useState } from "react";

export function useGetCurrentUser() {
    const [data, setData] = useState<{username:string} | null>(null);
    const token =  localStorage.getItem('accessToken');

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/user/currentUser`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('CurrentUser unavailable');
        }

        setData(await response.json());
    };
        fetchData();
    }, []);
    return data;
}