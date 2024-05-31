import { AxiosResponse } from 'axios';
import CodeEditor from 'components/CodeEditor';
import ProgressBarComponent from 'components/ProgressBar';
import Chat from 'components/room/Chat';
import GameResultModal from 'components/room/GameResultModal';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import DockLayout from 'rc-dock';
import { useCallback, useEffect, useState } from 'react';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room.module.css';
import { IUserStatus } from 'types/roomType';
import api from 'utils/axios';
import { removeTab } from 'utils/tabs';
import Problem from './Problem';

interface IProblem {
  id: number;
  title: string;
  algorithmClassification: string;
  problemLevel: string;
  problemDescription: string;
  inputDescription: string;
  outputDescription: string;
  hint: string;
}

interface IProps {
  userId: string | null;
  userStatus: IUserStatus[];
  message: any;
  roomStatus: any;
  chatIsHide: boolean;
  problems: IProblem[];
  dockLayoutRef: React.RefObject<DockLayout>;
  setIsGameStart: (isGameStart: boolean) => void;
  setChatIsHide: (isHide: boolean) => void;
  setProblems: (problems: IProblem[]) => void;
}

interface ITestResults {
  id: string;
  percent: number;
  result: string;
}

interface ISurrenders {
  id: string;
  isSurrender: boolean;
}

interface IisSuccess {
  id: string;
  isSuccess: boolean;
}

const InGameRoom = (props: IProps) => {
  const [testResults, setTestResults] = useState<ITestResults[]>([]); // 테스트케이스 결과 퍼센트
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  ); // 작성 코드
  const [surrenders, setSurrenders] = useState<ISurrenders[]>([]); // 항복 여부
  const [isSuccess, setIsSuccess] = useState<IisSuccess[]>([]);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false); // 게임 종료 여부
  const [winner, setWinner] = useState<string>(''); // 승자 ID
  const [winnerCode, setWinnerCode] = useState<string>(''); // 승자 코드
  const [timeLeft, setTimeLeft] = useState(15); // TODO : 하위 컴포넌트로 빼기

  // const timerId = setInterval(() => {
  //   setTimeLeft((prevTime) => {
  //     if (prevTime <= 1) {
  //       clearInterval(timerId);
  //       handleGameEnd(props.roomStatus.roomId);
  //       return 0;
  //     }
  //     return prevTime - 1;
  //   });
  // }, 1000);

  const { roomSubscribe } = useWebSocketStore();

  useEffect(() => {
    props.userStatus.map((user) => {
      setTestResults((prevResult: any) => [
        ...prevResult,
        {
          id: user.userId,
          percent: 0,
          result: 'PASS',
        },
      ]);
      setSurrenders((prevSurrender: any) => [
        ...prevSurrender,
        {
          id: user.userId,
          isSurrender: false,
        },
      ]);
      setIsSuccess((prevSuccess: any) => [
        ...prevSuccess,
        {
          id: user.userId,
          isSuccess: false,
        },
      ]);
    });
  }, []);

  useEffect(() => {
    console.log('인게임방 메세지 : ', props.message);
    if (props.message) {
      // 게임 시작
      if (props.message.gameStartInfo) {
        props.setProblems(props.message.gameStartInfo);
      }

      //테스트 케이스 통과율
      if (props.message.judgeResult) {
        const { userId, currentTest, totalTests, result } =
          props.message.judgeResult;
        const percent = (currentTest / totalTests) * 100;
        setTestResults((prevResults) =>
          prevResults.map((item) =>
            item.id === userId
              ? {
                  id: userId,
                  percent: percent,
                  result: result,
                }
              : item
          )
        );
        if (percent === 100 && result === 'PASS') {
          setIsSuccess((prev: any) =>
            prev.map((user: any) =>
              user.id === userId ? { id: userId, isSuccess: true } : user
            )
          );
        }
      }

      // 유저 퇴장
      if (props.message.leaveUserStatus) {
        const leaveUserStatus = props.message.leaveUserStatus;
        console.log('유저 퇴장!');
        setTestResults((prevTestResults: any) =>
          prevTestResults.filter(
            (user: any) => user.id !== leaveUserStatus.userId
          )
        );
      }

      // 게임 결과
      if (props.message.gameEnd) {
        setWinner(props.message.gameEnd.userId);
        setWinnerCode(props.message.gameEnd.code);
        setIsGameEnd(true);
      }
    }
  }, [props.message]);

  const searchMyLanguage = () => {
    const player = props.userStatus.find(
      (user) => user.userId === props.userId
    );
    return player ? player.language : '';
  };

  const handleSubmit = useCallback(() => {
    setTestResults((prevResults: any) =>
      prevResults.map((result: any) =>
        result.id === props.userId
          ? {
              id: props.userId,
              percent: 0,
            }
          : result
      )
    );

    api.post(`v1/judge`, {
      problemId: props.problems[0].id,
      roomId: props.roomStatus.roomId,
      userId: props.userId,
      language: searchMyLanguage(),
      code: code,
    });
  }, [props.userId, props.roomStatus.roomId, props.problems, code]);

  const handleGameEnd = async (roomId: number): Promise<void> => {
    try {
      const response: AxiosResponse = await api.post(
        `v1/game/${roomId}/end`,
        {}
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  };

  const handleRoomLeave = useCallback(async (): Promise<void> => {
    try {
      const response = await api.post(
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
  }, [
    props.roomStatus.roomId,
    props.dockLayoutRef,
    roomSubscribe.subscription,
  ]);

  return (
    <div>
      <div className={styles.titleBox}>
        <h2 className={styles.title}>{props.roomStatus.title}</h2>
        <div className={styles.timerBox}>
          <div>{Math.floor(timeLeft / 60)} : </div>
          <div>{timeLeft % 60}</div>
        </div>
        <div className={styles.boards}>
          {testResults.map((item) => (
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
            {props.problems.map((problem) => (
              <Problem key={problem.id} problem={problem} />
            ))}
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
              <CodeEditor
                className={styles.flexGrow}
                language={searchMyLanguage()}
                code={code}
                setCode={setCode}
              />
            </div>
          </div>
          <div className={styles.centerFooter}>
            <>
              <RoomCustomButton onClick={handleSubmit}>
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
        winner={winner}
        winnerCode={winnerCode}
        open={isGameEnd}
        setOpen={setIsGameEnd}
        setIsGameStart={props.setIsGameStart}
      />
    </div>
  );
};

export default InGameRoom;
