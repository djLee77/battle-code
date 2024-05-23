import Chat from 'components/room/chat';
import ModifyRoomModal from 'components/room/modify-room';
import RoomSettings from 'components/room/room-settings';
import UserList from 'components/room/user-list';
import RoomCustomButton from 'components/ui/room-custom-btn';
import { useState } from 'react';
import styles from 'styles/room.module.css';
import { IRoomStatus } from 'types/room-types';
import CodeEditor from 'components/code-editor';
import { searchMyLanguage } from '../../handler/room';
import DockLayout from 'rc-dock';
import ProgressBar from '@ramonak/react-progress-bar';

interface IProps {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<DockLayout>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}
const Room = (props: IProps) => {
  const [chatIsHide, setChatIsHide] = useState<boolean>(false);

  const room = useRoomWebSocket({
    data: props.data,
    dockLayoutRef: props.dockLayoutRef,
  });

  return (
    <div>
      <div className={styles.titleBox}>
        {isGameStart ? (
          <>
            <h2 className={styles.title}>{roomStatus.title}</h2>
            <ProgressBar
              completed={50}
              bgColor="#F4A261"
              height="20px"
              isLabelVisible={false}
            />
          </>
        ) : (
          <>
            <h2 className={styles.title}>{roomStatus.title}</h2>
            {roomStatus.hostId === userId && (
              <ModifyRoomModal data={data.roomStatus} />
            )}
          </>
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
        <div className={styles.leftSide}>
          <div className={styles.leftBody}>
            {isGameStart ? (
              <div></div>
            ) : (
              <span>게임이 시작되면 문제가 표시됩니다!</span>
            )}
          </div>
          <div className={styles.leftFooter}>
            <RoomCustomButton onClick={handleRoomLeave}>
              나가기
            </RoomCustomButton>
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.centerBody}>
            {isGameStart ? (
              <div className={styles.flexGrow}>
                <CodeEditor
                  className={styles.flexGrow}
                  language={searchMyLanguage()}
                  code={code}
                  setCode={setCode}
                />
                <RoomSettings roomStatus={roomStatus} />
              </div>
            ) : (
              <div className={styles.flexGrow}>
                <UserList
                  className={styles.flexGrow}
                  userStatus={userStatus}
                  handleLanguageChange={handleLanguageChange}
                />
                <RoomSettings roomStatus={roomStatus} />
              </div>
            )}
          </div>
          <div className={styles.centerFooter}>
            {isGameStart ? (
              <RoomCustomButton onClick={handleSubmit}>
                제출하기
              </RoomCustomButton>
            ) : (
              <>
                {roomStatus.hostId === userId ? (
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
              </>
            )}
          </div>
        </div>
        <Chat chatIsHide={chatIsHide} setChatIsHide={setChatIsHide} />
      </div>
    </div>
  );
};

export default Room;
