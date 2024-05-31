import { useCallback, useEffect, useState } from 'react';
import { IRoomStatus, IUserStatus } from 'types/roomType';
import DockLayout from 'rc-dock';
import InGameRoom from 'components/ingame-room/InGameRoom';
import WaitingRoom from 'components/waiting-room/WaitingRoom';
import useWebSocketStore from 'store/useWebSocketStore';

interface IProps {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<DockLayout>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}
const RoomCopy = (props: IProps) => {
  const [isGameStart, setIsGameStart] = useState<boolean>(false); // 게임 시작 여부
  const [chatIsHide, setChatIsHide] = useState<boolean>(false); // 채팅 표시 여부
  const [roomStatus, setRoomStatus] = useState(props.data.roomStatus); // 방 상태
  const [userStatus, setUserStatus] = useState(props.data.userStatus); // 유저들 상태
  const [message, setMessage] = useState(null);
  const { webSocketClient, setRoomSubscription } = useWebSocketStore();
  const userId = localStorage.getItem('id');

  useEffect(() => {
    if (!webSocketClient) return;

    const subscription = webSocketClient.subscribe(
      `/topic/room/${props.data.roomStatus.roomId}`,
      (message: any) => {
        const receivedMessage = JSON.parse(message.body);
        console.log(receivedMessage);
        setMessage(receivedMessage);
      }
    );

    setRoomSubscription(subscription);
  }, [webSocketClient, props.data.roomStatus.roomId, setRoomSubscription]);

  return isGameStart ? (
    <InGameRoom
      setIsGameStart={setIsGameStart}
      message={message}
      userId={userId}
      roomstatus={roomStatus}
      userStatus={userStatus}
      chatIsHide={chatIsHide}
      setChatIsHide={setChatIsHide}
    />
  ) : (
    <WaitingRoom
      userStatus={userStatus}
      message={message}
      roomStatus={roomStatus}
      chatIsHide={chatIsHide}
      dockLayoutRef={props.dockLayoutRef}
      userId={userId}
      setRoomStatus={setRoomStatus}
      setIsGameStart={setIsGameStart}
      setChatIsHide={setChatIsHide}
      setUserStatus={setUserStatus}
    />
  );
};

export default RoomCopy;
