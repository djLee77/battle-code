import create from "zustand";

interface UserState {
  username: string;
  login: (username: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  userId: null,
  username: "",
  login: (username) => set({ username }),
  logout: () => set({ username: "" }),
}));

export default useUserStore;
