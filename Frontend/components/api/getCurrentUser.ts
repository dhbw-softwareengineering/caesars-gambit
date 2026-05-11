import { useEffect, useState } from "react";

import type { UserDto } from "@/types/dto";

export type CurrentUserState =
  | {
      status: "loading";
      user: null;
      error: null;
    }
  | {
      status: "authenticated";
      user: UserDto;
      error: null;
    }
  | {
      status: "unauthenticated";
      user: null;
      error: null;
    }
  | {
      status: "error";
      user: null;
      error: string;
    };

const BACKEND_UNAVAILABLE_MESSAGE = "Anwendung ist zur Zeit nicht verfügbar";

export function useGetCurrentUser(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({
    status: "loading",
    user: null,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/user/currentUser`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          setState({ status: "unauthenticated", user: null, error: null });
          return;
        }

        if (!response.ok) {
          setState({ status: "error", user: null, error: BACKEND_UNAVAILABLE_MESSAGE });
          return;
        }

        const user = (await response.json()) as UserDto;
        setState({ status: "authenticated", user, error: null });
      } catch {
        setState({ status: "error", user: null, error: BACKEND_UNAVAILABLE_MESSAGE });
      }
    }

    void fetchData();
  }, []);

  return state;
}
