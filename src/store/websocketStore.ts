import { create } from "zustand";
import * as StompJs from "@stomp/stompjs";
import { getRefreshToken } from "../utils/cookie";

interface WebSocketStoreState {
  webSocketClient: StompJs.Client | null;
  connectWebSocket: (refreshToken: string) => void;
  publishMessage: (destination: string, messageBody: any) => void;
}

const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  webSocketClient: null,

  connectWebSocket: (refreshToken: string | undefined) => {
    const client = new StompJs.Client({
      brokerURL: process.env.REACT_APP_WS_URL || "",
      connectHeaders: {
        Authorization: `Bearer ${refreshToken}`,
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
}));

export default useWebSocketStore;
