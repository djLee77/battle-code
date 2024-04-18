import { create } from "zustand";
import * as StompJs from "@stomp/stompjs";

interface WebSocketStoreState {
  webSocketClient: StompJs.Client | null;
  isConnected: boolean;
  connectWebSocket: (refreshToken: string) => void;
  publishMessage: (destination: string, messageBody: any) => void;
  subscribe: (destination: string, callback: any) => void;
}

// 전역 상태로 관리
const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  webSocketClient: null,
  isConnected: false,

  // 소켓 연결
  connectWebSocket: (accessToken: string | undefined) => {
    const client = new StompJs.Client({
      brokerURL: process.env.REACT_APP_WS_URL || "",
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 0, // 0은 자동 재연결 비활성화
      // 연결 됐을 때
      onConnect: () => {
        console.log("연결 성공");
        // 연결 됐으면 연결 상태 true로 변경
        set((state) => ({ ...state, isConnected: true }));
      },
      // 에러 났을 때
      onStompError: (frame) => {
        console.error(frame);
      },

      // 연결 끊어졌을 때
      onDisconnect: () => {
        console.log("연결 해제");
      },
    });

    client.activate(); // 클라이언트 활성화
    // 클라이언트 정보 저장
    set((state) => ({ ...state, webSocketClient: client }));
  },

  // 메시지 전송
  publishMessage: (destination: string, messageBody: any) => {
    set((state) => {
      const { webSocketClient } = state;
      console.log("메시지 전송 ", messageBody);
      // 클라이언트 정보가 있으면 메시지 전송하기
      if (webSocketClient) {
        webSocketClient.publish({
          destination,
          body: JSON.stringify(messageBody),
        });
      }
      return state;
    });
  },

  // 채널 구독
  subscribe: (destination: string, callback: (message: StompJs.Message) => void) => {
    set((state) => {
      const { webSocketClient } = state;
      console.log("채널 구독", webSocketClient);
      // 클라이언트 정보가 있으면 채널 구독, 콜백 함수로 메시지 수신
      if (webSocketClient) {
        webSocketClient.subscribe(destination, (message) => {
          callback(message); // 새 메시지 수신 시 콜백 함수 호출
        });
      }
      return state;
    });
  },
}));

export default useWebSocketStore;
