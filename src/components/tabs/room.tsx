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
import useRoomWebSocket from 'hooks/useRoomWebSocket';
import ProgressBarComponent from 'components/progress-bar';

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
        {room.isGameStart ? (
          <div style={{ display: 'flex', width: '100%' }}>
            <h2 className={styles.title}>{room.roomStatus.title}</h2>
            {room.testResults.map((result) => (
              <div key={result.id}>
                {result.id}
                <div>
                  <ProgressBarComponent
                    completed={result.percent}
                    roundedValue={Math.round(result.percent)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <h2 className={styles.title}>{room.roomStatus.title}</h2>
            {room.roomStatus.hostId === room.userId && (
              <ModifyRoomModal data={props.data.roomStatus} />
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
            {room.isGameStart ? (
              room.problems.map((problem) => (
                <div key={problem.id} className={styles.problem}>
                  <h3>{problem.title}</h3>
                  <p>
                    <strong>Algorithm Classification:</strong>{' '}
                    {problem.algorithmClassification}
                  </p>
                  <p>
                    <strong>Level:</strong> {problem.problemLevel}
                  </p>
                  <div className={styles.description}>
                    <h4>Description</h4>
                    <p>{problem.problemDescription}</p>
                  </div>
                  <div className={styles.description}>
                    <h4>Input</h4>
                    <p>{problem.inputDescription}</p>
                  </div>
                  <div className={styles.description}>
                    <h4>Output</h4>
                    <p>{problem.outputDescription}</p>
                  </div>
                  {problem.hint && (
                    <div className={styles.description}>
                      <h4>Hint</h4>
                      <p>{problem.hint}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <span>게임이 시작되면 문제가 표시됩니다!</span>
            )}
          </div>
          <div className={styles.leftFooter}>
            <RoomCustomButton onClick={room.handleRoomLeave}>
              나가기
            </RoomCustomButton>
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.centerBody}>
            {room.isGameStart ? (
              <div className={styles.flexGrow}>
                <CodeEditor
                  className={styles.flexGrow}
                  language={searchMyLanguage(room.userId, room.userStatus)}
                  code={room.code}
                  setCode={room.setCode}
                />
                <RoomSettings roomStatus={room.roomStatus} />
              </div>
            ) : (
              <div className={styles.flexGrow}>
                <UserList
                  userStatus={room.userStatus}
                  publishMessage={room.publishMessage}
                  roomId={props.data.roomStatus.roomId}
                />
                <RoomSettings roomStatus={room.roomStatus} />
              </div>
            )}
          </div>
          <div className={styles.centerFooter}>
            {room.isGameStart ? (
              <RoomCustomButton onClick={room.handleSubmit}>
                제출하기
              </RoomCustomButton>
            ) : (
              <>
                {room.roomStatus.hostId === room.userId ? (
                  <RoomCustomButton
                    // disabled={!isAllUsersReady}
                    onClick={room.handleGameStart}
                  >
                    게임시작
                  </RoomCustomButton>
                ) : (
                  <RoomCustomButton onClick={room.handleReady}>
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
