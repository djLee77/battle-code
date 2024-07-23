import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CodeEditor from 'components/room/ingame-room/CodeEditor';
import Timer from './ingame-room/Timer';
import Chat from 'components/room/chat/Chat';
import GameResultModal from 'components/room/ingame-room/GameResultModal';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import DockLayout from 'rc-dock';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room/room.module.css';
import { IRoom, IUserStatus } from 'types/roomType';
import api from 'utils/axios';
import { removeTab } from 'utils/tabs';
import Problem from './ingame-room/Problem';
import emitter from 'utils/eventEmitter';
import ScoreBoard from './ingame-room/ScoreBoard';
import ChatInput from './chat/ChatInput';
import useRoomStore from 'store/useRoomStore';

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
  dockLayoutRef: React.RefObject<DockLayout>;
}

interface ISurrenders {
  id: string;
  isSurrender: boolean;
}

interface IUsersCorrectStatus {
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
  const {
    roomStatus,
    userStatus,
    submitCount,
    surrenders,
    usersCorrectStatus,
    setSubmitCount,
    setUserStatus,
    setIsGameStart,
    setSurrenders,
    setUsersCorrectStatus,
    resetState,
  } = useRoomStore();
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [code, setCode] = useState<string>(
    `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.PriorityQueue;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());

        int n = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());

        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) {
            pq.add(Integer.parseInt(st.nextToken()));
        }

        int sum = 0;
        int minus = 0;
        for (int i = 0; i < k; i++) {
            sum += pq.poll();
            minus += i;
        }

        System.out.println(sum - minus);
    }
}`
  );
  const [isRightSideHide, setIsRightSideHide] = useState<boolean>(false);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [winnerInfo, setWinnerInfo] = useState<IWinnerInfo>();
  const [messages, setMessages] = useState<IMessages[]>([]);
  const [isJudging, setIsJudging] = useState<boolean>(false);
  const { publishMessage, unsubscribe } = useWebSocketStore();

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (isGameEnd) {
      setSurrenders([]);
      setUsersCorrectStatus([]);
      setSubmitCount(-1);
    }
  }, [isGameEnd]);

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

    if (correctedUsers.length === userStatus.length) {
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

  useEffect(() => {
    if (submitCount === 0) {
      handleSurrender();
    }
  }, [submitCount]);

  useEffect(() => {
    const handleMessages = (msg: any) => {
      if (msg.gameEnd) {
        setWinnerInfo(msg.gameEnd);
        setIsGameEnd(true);
      }

      if (msg.userStatusList) {
        setUserStatus(msg.userStatusList);
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

  const initializeGame = async () => {
    await fetchProblems();
    if (usersCorrectStatus.length === 0 && surrenders.length === 0) {
      initializeUserStates();
    }

    if (submitCount === -1) {
      setSubmitCount(roomStatus!.maxSubmitCount);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await api.get(`v1/games/${roomStatus?.roomId}/problems`);
      setProblems(response.data.problems);
    } catch (error) {
      console.error(
        'Error fetching problems:',
        error instanceof Error ? error.message : error
      );
    }
  };

  const initializeUserStates = () => {
    const sortedUserStatus = userStatus.sort((a, b) =>
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

  const searchMyLanguage = () => {
    const player = userStatus.find((user) => user.userId === props.userId);
    return player ? player.language : '';
  };

  const handleSubmit = useCallback(async () => {
    try {
      setSubmitCount((submitCount: number) => submitCount - 1);
      setIsJudging(true);
      await api.post(`v1/judges`, {
        problemId: problems[0].id,
        roomId: roomStatus?.roomId,
        userId: props.userId,
        language: searchMyLanguage(),
        code: code,
      });
    } catch (error) {
      console.error(
        'Error ending game:',
        error instanceof Error ? error.message : error
      );
    }
  }, [props.userId, roomStatus?.roomId, problems, code]);

  const handleGameEnd = useCallback(async (): Promise<void> => {
    if (usersCorrectStatus[0]?.id !== props.userId) return;

    try {
      await api.post(`v1/games/${roomStatus?.roomId}/end`, {});
    } catch (error) {
      console.error(
        'Error ending game:',
        error instanceof Error ? error.message : error
      );
    }
  }, [roomStatus?.roomId, props.userId, usersCorrectStatus]);

  const handleRoomLeave = useCallback(async (): Promise<void> => {
    if (window.confirm('정말로 나가시겠습니까?')) {
      try {
        await api.post(`v1/games/${roomStatus?.roomId}/leave`, {});
        removeTab(props.dockLayoutRef, `${roomStatus?.roomId}번방`);
        resetState();
        unsubscribe('room');
      } catch (error) {
        console.error(
          'Error leaving room:',
          error instanceof Error ? error.message : error
        );
      }
    }
  }, [roomStatus?.roomId, props.dockLayoutRef, unsubscribe]);

  const handleSurrender = () => {
    if (
      window.confirm(
        '항복을 하면 더이상 제출을 할 수 없게됩니다. 정말로 항복하시겠습니까?'
      )
    ) {
      publishMessage(
        `/app/games/${roomStatus?.roomId}/${props.userId}/surrender`,
        {}
      );
    }
  };

  const isSurrender = useMemo(() => {
    const findUser = surrenders.find(
      (value) => value.id === props.userId && value.isSurrender
    );
    return findUser ? true : false;
  }, [surrenders]);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.titleBox}>
          <h2 className={styles.title}>{roomStatus?.title}</h2>
          <Timer
            handleGameEnd={handleGameEnd}
            limitTime={roomStatus!.limitTime}
            isGameEnd={isGameEnd}
          />
        </div>
        <ScoreBoard
          userStatus={userStatus}
          setUsersCorrectStatus={setUsersCorrectStatus}
          setIsJudging={setIsJudging}
          userId={props.userId}
          surrenders={surrenders}
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
            <div style={{ marginRight: 34 }}>
              <RoomCustomButton onClick={handleSurrender}>
                항복
              </RoomCustomButton>
            </div>
            <RoomCustomButton
              onClick={handleSubmit}
              disabled={isJudging || submitCount === 0 || isSurrender}
              bgColor="#108ee9"
            >
              {'제출 ' + submitCount + ' / ' + roomStatus?.maxSubmitCount}
            </RoomCustomButton>
          </div>
        </div>
        {!isRightSideHide ? (
          <div className={styles.rightSide}>
            <div className={styles.rightBody}>
              <Chat
                isRightSideHide={isRightSideHide}
                setIsRightSideHide={setIsRightSideHide}
                messages={messages}
                roomId={roomStatus!.roomId}
              />
            </div>
            <div className={styles.rightFooter}>
              <ChatInput roomId={roomStatus!.roomId} />
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
        setIsGameStart={setIsGameStart}
      />
    </div>
  );
};

export default InGameRoom;
