import Chat from 'components/room/chat';
import ModifyRoomModal from 'components/room/modify-room';
import RoomSettings from 'components/room/room-settings';
import UserList from 'components/room/user-list';
import RoomCustomButton from 'components/ui/room-custom-btn';
import { useState } from 'react';
import styles from 'styles/room.module.css';
import { IRoomStatus } from 'types/room-types';
import CodeEditor from 'components/code-editor';
import { handleLanguageChange, searchMyLanguage } from '../../handler/room';
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
      {room.isGameStart ? (
        <div className={styles.titleBox}>
          <h2 className={styles.title}>{room.roomStatus.title}</h2>
          <div className={styles.timerBox}>
            <div>{Math.floor(room.timeLeft / 60)} : </div>
            <div>{room.timeLeft % 60}</div>
          </div>
          <div className={styles.boards}>
            {room.testResults.map((item) => (
              <div key={item.id} className={styles['score-board']}>
                <div>{item.id}</div>
                <div className={styles['percent-box']}>
                  <div style={{ paddingTop: '4px' }}>
                    <ProgressBarComponent
                      completed={item.percent}
                      roundedValue={Math.round(item.percent)}
                      result={item.result}
                    />
                  </div>
                  <div style={{ marginLeft: '5px' }}>
                    {Math.round(item.percent)}%
                    {item.percent === 0
                      ? ''
                      : item.result === 'FAIL'
                      ? '틀렸습니다'
                      : item.result === 'PASS' && item.percent === 100
                      ? '맞았습니다'
                      : '채점중'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h1 className={styles.title}>{room.roomStatus.title}</h1>
          {room.roomStatus.hostId === room.userId && (
            <ModifyRoomModal data={props.data.roomStatus} />
          )}
        </>
      )}
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
              </div>
            ) : (
              <div className={styles.flexGrow}>
                <UserList
                  userStatus={room.userStatus}
                  publishMessage={room.publishMessage}
                  data={props.data}
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
        <div>
          {!chatIsHide ? (
            <div className={styles.rightSide}>
              <div className={styles.rightBody}>
                <Chat chatIsHide={chatIsHide} setChatIsHide={setChatIsHide} />
              </div>
              <div className={styles.rightFooter}>입력창</div>
            </div>
          ) : (
            <div className={styles.hideRight}>
              <p style={{ cursor: 'pointer' }}>
                <span
                  onClick={() => setChatIsHide(false)}
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
    </div>
  );
};

export default Room;
