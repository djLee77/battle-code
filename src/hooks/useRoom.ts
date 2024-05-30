import { useCallback, useEffect, useState } from 'react';
import useWebSocketStore from 'store/useWebSocketStore';
import { IRoomStatus } from 'types/roomType';
import { removeTab } from 'utils/tabs';
import {
  handleRoomLeave,
  handleSurrender,
  handleGameStart,
  handleSubmit,
  handleGameEnd,
} from 'handler/room';

interface IUseRoomWebSocket {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<any>;
}

interface type {
  id: string;
  percent: number;
  result: string;
}

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

const useRoom = (props: IUseRoomWebSocket) => {
  // room.tsx
  const [isGameStart, setIsGameStart] = useState<boolean>(false); // 게임 시작 여부
  const [roomStatus, setRoomStatus] = useState(props.data.roomStatus); // 방 상태
  const [userStatus, setUserStatus] = useState(props.data.userStatus); // 유저들 상태

  // waitingRoom.tsx
  const [isAllUsersReady, setIsAllUsersReady] = useState<boolean>(false); // 모든 유저 준비 여부

  // gamingRoom.tsx
  const [testResults, setTestResults] = useState<type[]>([]); // 테스트케이스 결과 퍼센트
  const [problems, setProblems] = useState<IProblem[]>([]); // 코딩테스트 문제
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  ); // 작성 코드
  const [surrenders, setSurrenders] = useState([]); // 항복 여부
  const [isSuccess, setIsSuccess] = useState([]);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false); // 게임 종료 여부
  const [winner, setWinner] = useState<string>(''); // 승자 ID
  const [winnerCode, setWinnerCode] = useState<string>(''); // 승자 코드
  const [timeLeft, setTimeLeft] = useState(15);

  const {
    webSocketClient,
    roomSubscribe,
    publishMessage,
    setRoomSubscription,
  } = useWebSocketStore();
  const userId = localStorage.getItem('id');

  /**
   * 웹소켓에서 받은 메시지 핸들링 함수
   */
  const handleMessage = useCallback(
    (message: any) => {
      const receivedMessage = JSON.parse(message.body);
      console.log('Received message:', receivedMessage);

      // 유저 상태 업데이트
      if (receivedMessage.updateUserStatus) {
        setUserStatus((prevUserStatus) =>
          prevUserStatus.map((user) =>
            user.userId === receivedMessage.updateUserStatus.userId
              ? receivedMessage.updateUserStatus
              : user
          )
        );
      }

      // 유저 입장
      if (receivedMessage.enterUserStatus) {
        setUserStatus((prevUserStatus) => [
          ...prevUserStatus,
          receivedMessage.enterUserStatus,
        ]);
      }

      // 유저 퇴장
      if (receivedMessage.leaveUserStatus) {
        const leaveUserStatus = receivedMessage.leaveUserStatus;
        // 방장이 퇴장할시
        if (leaveUserStatus.isHost && leaveUserStatus.userId !== userId) {
          alert('방장이 나갔습니다 ㅠㅠ');
          removeTab(props.dockLayoutRef, `${props.data.roomStatus.roomId}번방`);
          return;
        }
        // 유저가 퇴장할시
        setUserStatus((prevUserStatus) =>
          prevUserStatus.filter(
            (user) => user.userId !== leaveUserStatus.userId
          )
        );
      }

      // 방 설정 변경
      if (receivedMessage.roomStatus) {
        setRoomStatus(receivedMessage.roomStatus);
      }

      //게임시작
      // 게임 시작
      if (receivedMessage.gameStartInfo) {
        setProblems(receivedMessage.gameStartInfo);
        setIsGameStart(true);
        const timerId = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timerId);
              handleGameEnd(props.data.roomStatus.roomId);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }

      //테스트 케이스 통과율
      if (receivedMessage.judgeResult) {
        const { userId, currentTest, totalTests, result } =
          receivedMessage.judgeResult;
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

      // 게임 결과
      if (receivedMessage.gameEnd) {
        setWinner(receivedMessage.gameEnd.userId);
        setWinnerCode(receivedMessage.gameEnd.code);
        setIsGameEnd(true);
      }
    },
    [userId, props.data.roomStatus.roomId, props.dockLayoutRef]
  );

  useEffect(() => {
    if (!webSocketClient) return;
    const subscription = webSocketClient.subscribe(
      `/topic/room/${props.data.roomStatus.roomId}`,
      handleMessage
    );

    setRoomSubscription(subscription);
  }, [webSocketClient, handleMessage]);

  useEffect(() => {
    // 호스트 유저를 제외한 모든 유저의 isReady 상태 확인
    const allUsersExceptHost = userStatus.filter(
      (user) => user.userId !== roomStatus.hostId
    );
    // 방에 호스트 혼자면 코드 실행 중지
    if (allUsersExceptHost.length === 0) {
      return;
    }
    const allReady = allUsersExceptHost.every((user) => user.isReady);

    // 모든 유저가 준비 상태인지를 판단하여 상태 업데이트
    setIsAllUsersReady(allReady);
  }, [userStatus]);

  useEffect(() => {
    props.data.userStatus.map((value) => {
      const obj = { id: value.userId, percent: 0 };
      setTestResults((prev: any) => [...prev, obj]);
    });
  }, []);

  return {
    userId,
    roomStatus,
    userStatus,
    isAllUsersReady,
    isGameStart,
    testResults: testResults,
    code,
    setCode,
    problems,
    setIsGameStart,
    publishMessage,
    roomSubscribe,
    timeLeft,
    isGameEnd,
    setIsGameEnd,
    winner,
    setWinner,
    winnerCode,
    handleRoomLeave: useCallback(
      () =>
        handleRoomLeave(
          props.data.roomStatus.roomId,
          props.dockLayoutRef,
          roomSubscribe,
          removeTab
        ),
      [props.data.roomStatus.roomId, props.dockLayoutRef, roomSubscribe]
    ),
    handleReady: useCallback(
      () =>
        handleSurrender(
          userId,
          userStatus,
          props.data.roomStatus.roomId,
          publishMessage
        ),
      [userId, userStatus, props.data.roomStatus.roomId, publishMessage]
    ),
    handleGameStart: useCallback(
      () =>
        handleGameStart(
          props.data.roomStatus.roomId,
          userStatus,
          setIsGameStart,
          setTestResults,
          setSurrenders,
          setIsSuccess
        ),
      [
        props.data.roomStatus.roomId,
        userStatus,
        setIsGameStart,
        setTestResults,
        setSurrenders,
        setIsSuccess,
      ]
    ),
    handleSubmit: useCallback(
      () =>
        handleSubmit(
          setTestResults,
          userId,
          problems,
          roomStatus.roomId,
          userStatus,
          code
        ),
      [setTestResults, userId, problems, roomStatus.roomId, userStatus, code]
    ),
  };
};

export default useRoom;
