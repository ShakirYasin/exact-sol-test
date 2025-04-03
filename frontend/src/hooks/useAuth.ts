import { useMutation } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  role: "admin" | "user";
}

interface LoginResponse {
  access_token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useAuth() {
  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      return data as LoginResponse;
    },
  });

  const register = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      return data as User;
    },
  });

  return {
    login,
    register,
  };
}
