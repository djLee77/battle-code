import { create } from "zustand";
import * as StompJs from "@stomp/stompjs";

interface WebSocketStoreState {
  webSocketClient: StompJs.Client | null;
  isConnected: boolean;
  connectWebSocket: (refreshToken: string) => void;
  publishMessage: (destination: string, messageBody: any) => void;
  subscribe: (destination: string, callback: any) => void;
}

const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  webSocketClient: null,
  isConnected: false,

  connectWebSocket: (refreshToken: string | undefined) => {
    const client = new StompJs.Client({
      brokerURL: process.env.REACT_APP_WS_URL || "",
      connectHeaders: {
        Authorization: `Bearer ${refreshToken}`,
      },
      onConnect: () => {
        set((state) => ({ ...state, isConnected: true }));
      },
    });

    client.activate();
    set((state) => ({ ...state, webSocketClient: client }));
  },

  publishMessage: (destination: string, messageBody: any) => {
    set((state) => {
      const { webSocketClient } = state;
      console.log(webSocketClient);
      if (webSocketClient) {
        webSocketClient.publish({
          destination,
          body: JSON.stringify(messageBody),
        });
      }
      return state;
    });
  },

  subscribe: (destination: string, callback: (message: StompJs.Message) => void) => {
    set((state) => {
      const { webSocketClient } = state;
      console.log(webSocketClient);
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
