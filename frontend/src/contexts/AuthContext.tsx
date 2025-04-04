import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { useAuth as useAuthApi } from "../hooks/useAuth";
import { User } from "../types";
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { login: loginApi, register: registerApi, getMe } = useAuthApi();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (getMe.data) {
      setUser(getMe.data);
      setIsAuthenticated(true);
    } else if (getMe.error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    }
  }, [getMe.data, getMe.error]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await loginApi.mutateAsync({ email, password });
      localStorage.setItem("token", result.access_token);
      setIsAuthenticated(true);
      getMe.refetch();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"));
      throw err;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      setError(null);
      await registerApi.mutateAsync(data);
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Registration failed"));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        isLoading: loginApi.isPending || registerApi.isPending || getMe.isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
