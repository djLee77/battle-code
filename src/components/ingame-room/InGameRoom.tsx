import ProgressBarComponent from 'components/ProgressBar';
import Chat from 'components/room/Chat';
import GameResultModal from 'components/room/GameResultModal';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import styles from 'styles/room.module.css';

const InGameRoom = (props: any) => {
  return (
    <div>
      <div className={styles.titleBox}>
        <h2 className={styles.title}>{props.roomStatus.title}</h2>
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
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.leftBody}>
            {room.problems.map((problem) => (
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
            ))}
          </div>
          <div className={styles.leftFooter}>
            <RoomCustomButton onClick={room.handleRoomLeave}>
              나가기
            </RoomCustomButton>
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.centerBody}>
            <div className={styles.flexGrow}>
              <CodeEditor
                className={styles.flexGrow}
                language={searchMyLanguage(props.userId, props.userStatus)}
                code={room.code}
                setCode={room.setCode}
              />
            </div>
          </div>
          <div className={styles.centerFooter}>
            <>
              <RoomCustomButton onClick={room.handleSubmit}>
                제출하기
              </RoomCustomButton>
              <RoomCustomButton onClick={() => {}}>항복</RoomCustomButton>
            </>
          </div>
        </div>
        <div>
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
      <GameResultModal
        winner={room.winner}
        winnerCode={room.winnerCode}
        open={room.isGameEnd}
        setOpen={room.setIsGameEnd}
        setIsGameStart={room.setIsGameStart}
      />
    </div>
  );
};

export default InGameRoom;
