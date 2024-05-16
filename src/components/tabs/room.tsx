import api from 'utils/axios';
import Chat from 'components/room/chat';
import ModifyRoomModal from 'components/room/modify-room';
import RoomSettings from 'components/room/room-settings';
import UserList from 'components/room/user-list';
import RoomCustomButton from 'components/ui/room-custom-btn';
import { useEffect, useState } from 'react';
import useWebSocketStore from 'store/websocket-store';
import styles from 'styles/room.module.css';
import { IRoomStatus } from 'types/room-types';
import { removeTab } from 'utils/tabs';
import CodeEditor from 'components/code-editor';
import {
  handleRoomLeave,
  handleReady,
  handleGameStart,
  searchMyLanguage,
} from '../../handler/room';

interface IProps {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default function Room({ data, dockLayoutRef }: IProps) {
  const [chatIsHide, setChatIsHide] = useState<boolean>(false);
  const [roomStatus, setRoomStatus] = useState(data.roomStatus);
  const [userStatus, setUserStatus] = useState(data.userStatus);
  const [isAllUsersReady, setIsAllUsersReady] = useState<boolean>(false);
  const [isGameStart, setIsGameStart] = useState<boolean>(false);

  const {
    webSocketClient,
    roomSubscribe,
    publishMessage,
    setRoomSubscription,
  } = useWebSocketStore();
  const userId = localStorage.getItem('id');

  // 첫 마운트 될 때 방 구독하기
  useEffect(() => {
    if (!webSocketClient) return;
    const subscription = webSocketClient.subscribe(
      `/topic/room/${data.roomStatus.roomId}`,
      (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('Received message:', receivedMessage);
        // 받은 메시지가 업데이트 유저 상태 객체면 바뀐 유저 상태 업데이트
        if (receivedMessage.updateUserStatus) {
          return setUserStatus((prevUserStatus) =>
            prevUserStatus.map((user) =>
              user.userId === receivedMessage.updateUserStatus.userId
                ? receivedMessage.updateUserStatus
                : user
            )
          );
        }

        // 유저 입장 메시지면 상태 변수에 입장한 유저 추가
        if (receivedMessage.enterUserStatus) {
          return setUserStatus((prevUserStatus) => [
            ...prevUserStatus,
            receivedMessage.enterUserStatus,
          ]);
        }

        // 유저 퇴장 메시지면 상태 변수에 퇴장한 유저 삭제
        if (receivedMessage.leaveUserStatus) {
          const leaveUserStatus = receivedMessage.leaveUserStatus;
          // 방장이 나가면 방에 있는 유저들 전부 방에서 퇴장
          if (leaveUserStatus.isHost && leaveUserStatus.userId !== userId) {
            alert('방장이 나갔습니다 ㅠㅠ');
            removeTab(dockLayoutRef, `${data.roomStatus.roomId}번방`);
            return;
          }
          return setUserStatus((prevUserStatus) =>
            prevUserStatus.filter(
              (user) => user.userId !== leaveUserStatus.userId
            )
          );
        }

        // 받은 메시지가 방 상태 객체면 방 상태 업데이트
        if (receivedMessage.roomStatus) {
          return setRoomStatus(receivedMessage.roomStatus);
        }
      }
    );

    setRoomSubscription(subscription);
  }, []);

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

  return (
    <div>
      <div className={styles[`title-box`]}>
        <h2 className={styles.title}>{roomStatus.title}</h2>
        {roomStatus.hostId === userId && <ModifyRoomModal data={roomStatus} />}
      </div>
      <div
        style={
          !chatIsHide
            ? { display: 'none' }
            : { display: 'block', position: 'absolute', right: 10, top: 10 }
        }
      >
        <RoomCustomButton onClick={() => setChatIsHide(!chatIsHide)}>
          채팅 On
        </RoomCustomButton>
      </div>
      <div className={styles.container}>
        <div className={styles[`test-problem`]}>
          {isGameStart ? (
            <div></div>
          ) : (
            <span>게임이 시작되면 문제가 표시됩니다!</span>
          )}
        </div>
        <div className={styles['room-info']}>
          {isGameStart ? (
            <div>
              <CodeEditor language={searchMyLanguage(userId, userStatus)} />
            </div>
          ) : (
            <>
              <UserList
                userStatus={userStatus}
                publishMessage={publishMessage}
                data={data}
              />
              <RoomSettings roomStatus={roomStatus} />
            </>
          )}
        </div>
        <Chat chatIsHide={chatIsHide} setChatIsHide={setChatIsHide} />
      </div>
      <div className={styles[`button-container`]}>
        <RoomCustomButton
          onClick={() =>
            handleRoomLeave(
              data.roomStatus.roomId,
              dockLayoutRef,
              roomSubscribe,
              removeTab
            )
          }
        >
          나가기
        </RoomCustomButton>
        {isGameStart ? (
          <div></div>
        ) : (
          <>
            {roomStatus.hostId === userId ? (
              <RoomCustomButton
                disabled={!isAllUsersReady}
                onClick={() =>
                  handleGameStart(data.roomStatus.roomId, setIsGameStart)
                }
              >
                게임시작
              </RoomCustomButton>
            ) : (
              <RoomCustomButton
                onClick={() =>
                  handleReady(
                    userId,
                    userStatus,
                    data.roomStatus.roomId,
                    publishMessage
                  )
                }
              >
                준비완료
              </RoomCustomButton>
            )}
          </>
        )}
        <button
          onClick={() =>
            handleGameStart(data.roomStatus.roomId, setIsGameStart)
          }
        >
          임시시작
        </button>
      </div>
    </div>
  );
}
