import axios from 'axios';
import ModifyRoomModal from 'components/room/modify-room';
import UserCard from 'components/room/user-card';
import { useEffect, useState } from 'react';
import useWebSocketStore from 'store/websocket-store';
import styles from 'styles/room.module.css';
import { IRoomStatus, IUserStatus } from 'types/room-types';
import { getAccessToken } from 'utils/cookie';
import { removeTab } from 'utils/tabs';
import CodeEditor from 'components/code-editor';

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
    const accessToken = getAccessToken();
    try {
      const response = await axios.post(
        `${serverUrl}v1/gameRoom/leave/${data.roomStatus.roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
  const handleReady = () => {
    const updateUser = userStatus.filter((user) => user.userId === userId)[0];
    updateUser.isReady = !updateUser.isReady;
    publishMessage(
      `/app/room/${data.roomStatus.roomId}/update/user-status`,
      updateUser
    );
  };

  const handleGameStart = () => {
    setIsGameStart(true);
  };

  const searchMyLanguage = () => {
    const player = userStatus.filter((user) => user.userId === userId)[0];
    return player.language;
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
        <button
          className={styles.button}
          onClick={() => setChatIsHide(!chatIsHide)}
        >
          채팅 On
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles[`test-problem`]}>코딩테스트문제</div>
        {isGameStart ? (
          <div className={styles['room-info']}>
            {/*Todo : lang props 서버에서 받은 user lang으로 받아서*/}
            <CodeEditor language={searchMyLanguage()} />
          </div>
        ) : (
          <div className={styles['room-info']}>
            <div className={styles['user-list']}>
              {userStatus.map((data) => (
                <UserCard
                  key={data.userId}
                  data={data}
                  handleLanguageChange={handleLanguageChange}
                />
              ))}
            </div>
            <div className={styles['room-settings']}>
              <div>
                <p>난이도 : {roomStatus.problemLevel}</p>
                <p>제출 횟수 : {roomStatus.maxSubmitCount}</p>
                <p>언어 설정 : {roomStatus.language}</p>
              </div>
            </div>
          </div>
        )}
        <div
          className={styles[`chat`]}
          style={chatIsHide ? { display: 'none' } : { display: 'block' }}
        >
          <button
            className={styles.button}
            onClick={() => setChatIsHide(!chatIsHide)}
          >
            채팅 Off
          </button>
          채팅창
        </div>
      </div>
      <div className={styles[`button-container`]}>
        <button className={styles.button} onClick={handleRoomLeave}>
          나가기
        </button>
        {roomStatus.hostId === userId ? (
          <button
            className={
              isAllUsersReady ? styles.button : styles[`button-disabled`]
            }
            style={{ marginLeft: '47%' }}
            onClick={isAllUsersReady ? handleGameStart : undefined}
          >
            게임시작
          </button>
        ) : (
          <button
            className={styles.button}
            style={{ marginLeft: '47%' }}
            onClick={handleReady}
          >
            준비완료
          </button>
        )}
        <button onClick={handleGameStart}>임시시작</button>
      </div>
    </div>
  );
}
