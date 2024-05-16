import Chat from 'components/room/chat';
import ModifyRoomModal from 'components/room/modify-room';
import RoomSettings from 'components/room/room-settings';
import UserList from 'components/room/user-list';
import RoomCustomButton from 'components/ui/room-custom-btn';
import { useState } from 'react';
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
import useRoomWebSocket from 'hooks/useRoomWebSocket';

interface IProps {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}
export default function Room(props: IProps) {
  const [chatIsHide, setChatIsHide] = useState<boolean>(false);

  const room = useRoomWebSocket({
    data: props.data,
    dockLayoutRef: props.dockLayoutRef,
  });

  return (
    <div>
      <div className={styles[`title-box`]}>
        <h2 className={styles.title}>{room.roomStatus.title}</h2>
        {room.roomStatus.hostId === room.userId && (
          <ModifyRoomModal data={room.roomStatus} />
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
          {room.isGameStart ? (
            <div></div>
          ) : (
            <span>게임이 시작되면 문제가 표시됩니다!</span>
          )}
        </div>
        <div className={styles['room-info']}>
          {room.isGameStart ? (
            <div>
              <CodeEditor
                language={searchMyLanguage(room.userId, room.userStatus)}
              />
            </div>
          ) : (
            <>
              <UserList
                userStatus={room.userStatus}
                publishMessage={room.publishMessage}
                data={props.data}
              />
              <RoomSettings roomStatus={room.roomStatus} />
            </>
          )}
        </div>
        <Chat chatIsHide={chatIsHide} setChatIsHide={setChatIsHide} />
      </div>
      <div className={styles[`button-container`]}>
        <RoomCustomButton
          onClick={() =>
            handleRoomLeave(
              props.data.roomStatus.roomId,
              props.dockLayoutRef,
              room.roomSubscribe,
              removeTab
            )
          }
        >
          나가기
        </RoomCustomButton>
        {room.isGameStart ? (
          <div></div>
        ) : (
          <>
            {room.roomStatus.hostId === room.userId ? (
              <RoomCustomButton
                disabled={!room.isAllUsersReady}
                onClick={() =>
                  handleGameStart(
                    props.data.roomStatus.roomId,
                    room.setIsGameStart
                  )
                }
              >
                게임시작
              </RoomCustomButton>
            ) : (
              <RoomCustomButton
                onClick={() =>
                  handleReady(
                    room.userId,
                    room.userStatus,
                    props.data.roomStatus.roomId,
                    room.publishMessage
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
            handleGameStart(props.data.roomStatus.roomId, room.setIsGameStart)
          }
        >
          임시시작
        </button>
      </div>
    </div>
  );
}
