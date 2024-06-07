import { create } from "zustand";
import { User } from "./lib/interfaces";

interface UserStore {
    user: User | null,
    storeUser: (user: User) => void,
    clearUser: () => void
}

export const useUserStore = create<UserStore>()((set) => ({
    user: null,
    storeUser: (user: User) => set({ user }),
    clearUser: () => set({ user: null })
}));