// src/store/useAuthStore.ts
import create from "zustand";

// 상태 타입 정의
interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

// Zustand 스토어 생성
const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token: string | null) => set({ accessToken: token }),
}));

export default useAuthStore;
