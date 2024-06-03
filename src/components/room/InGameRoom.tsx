import { AxiosResponse } from 'axios';
import CodeEditor from 'components/room/ingame-room/CodeEditor';
import ProgressBarComponent from 'components/room/ingame-room/ProgressBar';
import Timer from './ingame-room/Timer';
import Chat from 'components/room/chat/Chat';
import GameResultModal from 'components/room/ingame-room/GameResultModal';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import DockLayout from 'rc-dock';
import { useCallback, useEffect, useState } from 'react';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room.module.css';
import { IUserStatus } from 'types/roomType';
import api from 'utils/axios';
import { removeTab } from 'utils/tabs';
import Problem from './ingame-room/Problem';
import emitter from 'utils/eventEmitter';

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
  roomStatus: any;
  dockLayoutRef: React.RefObject<DockLayout>;
  setIsGameStart: (isGameStart: boolean) => void;
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
  const [problems, setProblems] = useState<IProblem[]>([]); // 코딩테스트 문제
  const [testResults, setTestResults] = useState<ITestResults[]>([]); // 테스트케이스 결과 퍼센트
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  ); // 작성 코드
  const [surrenders, setSurrenders] = useState<ISurrenders[]>([]); // 항복 여부
  const [isSuccess, setIsSuccess] = useState<IisSuccess[]>([]);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false); // 게임 종료 여부
  const [winner, setWinner] = useState<string>(''); // 승자 ID
  const [winnerCode, setWinnerCode] = useState<string>(''); // 승자 코드
  const { roomSubscribe } = useWebSocketStore();

  useEffect(() => {
    // 초기 값 설정
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
    const handleMessages = (msg: any) => {
      console.log('인게임 : ', msg);
      //게임 시작
      //테스트 케이스 통과율
      if (msg.judgeResult) {
        const { userId, currentTest, totalTests, result } = msg.judgeResult;
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
      if (msg.leaveUserStatus) {
        const leaveUserStatus = msg.leaveUserStatus;
        console.log('유저 퇴장!');
        setTestResults((prevTestResults: any) =>
          prevTestResults.filter(
            (user: any) => user.id !== leaveUserStatus.userId
          )
        );
      }

      // 게임 결과
      if (msg.gameEnd) {
        setWinner(msg.gameEnd.userId);
        setWinnerCode(msg.gameEnd.code);
        setIsGameEnd(true);
      }
    };

    emitter.on('message', handleMessages);

    // Cleanup 함수를 사용하여 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      emitter.off('message', handleMessages);
    };
  }, []);

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
      problemId: problems[0].id,
      roomId: props.roomStatus.roomId,
      userId: props.userId,
      language: searchMyLanguage(),
      code: code,
    });
  }, [props.userId, props.roomStatus.roomId, problems, code]);

  const handleGameEnd = useCallback(async (): Promise<void> => {
    try {
      const response: AxiosResponse = await api.post(
        `v1/game/${props.roomStatus.roomId}/end`,
        {}
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  }, [props.roomStatus.roomId]);

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
        <Timer handleGameEnd={handleGameEnd} />
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
            {problems.map((problem) => (
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
        <Chat />
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
