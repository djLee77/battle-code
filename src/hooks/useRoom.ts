import { useCallback, useEffect, useState } from 'react';
import useWebSocketStore from 'store/useWebSocketStore';
import { IRoomStatus } from 'types/roomType';
import { removeTab } from 'utils/tabs';
import {
  handleRoomLeave,
  handleReady,
  handleGameStart,
  handleSubmit,
  handleEarlyEnd,
} from 'handler/room';

interface IUseRoomWebSocket {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<any>;
}

interface type {
  id: string;
  percent: number;
  isEarlyEnd: boolean;
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
  const [inGameUserStatus, setInGameUserStatus] = useState<type[]>([]); // 게임 진행중일때 유저 상태
  const [problems, setProblems] = useState<IProblem[]>([]); // 코딩테스트 문제
  const [code, setCode] = useState<string>(
    "var message = 'Monaco Editor!' \nconsole.log(message);"
  ); // 작성 코드
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false); // 게임 종료 여부
  const [winner, setWinner] = useState<string>('');
  const [winnerCode, setWinnerCode] = useState<string>('');

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

        setInGameUserStatus((prevResults) => [
          ...prevResults,
          {
            id: receivedMessage.enterUserStatus.userId,
            percent: 0,
            isEarlyEnd: false,
          },
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

      if (receivedMessage.gameStartInfo) {
        setProblems(receivedMessage.gameStartInfo);
        setIsGameStart(true);
      }

      //테스트 케이스 통과율
      if (receivedMessage.judgeResult) {
        const { userId, currentTest, totalTests } = receivedMessage.judgeResult;
        setInGameUserStatus((prevResults) =>
          prevResults.map((result) =>
            result.id === userId
              ? {
                  id: userId,
                  percent: (currentTest / totalTests) * 100,
                  isEarlyEnd: false,
                }
              : result
          )
        );
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
      setInGameUserStatus((prev: any) => [...prev, obj]);
    });
  }, []);

  return {
    userId,
    roomStatus,
    userStatus,
    isAllUsersReady,
    isGameStart,
    testResults: inGameUserStatus,
    code,
    setCode,
    problems,
    setIsGameStart,
    publishMessage,
    roomSubscribe,
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
        handleReady(
          userId,
          userStatus,
          props.data.roomStatus.roomId,
          publishMessage
        ),
      [userId, userStatus, props.data.roomStatus.roomId, publishMessage]
    ),
    handleGameStart: useCallback(
      () => handleGameStart(props.data.roomStatus.roomId, setIsGameStart),
      [props.data.roomStatus.roomId, setIsGameStart]
    ),
    handleSubmit: useCallback(
      () =>
        handleSubmit(
          setInGameUserStatus,
          userId,
          problems,
          roomStatus.roomId,
          userStatus,
          code
        ),
      [
        setInGameUserStatus,
        userId,
        problems,
        roomStatus.roomId,
        userStatus,
        code,
      ]
    ),

    handleEarlyEnd: useCallback(
      () => handleEarlyEnd(roomStatus.roomId),
      [roomStatus.roomId]
    ),
  };
};

export default useRoom;
