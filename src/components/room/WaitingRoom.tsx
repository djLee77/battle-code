import { AxiosResponse } from 'axios';
import Chat from 'components/room/chat/Chat';
import ModifyRoomModal from 'components/room/waiting-room/ModifyRoomModal';
import RoomSettings from 'components/room/waiting-room/RoomSettings';
import UserList from 'components/room/waiting-room/UserList';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import DockLayout from 'rc-dock';
import { useCallback, useEffect, useState } from 'react';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room/room.module.css';
import { IUserStatus } from 'types/roomType';
import api from 'utils/axios';
import emitter from 'utils/eventEmitter';
import { removeTab } from 'utils/tabs';
import ChatInput from './chat/ChatInput';
import useRoomStore from 'store/useRoomStore';

interface IProps {
  userId: string | null;
  dockLayoutRef: React.RefObject<DockLayout>;
}

interface IMessages {
  messageType: string;
  senderId: string;
  message: string;
  sendTime: string;
}

const WaitingRoom = (props: IProps) => {
  const [isAllUsersReady, setIsAllUsersReady] = useState<boolean>(false); // 모든 유저 준비 여부
  const [isRightSideHide, setIsRightSideHide] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessages[]>([]);
  const { publishMessage, unsubscribe } = useWebSocketStore();
  const {
    roomStatus,
    userStatus,
    setUserStatus,
    setIsGameStart,
    setRoomStatus,
    resetState,
  } = useRoomStore();

  useEffect(() => {
    // 호스트 유저를 제외한 모든 유저의 isReady 상태 확인
    const allUsersExceptHost = userStatus?.filter(
      (user: IUserStatus) => user.userId !== roomStatus?.hostId
    );
    // 방에 호스트 혼자면 코드 실행 중지
    if (allUsersExceptHost?.length === 0) {
      return;
    }
    const allReady = allUsersExceptHost!.every(
      (user: IUserStatus) => user.isReady
    );

    // 모든 유저가 준비 상태인지를 판단하여 상태 업데이트
    setIsAllUsersReady(allReady);
  }, [userStatus]);

  useEffect(() => {
    const handleMessages = (msg: any) => {
      console.log('대기방 : ', msg);
      // 유저 상태 업데이트
      if (msg.updateUserStatus) {
        setUserStatus((prev: IUserStatus[]) =>
          prev.map((user: any) =>
            user.userId === msg.updateUserStatus.userId
              ? msg.updateUserStatus
              : user
          )
        );
      }

      //유저 입장
      if (msg.enterUserStatus) {
        setUserStatus((prevUserStatus: any) => [
          ...prevUserStatus,
          msg.enterUserStatus,
        ]);
      }

      // 유저 퇴장
      if (msg.leaveUserStatus) {
        const leaveUserStatus = msg.leaveUserStatus;
        // 방장이 퇴장할시
        if (leaveUserStatus.isHost && leaveUserStatus.userId !== props.userId) {
          alert('방장이 나갔습니다 ㅠㅠ');
          removeTab(props.dockLayoutRef, `${roomStatus?.roomId}번방`);
          return;
        }
        // 유저가 퇴장할시
        setUserStatus((prevUserStatus: IUserStatus[]) =>
          prevUserStatus.filter(
            (user) => user.userId !== leaveUserStatus.userId
          )
        );
      }

      // 방 설정 변경
      if (msg.roomStatus) {
        setRoomStatus(msg.roomStatus);
      }

      // 게임 시작
      if (msg.startMessage) {
        setIsGameStart(true);
      }

      // 채팅
      if (msg.message) {
        setMessages((prevMessages: IMessages[]) => [
          ...prevMessages,
          msg.message,
        ]);
      }
    };

    emitter.on('message', handleMessages);

    // Cleanup 함수를 사용하여 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      emitter.off('message', handleMessages);
    };
  }, []);

  const handleRoomLeave = useCallback(async (): Promise<void> => {
    try {
      const response: AxiosResponse = await api.post(
        `v1/rooms/${roomStatus?.roomId}/leave`,
        {}
      );
      console.log(response);
      removeTab(props.dockLayoutRef, `${roomStatus?.roomId}번방`);
      resetState();
      unsubscribe('room');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message);
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  }, [roomStatus?.roomId, props.dockLayoutRef, unsubscribe]);

  const handleReady = useCallback((): void => {
    const updateUser = userStatus.find(
      (user: any) => user.userId === props.userId
    );
    if (updateUser) {
      updateUser.isReady = !updateUser.isReady;
      publishMessage(
        `/app/rooms/${roomStatus?.roomId}/update/user-status`,
        updateUser
      );
    }
  }, [userStatus, props.userId, roomStatus?.roomId]);

  const handleGameStart = useCallback(async (): Promise<void> => {
    try {
      const response: AxiosResponse = await api.post(
        `v1/rooms/${roomStatus?.roomId}/start`,
        {}
      );
      console.log(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message);
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  }, [roomStatus?.roomId, setIsGameStart]);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <h1 className={styles.title}>{roomStatus?.title}</h1>
        </div>
        <div style={{ margin: '20px 0px 0px 0px' }}>
          {roomStatus?.hostId === props.userId && (
            <ModifyRoomModal data={roomStatus} />
          )}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.leftBody}>
            <span>게임이 시작되면 문제가 표시됩니다!</span>
          </div>
          <div className={styles.leftFooter}>
            <RoomCustomButton onClick={handleRoomLeave}>
              나가기
            </RoomCustomButton>
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.centerBody}>
            <div className={styles.flexGrow}>
              {roomStatus && (
                <>
                  <UserList
                    userStatus={userStatus}
                    roomId={roomStatus.roomId}
                  />
                  <RoomSettings roomStatus={roomStatus} />
                </>
              )}
            </div>
          </div>
          <div className={styles.centerFooter}>
            {roomStatus?.hostId === props.userId ? (
              <RoomCustomButton
                // disabled={!isAllUsersReady}
                onClick={handleGameStart}
                bgColor="#108ee9"
              >
                게임시작
              </RoomCustomButton>
            ) : (
              <RoomCustomButton onClick={handleReady}>
                준비완료
              </RoomCustomButton>
            )}
          </div>
        </div>
        {!isRightSideHide && roomStatus ? (
          <div className={styles.rightSide}>
            <div className={styles.rightBody}>
              <Chat
                isRightSideHide={isRightSideHide}
                setIsRightSideHide={setIsRightSideHide}
                messages={messages}
                roomId={roomStatus.roomId}
              />
            </div>
            <div className={styles.rightFooter}>
              <ChatInput roomId={roomStatus.roomId} />
            </div>
          </div>
        ) : (
          <div className={styles.hideRight}>
            <p style={{ cursor: 'pointer' }}>
              <span
                onClick={() => setIsRightSideHide(false)}
                role="img"
                aria-label="arrow-open"
              >
                ◀
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
