import { AxiosResponse } from 'axios';
import DockLayout from 'rc-dock';
import api from '../../utils/axios';
import * as StompJs from '@stomp/stompjs';
import { IUserStatus } from '../../types'; // IRoomStatus와 IUserStatus 타입을 정의한 파일 경로

interface RoomSubscribe {
  subscription: StompJs.StompSubscription | null; // 구독 객체의 타입을 정의합니다.
}

/**
 * 방 퇴장 함수 *이 함수는 Room 컴포넌트에서 쓰이는 함수입니다.
 */
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
      console.log(roomSubscribe);
      roomSubscribe.subscription.unsubscribe(); // 구독 취소
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
    } else {
      console.error('알 수 없는 에러:', error);
    }
  }
};

/**
 * 언어 변경 함수 *이 함수는 Room 컴포넌트에서 쓰이는 함수입니다.
 */
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

/**
 * 게임 준비 함수 *이 함수는 Room 컴포넌트에서 쓰이는 함수입니다.
 */
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

/**
 * 게임 항복 함수 *이 함수는 Room 컴포넌트에서 쓰이는 함수입니다.
 */
export const handleSurrender = (
  userId: string | null,
  surrenders: any,
  roomId: number,
  publishMessage: (destination: string, payload: any) => void
): void => {
  const updateUser = surrenders.find((user: any) => user.userId === userId);
  if (updateUser) {
    updateUser.isSurrender = true;
    publishMessage(`/app/room/${roomId}/update/user-status`, updateUser);
  }
};

/**
 * 게임 시작 함수 *이 함수는 Room 컴포넌트에서 쓰이는 함수입니다.
 */
export const handleGameStart = async (
  roomId: number,
  userStatus: IUserStatus[],
  setIsGameStart: React.Dispatch<React.SetStateAction<boolean>>,
  setTestResults: React.Dispatch<React.SetStateAction<any>>,
  setSurrenders: React.Dispatch<React.SetStateAction<any>>,
  setIsSuccess: React.Dispatch<React.SetStateAction<any>>
): Promise<void> => {
  try {
    const response: AxiosResponse = await api.post(
      `v1/game/${roomId}/start`,
      {}
    );
    userStatus.map((user) => {
      setTestResults((prevResult: any) => [
        ...prevResult,
        {
          id: user.userId,
          percent: 0,
          result: 'PASS',
        },
      ]);
      setSurrenders((prevSurrender: any) => [
        ...prevSurrender,
        {
          id: user.userId,
          isSurrender: false,
        },
      ]);
      setIsSuccess((prevSuccess: any) => [
        ...prevSuccess,
        {
          id: user.userId,
          isSuccess: false,
        },
      ]);
    });
    setIsGameStart(true);
    console.log(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
    } else {
      console.error('알 수 없는 에러:', error);
    }
  }
};

export const searchMyLanguage = (
  userId: string | null,
  userStatus: IUserStatus[]
): string => {
  const player = userStatus.find((user) => user.userId === userId);
  return player ? player.language : '';
};

export const handleSubmit = (
  setTestResults: any,
  userId: string | null,
  problems: any,
  roomId: number,
  userStatus: any,
  code: string
) => {
  setTestResults((prevResults: any) =>
    prevResults.map((result: any) =>
      result.id === userId
        ? {
            id: userId,
            percent: 0,
          }
        : result
    )
  );
  api.post(`v1/judge`, {
    problemId: problems[0].id,
    roomId: roomId,
    userId: userId,
    language: searchMyLanguage(userId, userStatus),
    code: code,
  });
};

export const handleGameEnd = async (roomId: number): Promise<void> => {
  try {
    const response: AxiosResponse = await api.post(`v1/game/${roomId}/end`, {});
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
    } else {
      console.error('알 수 없는 에러:', error);
    }
  }
};
