import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import CodeEditor from 'components/room/ingame-room/CodeEditor';
import Timer from './ingame-room/Timer';
import Chat from 'components/room/chat/Chat';
import GameResultModal from 'components/room/ingame-room/GameResultModal';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import DockLayout from 'rc-dock';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room/room.module.css';
import { IUserStatus } from 'types/roomType';
import api from 'utils/axios';
import { removeTab } from 'utils/tabs';
import Problem from './ingame-room/Problem';
import emitter from 'utils/eventEmitter';
import ScoreBoard from './ingame-room/ScoreBoard';
import ChatInput from './chat/ChatInput';

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
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  );
  const [surrenders, setSurrenders] = useState<ISurrenders[]>([]);
  const [usersCorrectStatus, setUsersCorrectStatus] = useState<IisCorrect[]>(
    []
  );
  const [isRightSideHide, setIsRightSideHide] = useState<boolean>(false);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [winnerInfo, setWinnerInfo] = useState<IWinnerInfo>();
  const [messages, setMessages] = useState<IMessages[]>([]);
  const { roomSubscribe, publishMessage } = useWebSocketStore();

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    await fetchProblems();
    initializeUserStates();
  };

  const fetchProblems = async () => {
    try {
      const response = await api.get(
        `v1/games/${props.roomStatus.roomId}/problems`
      );
      setProblems(response.data.problems);
    } catch (error) {
      console.error(
        'Error fetching problems:',
        error instanceof Error ? error.message : error
      );
    }
  };

  const initializeUserStates = () => {
    const sortedUserStatus = [...props.userStatus].sort((a, b) =>
      a.userId.localeCompare(b.userId)
    );

    const initialSurrenders = sortedUserStatus.map((user) => ({
      id: user.userId,
      isSurrender: false,
    }));
    const initialCorrectStatus = sortedUserStatus.map((user) => ({
      id: user.userId,
      isCorrect: false,
    }));

    setSurrenders(initialSurrenders);
    setUsersCorrectStatus(initialCorrectStatus);
  };

  useEffect(() => {
    const handleMessages = (msg: any) => {
      if (msg.gameEnd) {
        setWinnerInfo(msg.gameEnd);
        setIsGameEnd(true);
      }

      if (msg.userStatusList) {
        props.setUserStatus(msg.userStatusList);
      }

      if (msg.userSurrender) {
        updateSurrenders(msg.userSurrender);
      }

      if (msg.message) {
        setMessages((prevMessages) => [...prevMessages, msg.message]);
      }

      if (msg.leaveUserStatus) {
        handleUserLeave(msg.leaveUserStatus);
      }
    };

    emitter.on('message', handleMessages);

    return () => {
      emitter.off('message', handleMessages);
    };
  }, []);

  const updateSurrenders = (userSurrender: any) => {
    setSurrenders((prevSurrenders) =>
      prevSurrenders.map((surrender) =>
        surrender.id === userSurrender.userId
          ? { id: userSurrender.userId, isSurrender: userSurrender.surrender }
          : surrender
      )
    );
  };

  const handleUserLeave = (leaveUserStatus: any) => {
    setUsersCorrectStatus((prevStatus) =>
      prevStatus.filter((user) => user.id !== leaveUserStatus.userId)
    );
    setSurrenders((prevSurrenders) =>
      prevSurrenders.filter((user) => user.id !== leaveUserStatus.userId)
    );
  };

  useEffect(() => {
    const correctedUsers = usersCorrectStatus.filter(
      (status) => status.isCorrect
    );
    setSurrenders((prevSurrenders) =>
      prevSurrenders.filter(
        (surrender) =>
          !correctedUsers.find((corrected) => corrected.id === surrender.id)
      )
    );

    if (correctedUsers.length === props.userStatus.length) {
      handleGameEnd();
    }
  }, [usersCorrectStatus]);

  useEffect(() => {
    if (
      surrenders.every((surrender) => surrender.isSurrender) &&
      surrenders.length > 0
    ) {
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
    api.post(`v1/judges`, {
      problemId: problems[0].id,
      roomId: props.roomStatus.roomId,
      userId: props.userId,
      language: searchMyLanguage(),
      code: code,
    });
  }, [props.userId, props.roomStatus.roomId, problems, code]);

  const handleGameEnd = useCallback(async (): Promise<void> => {
    if (usersCorrectStatus[0]?.id !== props.userId) return;

    try {
      await api.post(`v1/games/${props.roomStatus.roomId}/end`, {});
    } catch (error) {
      console.error(
        'Error ending game:',
        error instanceof Error ? error.message : error
      );
    }
  }, [props.roomStatus.roomId, props.userId, usersCorrectStatus]);

  const handleRoomLeave = useCallback(async (): Promise<void> => {
    try {
      await api.post(`v1/games/${props.roomStatus.roomId}/leave`, {});
      removeTab(props.dockLayoutRef, `${props.roomStatus.roomId}번방`);
      roomSubscribe.subscription?.unsubscribe();
    } catch (error) {
      console.error(
        'Error leaving room:',
        error instanceof Error ? error.message : error
      );
    }
  }, [
    props.roomStatus.roomId,
    props.dockLayoutRef,
    roomSubscribe.subscription,
  ]);

  const handleSurrender = () => {
    publishMessage(
      `/app/games/${props.roomStatus.roomId}/${props.userId}/surrender`,
      {}
    );
  };

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
            <CodeEditor
              className={styles.flexGrow}
              language={searchMyLanguage().toLowerCase()}
              code={code}
              setCode={setCode}
            />
          </div>
          <div className={styles.centerFooter}>
            <RoomCustomButton onClick={handleSubmit}>제출하기</RoomCustomButton>
            <RoomCustomButton onClick={handleSurrender}>항복</RoomCustomButton>
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
              <ChatInput roomId={props.roomStatus.roomId} />
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
