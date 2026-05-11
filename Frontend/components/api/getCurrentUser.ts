import { useEffect, useState } from "react";

export function useGetCurrentUser() {
  const [data, setData] = useState<{ username: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
          }/api/user/currentUser`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          setData(null);
          return;
        }

        setData(await response.json());
      } catch {
        setData(null);
      }
    }

    void fetchData();
  }, []);

  return data;
}
