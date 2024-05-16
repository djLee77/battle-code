import { AxiosResponse } from 'axios';
import DockLayout from 'rc-dock';
import api from '../../utils/axios';
import * as StompJs from '@stomp/stompjs';
import { IRoomStatus, IUserStatus } from '../../types'; // IRoomStatus와 IUserStatus 타입을 정의한 파일 경로

interface RoomSubscribe {
  subscription: StompJs.StompSubscription | null; // 구독 객체의 타입을 정의합니다.
}

export const handleRoomLeave = async (
  roomId: number,
  dockLayoutRef: React.RefObject<DockLayout>,
  roomSubscribe: RoomSubscribe,
  removeTab: (
    dockLayoutRef: React.RefObject<DockLayout>,
    tabName: string
  ) => void
): Promise<void> => {
  try {
    const response: AxiosResponse = await api.post(
      `v1/gameRoom/leave/${roomId}`,
      {}
    );
    console.log(response);
    removeTab(dockLayoutRef, `${roomId}번방`);
    if (roomSubscribe.subscription) {
      roomSubscribe.subscription.unsubscribe(); // 구독 취소
    }
  } catch (error) {
    console.error(error);
  }
};

export const handleLanguageChange = (
  userId: string,
  newLanguage: string,
  userStatus: IUserStatus[],
  roomId: number,
  publishMessage: (destination: string, payload: any) => void
): void => {
  const updateUser = userStatus.find((user) => user.userId === userId);
  if (updateUser) {
    updateUser.language = newLanguage;
    console.log(newLanguage);
    publishMessage(`/app/room/${roomId}/update/user-status`, updateUser);
  }
};

export const handleReady = (
  userId: string | null,
  userStatus: IUserStatus[],
  roomId: number,
  publishMessage: (destination: string, payload: any) => void
): void => {
  const updateUser = userStatus.find((user) => user.userId === userId);
  if (updateUser) {
    updateUser.isReady = !updateUser.isReady;
    publishMessage(`/app/room/${roomId}/update/user-status`, updateUser);
  }
};

export const handleGameStart = async (
  roomId: number,
  setIsGameStart: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  setIsGameStart(true);
  try {
    const response: AxiosResponse = await api.post(`v1/game/start`, {
      roomId: roomId,
    });
    if (response.status === 201) {
      setIsGameStart(true);
    }
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

export const searchMyLanguage = (
  userId: string | null,
  userStatus: IUserStatus[]
): string => {
  const player = userStatus.find((user) => user.userId === userId);
  return player ? player.language : '';
};
