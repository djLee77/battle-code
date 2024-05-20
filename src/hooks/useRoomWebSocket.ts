import { useCallback, useEffect, useState } from 'react';
import useWebSocketStore from 'store/websocket-store';
import { IRoomStatus } from 'types/room-types';
import { removeTab } from 'utils/tabs';
import { handleRoomLeave, handleReady, handleGameStart } from 'handler/room';

interface IUseRoomWebSocket {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<any>;
}

const useRoomWebSocket = (props: IUseRoomWebSocket) => {
  const [roomStatus, setRoomStatus] = useState(props.data.roomStatus);
  const [userStatus, setUserStatus] = useState(props.data.userStatus);
  const [isAllUsersReady, setIsAllUsersReady] = useState<boolean>(false);
  const [isGameStart, setIsGameStart] = useState<boolean>(false);

  const {
    webSocketClient,
    roomSubscribe,
    publishMessage,
    setRoomSubscription,
  } = useWebSocketStore();
  const userId = localStorage.getItem('id');

  /**
   * 웹소켓에서 받은 메시지 핸들링 함수
   */
  const handleMessage = useCallback(
    (message: any) => {
      const receivedMessage = JSON.parse(message.body);
      console.log('Received message:', receivedMessage);

      // 유저 상태 업데이트
      if (receivedMessage.updateUserStatus) {
        setUserStatus((prevUserStatus) =>
          prevUserStatus.map((user) =>
            user.userId === receivedMessage.updateUserStatus.userId
              ? receivedMessage.updateUserStatus
              : user
          )
        );
      }

      // 유저 입장
      if (receivedMessage.enterUserStatus) {
        setUserStatus((prevUserStatus) => [
          ...prevUserStatus,
          receivedMessage.enterUserStatus,
        ]);
      }

      // 유저 퇴장
      if (receivedMessage.leaveUserStatus) {
        const leaveUserStatus = receivedMessage.leaveUserStatus;
        // 방장이 퇴장할시
        if (leaveUserStatus.isHost && leaveUserStatus.userId !== userId) {
          alert('방장이 나갔습니다 ㅠㅠ');
          removeTab(props.dockLayoutRef, `${props.data.roomStatus.roomId}번방`);
          return;
        }
        // 유저가 퇴장할시
        setUserStatus((prevUserStatus) =>
          prevUserStatus.filter(
            (user) => user.userId !== leaveUserStatus.userId
          )
        );
      }

      // 방 설정 변경
      if (receivedMessage.roomStatus) {
        setRoomStatus(receivedMessage.roomStatus);
      }
    },
    [userId, props.data.roomStatus.roomId, props.dockLayoutRef]
  );

  useEffect(() => {
    if (!webSocketClient) return;
    const subscription = webSocketClient.subscribe(
      `/topic/room/${props.data.roomStatus.roomId}`,
      handleMessage
    );

    setRoomSubscription(subscription);
  }, [webSocketClient, handleMessage]);

  useEffect(() => {
    // 호스트 유저를 제외한 모든 유저의 isReady 상태 확인
    const allUsersExceptHost = userStatus.filter(
      (user) => user.userId !== roomStatus.hostId
    );
    // 방에 호스트 혼자면 코드 실행 중지
    if (allUsersExceptHost.length === 0) {
      return;
    }
    const allReady = allUsersExceptHost.every((user) => user.isReady);

    // 모든 유저가 준비 상태인지를 판단하여 상태 업데이트
    setIsAllUsersReady(allReady);
  }, [userStatus]);

  return {
    userId,
    roomStatus,
    userStatus,
    isAllUsersReady,
    isGameStart,
    setIsGameStart,
    publishMessage,
    roomSubscribe,
    handleRoomLeave: useCallback(
      () =>
        handleRoomLeave(
          props.data.roomStatus.roomId,
          props.dockLayoutRef,
          roomSubscribe,
          removeTab
        ),
      [props.data.roomStatus.roomId, props.dockLayoutRef, roomSubscribe]
    ),
    handleReady: useCallback(
      () =>
        handleReady(
          userId,
          userStatus,
          props.data.roomStatus.roomId,
          publishMessage
        ),
      [userId, userStatus, props.data.roomStatus.roomId, publishMessage]
    ),
    handleGameStart: useCallback(
      () => handleGameStart(props.data.roomStatus.roomId, setIsGameStart),
      [props.data.roomStatus.roomId, setIsGameStart]
    ),
  };
};

export default useRoomWebSocket;
