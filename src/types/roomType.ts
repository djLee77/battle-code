// 대기방 목록 카드 타입
export interface IRoomList {
  roomId: number;
  hostId: string;
  title: string;
  isWait: boolean;
  isLocked: boolean;
  isStarted: boolean;
  problemLevel: number;
  limitTime: number;
  maxSubmitCount: number;
  maxUserCount: number;
  countUsersInRoom: number;
  language: string;
}

// 대기방 타입
export interface IRoom {
  roomId: number;
  hostId: string;
  title: string;
  isLocked: boolean;
  isStarted: boolean;
  problemLevel: number;
  limitTime: number;
  maxSubmitCount: number;
  maxUserCount: number;
  language: string;
}

// 대기방 타입
export interface IRoomStatus {
  roomStatus: IRoom;
  userStatus: IUserStatus[]; // UserStatus 배열 타입
}

// UserStatus 인터페이스 정의
export interface IUserStatus {
  userId: string;
  isReady: boolean;
  language: string;
}
