import { AxiosResponse } from 'axios';
import Chat from 'components/room/Chat';
import ModifyRoomModal from 'components/room/ModifyRoomModal';
import RoomSettings from 'components/room/RoomSettings';
import UserList from 'components/room/UserList';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import DockLayout from 'rc-dock';
import { useEffect, useState } from 'react';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room.module.css';
import { IUserStatus } from 'types/roomType';
import api from 'utils/axios';
import { removeTab } from 'utils/tabs';

interface IProps {
  userId: string | null;
  userStatus: IUserStatus[];
  message: any;
  roomStatus: any;
  chatIsHide: boolean;
  dockLayoutRef: React.RefObject<DockLayout>;
  setIsGameStart: (isGameStart: boolean) => void;
  setRoomStatus: (roomStatus: any) => void;
  setUserStatus: (
    updateFunction: (prevUserStatuses: IUserStatus[]) => IUserStatus[]
  ) => void;
  setChatIsHide: (isHide: boolean) => void;
}

const WaitingRoom = (props: IProps) => {
  const [isAllUsersReady, setIsAllUsersReady] = useState<boolean>(false); // 모든 유저 준비 여부

  const { publishMessage, roomSubscribe } = useWebSocketStore();

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
    console.log('대기방 메세지 : ', props.message);
    if (props.message) {
      if (props.message.updateUserStatus) {
        props.setUserStatus((prev: any) =>
          prev.map((user: any) =>
            user.userId === props.message.updateUserStatus.userId
              ? props.message.updateUserStatus
              : user
          )
        );
      }

      if (props.message.enterUserStatus) {
        console.log('유저 입장');
        props.setUserStatus((prevUserStatus) => [
          ...prevUserStatus,
          props.message.enterUserStatus,
        ]);
      }

      // 유저 퇴장
      if (props.message.leaveUserStatus) {
        const leaveUserStatus = props.message.leaveUserStatus;
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
      if (props.message.roomStatus) {
        props.setRoomStatus(props.message.roomStatus);
      }
    }
  }, [props.message]);

  const handleRoomLeave = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await api.post(
        `v1/room/leave/${props.roomStatus.roomId}`,
        {}
      );
      console.log(response);
      removeTab(props.dockLayoutRef, `${props.roomStatus.roomId}번방`);
      if (roomSubscribe.subscription) {
        console.log(roomSubscribe);
        roomSubscribe.subscription.unsubscribe();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  };

  const handleReady = (): void => {
    const updateUser = props.userStatus.find(
      (user) => user.userId === props.userId
    );
    if (updateUser) {
      updateUser.isReady = !updateUser.isReady;
      publishMessage(
        `/app/room/${props.roomStatus.roomId}/update/user-status`,
        updateUser
      );
    }
  };

  const handleGameStart = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await api.post(
        `v1/game/${props.roomStatus.roomId}/start`,
        {}
      );
      props.setIsGameStart(true);
      console.log(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  };
  return (
    <div>
      <>
        <h1 className={styles.title}>{props.roomStatus.title}</h1>
        {props.roomStatus.hostId === props.userId && (
          <ModifyRoomModal data={props.roomStatus} />
        )}
      </>
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
        {!props.chatIsHide ? (
          <div className={styles.rightSide}>
            <div className={styles.rightBody}>
              <Chat
                chatIsHide={props.chatIsHide}
                setChatIsHide={props.setChatIsHide}
              />
            </div>
            <div className={styles.rightFooter}>입력창</div>
          </div>
        ) : (
          <div className={styles.hideRight}>
            <p style={{ cursor: 'pointer' }}>
              <span
                onClick={() => props.setChatIsHide(false)}
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
