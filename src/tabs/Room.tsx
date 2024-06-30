import { useEffect, useState } from 'react';
import { IRoomStatus } from 'types/roomType';
import DockLayout from 'rc-dock';
import InGameRoom from 'components/room/InGameRoom';
import WaitingRoom from 'components/room/WaitingRoom';
import useWebSocketStore from 'store/useWebSocketStore';
import emitter from 'utils/eventEmitter';

interface IProps {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<DockLayout>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

const Room = (props: IProps) => {
  const [isGameStart, setIsGameStart] = useState<boolean>(false); // 게임 시작 여부
  const [roomStatus, setRoomStatus] = useState(props.data.roomStatus); // 방 상태
  const [userStatus, setUserStatus] = useState(props.data.userStatus); // 유저들 상태
  const { webSocketClient, setRoomSubscription } = useWebSocketStore();
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
    if (!webSocketClient) return;

    const subscription = webSocketClient.subscribe(
      `/topic/rooms/${props.data.roomStatus.roomId}`,
      (message: any) => {
        const receivedMessage = JSON.parse(message.body);
        emitter.emit('message', receivedMessage);
      }
    );

    setRoomSubscription(subscription);
  }, [webSocketClient, props.data.roomStatus.roomId, setRoomSubscription]);

  return isGameStart ? (
    <InGameRoom
      userId={userId}
      dockLayoutRef={props.dockLayoutRef}
      roomStatus={roomStatus}
      userStatus={userStatus}
      setIsGameStart={setIsGameStart}
      setUserStatus={setUserStatus}
    />
  ) : (
    <WaitingRoom
      userStatus={userStatus}
      roomStatus={roomStatus}
      dockLayoutRef={props.dockLayoutRef}
      userId={userId}
      setRoomStatus={setRoomStatus}
      setIsGameStart={setIsGameStart}
      setUserStatus={setUserStatus}
    />
  );
};

export default Room;
