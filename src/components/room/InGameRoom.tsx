import { AxiosResponse } from 'axios';
import CodeEditor from 'components/room/ingame-room/CodeEditor';
import Timer from './ingame-room/Timer';
import Chat from 'components/room/chat/Chat';
import GameResultModal from 'components/room/ingame-room/GameResultModal';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import DockLayout from 'rc-dock';
import { useCallback, useEffect, useState } from 'react';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room/room.module.css';
import { IUserStatus } from 'types/roomType';
import api from 'utils/axios';
import { removeTab } from 'utils/tabs';
import Problem from './ingame-room/Problem';
import emitter from 'utils/eventEmitter';
import ScoreBoard from './ingame-room/ScoreBoard';
import ChatSend from './chat/ChatSend';

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
  setUserStatus: (userStatus: IUserStatus[]) => void;
}

interface ISurrenders {
  id: string;
  isSurrender: boolean;
}

interface IisCorrect {
  id: string;
  isCorrect: boolean;
}

interface IWinnerInfo {
  userId: string;
  code: string;
  language: string;
  result: string;
}

interface IMessages {
  messageType: string;
  senderId: string;
  message: string;
  sendTime: string;
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
  const [isRightSideHide, setIsRightSideHide] = useState<boolean>(false);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false); // 게임 종료 여부
  const [winnerInfo, setWinnerInfo] = useState<IWinnerInfo>(); // 승자 정보
  const [messages, setMessages] = useState<IMessages[]>([]);
  const { roomSubscribe, publishMessage } = useWebSocketStore();

  const getProblmes = async () => {
    try {
      const response = await api.get(
        `v1/games/${props.roomStatus.roomId}/problems`
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

  const handleSurrend = () => {
    console.log('항복 버튼');
    publishMessage(
      `/app/games/${props.roomStatus.roomId}/${props.userId}/surrender`,
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
        setWinnerInfo(msg.gameEnd);
        setIsGameEnd(true);
      }

      if (msg.userStatusList) {
        console.log('유저 정보');
        props.setUserStatus(msg.userStatusList);
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
      handleGameEnd();
    }
  }, [usersCorrectStatus]);

  useEffect(() => {
    const isAllSurrender = surrenders.every(
      (surrender) => surrender.isSurrender
    );

    console.log(surrenders);

    if (isAllSurrender && surrenders.length > 0) {
      handleGameEnd();
    }
  }, [surrenders]);

  const searchMyLanguage = () => {
    const player = props.userStatus.find(
      (user) => user.userId === props.userId
    );
    return player ? player.language : '';
  };

  const handleSubmit = useCallback(() => {
    console.log('제출');

    api.post(`v1/judges`, {
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
        `v1/games/${props.roomStatus.roomId}/end`,
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
        `v1/games/${props.roomStatus.roomId}/leave`,
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
      <div className={styles.header}>
        <div className={styles.titleBox}>
          <h2 className={styles.title}>{props.roomStatus.title}</h2>
          <Timer
            handleGameEnd={handleGameEnd}
            limitTime={props.roomStatus.limitTime}
          />
        </div>
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
                language={searchMyLanguage().toLowerCase()}
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
              <RoomCustomButton onClick={handleSurrend}>항복</RoomCustomButton>
            </div>
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
              <ChatSend roomId={props.roomStatus.roomId} />
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
      <GameResultModal
        winnerInfo={winnerInfo}
        open={isGameEnd}
        setOpen={setIsGameEnd}
        setIsGameStart={props.setIsGameStart}
      />
    </div>
  );
};

export default InGameRoom;
