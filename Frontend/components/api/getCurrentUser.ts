import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { UserDTO } from "@/types/api";

export function useUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => apiRequest<UserDTO>("/api/user/currentUser"),
    staleTime: 60 * 1000,
    retry: false,
  });
}

// Keep the old name for backward compatibility during migration
export function useGetCurrentUser() {
    const { data } = useUser();
    return data || null;
}
