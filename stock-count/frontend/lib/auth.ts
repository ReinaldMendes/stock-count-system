import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await res.json();

          if (!data.success) {
            throw new Error(data.error || "Erro ao fazer login");
          }

          set({
            user: data.data.employee,
            token: data.data.token,
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erro desconhecido";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/auth/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password }),
            }
          );

          const data = await res.json();

          if (!data.success) {
            throw new Error(data.error || "Erro ao registrar");
          }

          set({
            user: data.data.employee,
            token: data.data.token,
            isLoading: false,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erro desconhecido";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
