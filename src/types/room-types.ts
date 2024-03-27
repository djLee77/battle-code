// 대기방 목록 카드 타입
export interface Room {
  id: number;
  title: string;
  members: string;
  isWait: boolean;
  password: string | null;
  settings: RoomSettings;
}

// 방 설정 타입
export interface RoomSettings {
  difficulty: string;
  timeLimit: string;
  numOfSubmissions: number;
  lang: string;
}
