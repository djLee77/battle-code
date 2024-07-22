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
  userStatus: IUserStatus[];
  isGameStart: boolean;
  usersCorrectStatus: IUsersCorrectStatus[];
  submitCount: number;
  surrenders: ISurrenders[];
  setRoomStatus: (status: IRoom | null) => void;
  setUserStatus: (
    status: IUserStatus[] | ((prev: IUserStatus[]) => IUserStatus[])
  ) => void;
  setIsGameStart: (status: boolean) => void;
  setUsersCorrectStatus: (
    status:
      | IUsersCorrectStatus[]
      | ((prev: IUsersCorrectStatus[]) => IUsersCorrectStatus[])
  ) => void;
  setSubmitCount: (count: number | ((prev: number) => number)) => void;
  setSurrenders: (
    status: ISurrenders[] | ((prev: ISurrenders[]) => ISurrenders[])
  ) => void;
  resetState: () => void;
}

const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      roomStatus: null,
      userStatus: [],
      isGameStart: false,
      usersCorrectStatus: [],
      submitCount: -1,
      surrenders: [],
      setRoomStatus: (status) => set({ roomStatus: status }),
      setUserStatus: (status) =>
        set((state) => ({
          userStatus:
            typeof status === 'function' ? status(state.userStatus) : status,
        })),
      setIsGameStart: (status) => set({ isGameStart: status }),
      setUsersCorrectStatus: (status) =>
        set((state) => ({
          usersCorrectStatus:
            typeof status === 'function'
              ? status(state.usersCorrectStatus)
              : status,
        })),
      setSubmitCount: (count) =>
        set((state) => ({
          submitCount:
            typeof count === 'function' ? count(state.submitCount) : count,
        })),
      setSurrenders: (status) =>
        set((state) => ({
          surrenders:
            typeof status === 'function' ? status(state.surrenders) : status,
        })),
      resetState: () =>
        set({
          roomStatus: null,
          userStatus: [],
          isGameStart: false,
          usersCorrectStatus: [],
          submitCount: -1,
          surrenders: [],
        }),
    }),
    {
      name: 'room-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useRoomStore;
