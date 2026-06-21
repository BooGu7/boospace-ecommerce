"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Address } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => boolean;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => boolean;

  logout: () => void;

  updateProfile: (
    data: Partial<Pick<User, "firstName" | "lastName" | "email">>,
  ) => void;

  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;

  // ✅ ADD THIS
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: () => false,

      register: () => false,

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (data) => {
        const user = get().user;
        if (!user) return;

        set({
          user: {
            ...user,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      addAddress: (address) => {
        const user = get().user;
        if (!user) return;

        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`,
        };

        set({
          user: {
            ...user,
            addresses: [...user.addresses, newAddress],
          },
        });
      },

      removeAddress: (id) => {
        const user = get().user;
        if (!user) return;

        set({
          user: {
            ...user,
            addresses: user.addresses.filter((a) => a.id !== id),
          },
        });
      },

      // ✅ IMPORTANT FIX
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
