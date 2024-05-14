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
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const userId = localStorage.getItem('id');

  // 방 나가기 함수
  const handleRoomLeave = async () => {
    try {
      const response = await api.post(
        `v1/gameRoom/leave/${data.roomStatus.roomId}`,
        {}
      );
      console.log(response);
      removeTab(dockLayoutRef, `${data.roomStatus.roomId}번방`);
      if (roomSubscribe.subscription) {
        roomSubscribe.subscription.unsubscribe(); // 구독 취소
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 사용자 언어 업데이트 함수
  const handleLanguageChange = (userId: string, newLanguage: string) => {
    const updateUser = userStatus.filter((user) => user.userId === userId)[0];
    updateUser.language = newLanguage;
    publishMessage(
      `/app/room/${data.roomStatus.roomId}/update/user-status`,
      updateUser
    );
  };

  // 준비 버튼 누르면 누른 유저의 정보 소켓으로 전송
  /**
   * 이 함수는 room 컴포넌트 전용 함수입니다.
   *
   */
  const handleReady = () => {
    console.log(userStatus);
    const updateUser = userStatus.filter((user) => user.userId === userId)[0];
    updateUser.isReady = !updateUser.isReady;
    publishMessage(
      `/app/room/${data.roomStatus.roomId}/update/user-status`,
      updateUser
    );
  };

  const handleGameStart = async () => {
    try {
      const response = await api.post(`${serverUrl}v1/game/start`, {
        roomId: data.roomStatus.roomId,
      });

      response.status === 201 && setIsGameStart(true);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

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
    console.log(allReady);

    // 모든 유저가 준비 상태인지를 판단하여 상태 업데이트
    setIsAllUsersReady(allReady);
  }, [userStatus]);

  return (
    <div>
      <div className={styles[`title-box`]}>
        <h2 className={styles.title}>{roomStatus.title}</h2>
        {roomStatus.hostId === userId && (
          <ModifyRoomModal data={data.roomStatus} />
        )}
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
            <div></div>
          ) : (
            <>
              <UserList
                userStatus={userStatus}
                handleLanguageChange={handleLanguageChange}
              />
              <RoomSettings roomStatus={roomStatus} />
            </>
          )}
        </div>
        <Chat chatIsHide={chatIsHide} setChatIsHide={setChatIsHide} />
      </div>
      <div className={styles[`button-container`]}>
        <RoomCustomButton onClick={handleRoomLeave}>나가기</RoomCustomButton>
        {isGameStart ? (
          <div></div>
        ) : (
          <>
            {roomStatus.hostId === userId ? (
              <RoomCustomButton
                disabled={!isAllUsersReady}
                onClick={handleGameStart}
              >
                게임시작
              </RoomCustomButton>
            ) : (
              <RoomCustomButton onClick={handleReady}>
                준비완료
              </RoomCustomButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
