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

interface IProps {
  userId: string | null;
  userStatus: IUserStatus[];
  roomStatus: any;
  dockLayoutRef: React.RefObject<DockLayout>;
  setIsGameStart: (isGameStart: boolean) => void;
  setRoomStatus: (roomStatus: any) => void;
  setUserStatus: (
    updateFunction: (prevUserStatuses: IUserStatus[]) => IUserStatus[]
  ) => void;
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

  useEffect(() => {
    // 호스트 유저를 제외한 모든 유저의 isReady 상태 확인
    const allUsersExceptHost = props.userStatus.filter(
      (user: IUserStatus) => user.userId !== props.roomStatus.hostId
    );
    // 방에 호스트 혼자면 코드 실행 중지
    if (allUsersExceptHost.length === 0) {
      return;
    }
    const allReady = allUsersExceptHost.every(
      (user: IUserStatus) => user.isReady
    );

    // 모든 유저가 준비 상태인지를 판단하여 상태 업데이트
    setIsAllUsersReady(allReady);
  }, [props.userStatus]);

  useEffect(() => {
    const handleMessages = (msg: any) => {
      console.log('대기방 : ', msg);
      // 유저 상태 업데이트
      if (msg.updateUserStatus) {
        props.setUserStatus((prev: any) =>
          prev.map((user: any) =>
            user.userId === msg.updateUserStatus.userId
              ? msg.updateUserStatus
              : user
          )
        );
      }

      //유저 입장
      if (msg.enterUserStatus) {
        props.setUserStatus((prevUserStatus) => [
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
          removeTab(props.dockLayoutRef, `${props.roomStatus.roomId}번방`);
          return;
        }
        // 유저가 퇴장할시
        props.setUserStatus((prevUserStatus: IUserStatus[]) =>
          prevUserStatus.filter(
            (user) => user.userId !== leaveUserStatus.userId
          )
        );
      }

      // 방 설정 변경
      if (msg.roomStatus) {
        props.setRoomStatus(msg.roomStatus);
      }

      // 게임 시작
      if (msg.startMessage) {
        props.setIsGameStart(true);
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
        `v1/rooms/${props.roomStatus.roomId}/leave`,
        {}
      );
      console.log(response);
      removeTab(props.dockLayoutRef, `${props.roomStatus.roomId}번방`);
      unsubscribe('room');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message);
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  }, [props.roomStatus.roomId, props.dockLayoutRef, unsubscribe]);

  const handleReady = useCallback((): void => {
    const updateUser = props.userStatus.find(
      (user) => user.userId === props.userId
    );
    if (updateUser) {
      updateUser.isReady = !updateUser.isReady;
      publishMessage(
        `/app/rooms/${props.roomStatus.roomId}/update/user-status`,
        updateUser
      );
    }
  }, [props.userStatus, props.userId, props.roomStatus.roomId]);

  const handleGameStart = useCallback(async (): Promise<void> => {
    try {
      const response: AxiosResponse = await api.post(
        `v1/rooms/${props.roomStatus.roomId}/start`,
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
  }, [props.roomStatus.roomId, props.setIsGameStart]);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <h1 className={styles.title}>{props.roomStatus.title}</h1>
        </div>
        <div style={{ margin: '20px 0px 0px 0px' }}>
          {props.roomStatus.hostId === props.userId && (
            <ModifyRoomModal data={props.roomStatus} />
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
              <UserList
                userStatus={props.userStatus}
                roomId={props.roomStatus.roomId}
              />
              <RoomSettings roomStatus={props.roomStatus} />
            </div>
          </div>
          <div className={styles.centerFooter}>
            {props.roomStatus.hostId === props.userId ? (
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
        {!isRightSideHide ? (
          <div className={styles.rightSide}>
            <div className={styles.rightBody}>
              <Chat
                isRightSideHide={isRightSideHide}
                setIsRightSideHide={setIsRightSideHide}
                messages={messages}
                roomId={props.roomStatus.roomId}
              />
            </div>
            <div className={styles.rightFooter}>
              <ChatInput roomId={props.roomStatus.roomId} />
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
