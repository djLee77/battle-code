import { useEffect, useState } from 'react';
import { IRoom, IUserStatus } from 'types/roomType';
import DockLayout from 'rc-dock';
import InGameRoom from 'components/room/InGameRoom';
import WaitingRoom from 'components/room/WaitingRoom';
import useWebSocketStore from 'store/useWebSocketStore';
import emitter from 'utils/eventEmitter';
import useRoomStore from 'store/useRoomStore';

interface IProps {
  dockLayoutRef: React.RefObject<DockLayout>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

const Room = (props: IProps) => {
  const { isConnected, subscribe } = useWebSocketStore();
  const { isGameStart, roomStatus } = useRoomStore();
  const userId = localStorage.getItem('id');

  // 새로고침을 막는 함수
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ''; // 이 코드는 Chrome에서 새로고침 경고를 활성화하는 데 필요
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 beforeunload 이벤트 리스너 추가
    window.addEventListener('beforeunload', preventClose);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('beforeunload', preventClose);
    };
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    const destination = `/topic/rooms/${roomStatus?.roomId}`;

    subscribe('room', destination, (message: any) => {
      const receivedMessage = JSON.parse(message.body);
      emitter.emit('message', receivedMessage);
    });
  }, [isConnected, roomStatus?.roomId]);

  return isGameStart ? (
    <InGameRoom userId={userId} dockLayoutRef={props.dockLayoutRef} />
  ) : (
    <WaitingRoom userId={userId} dockLayoutRef={props.dockLayoutRef} />
  );
};

export default Room;
