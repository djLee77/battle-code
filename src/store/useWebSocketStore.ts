import { create } from 'zustand';
import * as StompJs from '@stomp/stompjs';
import { refreshAccessToken } from 'utils/axios';

interface Subscription {
  id: string;
  destination: string;
  callback: (message: StompJs.Message) => void;
  subscription: StompJs.StompSubscription | null;
}

interface WebSocketStoreState {
  webSocketClient: StompJs.Client | null;
  isConnected: boolean;
  subscriptions: Subscription[];
  isLogout: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  connectWebSocket: (accessToken: string) => void;
  reconnectWebSocket: () => void;
  publishMessage: (destination: string, messageBody: any) => void;
  subscribe: (id: string, destination: string, callback: any) => void;
  unsubscribe: (id: string) => void;
  setIsLogout: (loggingOut: boolean) => void;
  resetWebSocket: () => void;
}

// 전역 상태로 관리
const useWebSocketStore = create<WebSocketStoreState>((set, get) => ({
  webSocketClient: null,
  isConnected: false,
  subscriptions: [],
  isLogout: false,
  reconnectAttempts: 0,
  maxReconnectAttempts: 3,

  // 소켓 연결
  connectWebSocket: (accessToken: string) => {
    const client = new StompJs.Client({
      brokerURL: process.env.REACT_APP_WS_URL || '',
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 0,
      heartbeatIncoming: 30 * 1000,
      heartbeatOutgoing: 30 * 1000,
      onConnect: () => {
        console.log('연결 성공');
        set((state) => ({
          ...state,
          isConnected: true,
          isLogout: false,
          reconnectAttempts: 0,
        }));
        // 이전에 구독했던 채널을 다시 구독
        const subscriptions = get().subscriptions;
        console.log('구독 정보 : ', subscriptions);
        subscriptions.forEach(({ id, destination, callback }) => {
          get().subscribe(id, destination, callback);
        });
      },
      // 에러 났을 때
      onStompError: (frame) => {
        console.error(frame);
      },
      // 연결 끊어졌을 때
      onWebSocketClose: () => {
        console.error('WebSocket closed');
        if (!get().isLogout) {
          get().reconnectWebSocket();
        }
      },
      onDisconnect: () => {
        console.log('연결 해제');
        set((state) => ({ ...state, isConnected: false }));
      },
    });

    client.activate(); // 클라이언트 활성화
    // 클라이언트 정보 저장
    set((state) => ({ ...state, webSocketClient: client }));
  },

  // 재연결 로직
  reconnectWebSocket: async () => {
    set((state) => ({
      ...state,
      reconnectAttempts: state.reconnectAttempts + 1,
    }));
    const { reconnectAttempts, maxReconnectAttempts } = get();
    if (reconnectAttempts < maxReconnectAttempts) {
      try {
        const newAccessToken = await refreshAccessToken();
        get().connectWebSocket(newAccessToken);
      } catch (error) {
        console.error('토큰 갱신 실패', error);
      }
    } else {
      console.error('최대 재연결 시도 횟수 도달. 연결을 포기합니다.');
    }
  },

  // 메시지 전송
  publishMessage: (destination: string, messageBody: any) => {
    set((state) => {
      const { webSocketClient } = state;
      console.log('메시지 전송 ', messageBody, webSocketClient);
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
  subscribe: (
    id: string,
    destination: string,
    callback: (message: StompJs.Message) => void
  ) => {
    set((state) => {
      const { webSocketClient, subscriptions } = state;
      // 클라이언트 정보가 있으면 채널 구독, 콜백 함수로 메시지 수신
      const isExistSubscribe = subscriptions.find((sub) => sub.id === id);
      if (webSocketClient) {
        const subscription = webSocketClient.subscribe(
          destination,
          (message) => {
            callback(message); // 새 메시지 수신 시 콜백 함수 호출
          },
          { id } // 구독 ID 지정
        );

        console.log('새 구독:', subscription);
        // 구독 정보 저장
        if (!isExistSubscribe) {
          return {
            subscriptions: [
              ...subscriptions,
              { id, destination, callback, subscription },
            ],
          };
        }
      }
      return state;
    });
  },

  // 구독 해제
  unsubscribe: (id: string) => {
    set((state) => {
      const { subscriptions } = state;
      const subscription = subscriptions.find((sub) => sub.id === id);
      if (subscription) {
        subscription.subscription?.unsubscribe();
        console.log('구독 해제:', subscription);
        return {
          subscriptions: subscriptions.filter((sub) => sub.id !== id),
        };
      }
      return state;
    });
  },

  // 로그아웃 상태 설정
  setIsLogout: (value: boolean) => {
    set((state) => ({ ...state, isLogout: value }));
  },

  resetWebSocket: () =>
    set({
      webSocketClient: null,
      isConnected: false,
      subscriptions: [],
    }),
}));

export default useWebSocketStore;
