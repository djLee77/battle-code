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
import ScoreBoard from './ingame-room/ScoreBoard';

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

interface IisCorrect {
  id: string;
  isCorrect: boolean;
}

const InGameRoom = (props: IProps) => {
  const [problems, setProblems] = useState<IProblem[]>([]); // 코딩테스트 문제
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  ); // 작성 코드
  const [surrenders, setSurrenders] = useState<ISurrenders[]>([]); // 항복 여부
  const [usersCorrectStatus, setUsersCorrectStatus] = useState<IisCorrect[]>(
    []
  );
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false); // 게임 종료 여부
  const [winner, setWinner] = useState<string>(''); // 승자 ID
  const [winnerCode, setWinnerCode] = useState<string>(''); // 승자 코드
  const { roomSubscribe } = useWebSocketStore();

  const getProblmes = async () => {
    try {
      const response = await api.get(
        `v1/game/${props.roomStatus.roomId}/problems`
      );
      console.log(response.data.problems);
      setProblems(response.data.problems);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  };

  const handleSurrend = async () => {
    const response = await api.post(
      `v1/game/${props.roomStatus.roomId}/${props.userId}/surrender`,
      {}
    );

    console.log(surrenders);
  };

  useEffect(() => {
    // 초기 값 설정
    getProblmes();

    props.userStatus.map((user) => {
      setSurrenders((prevSurrender: any) => [
        ...prevSurrender,
        {
          id: user.userId,
          isSurrender: false,
        },
      ]);
    });
  }, []);

  useEffect(() => {
    const handleMessages = (msg: any) => {
      console.log('인게임 : ', msg);

      // 게임 결과
      if (msg.gameEnd) {
        setWinner(msg.gameEnd.userId);
        setWinnerCode(msg.gameEnd.code);
        setIsGameEnd(true);
      }

      if (msg.userSurrender) {
        setSurrenders((prevSurrender: any) =>
          prevSurrender.map((surrender: any) =>
            surrender.id === msg.userSurrender.userId
              ? {
                  id: msg.userSurrender.userId,
                  isSurrender: msg.userSurrender.surrender,
                }
              : surrender
          )
        );
      }
    };

    emitter.on('message', handleMessages);

    // Cleanup 함수를 사용하여 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      emitter.off('message', handleMessages);
    };
  }, []);

  useEffect(() => {
    const correctedUsers = usersCorrectStatus.filter(
      (status) => status.isCorrect
    );

    // 정답을 맞춘 유저들은 surrenders 배열에서 제거
    setSurrenders((prevSurrender) =>
      prevSurrender.filter(
        (surrender) =>
          !correctedUsers.find((corrected) => corrected.id === surrender.id)
      )
    );
    console.log('정답자 제거');
    console.log(usersCorrectStatus);

    if (correctedUsers.length === props.userStatus.length) {
      setIsGameEnd(true);
    }
  }, [usersCorrectStatus]);

  useEffect(() => {
    const isAllSurrender = surrenders.every(
      (surrender) => surrender.isSurrender
    );

    console.log(surrenders);

    if (isAllSurrender && surrenders.length > 0) {
      setIsGameEnd(true);
    }
  }, [surrenders]);

  const searchMyLanguage = () => {
    const player = props.userStatus.find(
      (user) => user.userId === props.userId
    );
    return player ? player.language : '';
  };

  const handleSubmit = useCallback(() => {
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
        <Timer
          handleGameEnd={handleGameEnd}
          limitTime={props.roomStatus.limitTime}
        />
        <ScoreBoard
          userStatus={props.userStatus}
          setUsersCorrectStatus={setUsersCorrectStatus}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.leftBody}>
            {problems?.map((problem) => (
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
            <div style={{ marginRight: '10px' }}>
              <RoomCustomButton onClick={handleSubmit}>
                제출하기
              </RoomCustomButton>
            </div>
            <div>
              <RoomCustomButton onClick={handleSurrend}>항복</RoomCustomButton>
            </div>
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
