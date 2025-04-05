import { useQuery } from '@tanstack/react-query';

export interface Event {
  _id: string;
  type: string;
  userId: string;
  metadata: Record<string, unknown>;
  description: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useEvents() {
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const response = await fetch(`${API_URL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      return response.json() as Promise<Event[]>;
    },
  });

  return {
    events,
    isLoading,
    error,
    refetch,
  };
} 