// store/useRoomStore.js
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IRoom, IUserStatus } from 'types';

interface ISurrenders {
  id: string;
  isSurrender: boolean;
}

interface IUsersCorrectStatus {
  id: string;
  isCorrect: boolean;
}

interface RoomState {
  roomStatus: IRoom | null;
  userStatus: IUserStatus | null;
  isGameStart: boolean;
  usersCorrectStatus: IUsersCorrectStatus[] | null;
  submitCount: number;
  surrenders: ISurrenders[] | null;
  setRoomStatus: (status: IRoom) => void;
  setUserStatus: (status: any) => void;
  setIsGameStart: (status: boolean) => void;
  setUsersCorrectStatus: (status: IUsersCorrectStatus[]) => void;
  setSubmitCount: (count: number) => void;
  setSurrenders: (status: ISurrenders[]) => void;
}

const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      roomStatus: null,
      userStatus: null,
      isGameStart: false,
      usersCorrectStatus: null,
      submitCount: 0,
      surrenders: null,
      setRoomStatus: (status) => set({ roomStatus: status }),
      setUserStatus: (status) => set({ userStatus: status }),
      setIsGameStart: (status) => set({ isGameStart: status }),
      setUsersCorrectStatus: (status) => set({ usersCorrectStatus: status }),
      setSubmitCount: (count) => set({ submitCount: count }),
      setSurrenders: (status) => set({ surrenders: status }),
    }),
    {
      name: 'room-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useRoomStore;
