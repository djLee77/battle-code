import axios from "axios";
import ModifyRoomModal from "components/modals/modify-room";
import UserCard from "components/user-card";
import { useCallback, useEffect, useState } from "react";
import useWebSocketStore from "store/websocket-store";
import styles from "styles/room.module.css";
import { IRoomStatus } from "types/room-types";
import { getAccessToken } from "utils/cookie";
import { removeTab } from "utils/tabs";

interface IProps {
  data: IRoomStatus;
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default function Room({ data, dockLayoutRef }: IProps) {
  const [chatIsHide, setChatIsHide] = useState<boolean>(false);
  const [roomStatus, setRoomStatus] = useState(data.roomStatus);
  const [userStatus, setUserStatus] = useState(data.userStatus);
  const { webSocketClient, roomSubscribe, publishMessage, setRoomSubscription } = useWebSocketStore();
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const handleRoomLeave = async () => {
    const accessToken = getAccessToken();
    try {
      const response = await axios.post(
        `${serverUrl}v1/gameRoom/leave/${data.roomStatus.roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      removeTab(dockLayoutRef.current.state.layout.dockbox.children, `${data.roomStatus.roomId}번방`, dockLayoutRef);
      removeTab(dockLayoutRef.current.state.layout.floatbox.children, `${data.roomStatus.roomId}번방`, dockLayoutRef);
      if (roomSubscribe.subscription) {
        roomSubscribe.subscription.unsubscribe(); // 구독 취소
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 준비 버튼 누르면 누른 유저의 정보 소켓으로 전송
  const handleReady = () => {
    console.log(userStatus);
    const updateUser = userStatus.filter((user) => user.userId === localStorage.getItem("id"))[0];
    updateUser.isReady = !updateUser.isReady;
    publishMessage(`/app/room/${data.roomStatus.roomId}/update/user-status`, updateUser);
  };

  // 첫 마운트 될 때 방 구독하기, 언마운트 될 때 구독 취소하기
  useEffect(() => {
    if (webSocketClient) {
      const subscription = webSocketClient.subscribe(`/topic/room/${data.roomStatus.roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message:", receivedMessage);
        // 받은 메시지가 업데이트 유저 상태 객체면 바뀐 유저 상태 업데이트
        if (receivedMessage.updateUserStatus) {
          return setUserStatus((prevUserStatus) => {
            return prevUserStatus.map((user) => {
              if (user.userId === receivedMessage.updateUserStatus.userId) {
                return receivedMessage.updateUserStatus; // userId가 같은 경우 업데이트된 객체 반환
              }
              return user; // 그 외의 경우는 기존 객체 그대로 반환
            });
          });
        }

        // 유저 입장 메시지면 상태 변수에 입장한 유저 추가
        if (receivedMessage.enterUserStatus) {
          return setUserStatus((prevUserStatus) => [...prevUserStatus, receivedMessage.enterUserStatus]);
        }

        // 유저 퇴장 메시지면 상태 변수에 퇴장한 유저 삭제
        if (receivedMessage.leaveUserStatus) {
          return setUserStatus((prevUserStatus) =>
            prevUserStatus.filter((user) => user.userId !== receivedMessage.leaveUserStatus.userId)
          );
        }

        // 받은 메시지가 방 상태 객체면 방 상태 업데이트
        if (receivedMessage.roomStatus) {
          return setRoomStatus(receivedMessage.roomStatus);
        }
      });

      setRoomSubscription(subscription);

      return () => {
        console.log("언마운트");
      };
    }
  }, []);

  return (
    <div>
      <div className={styles[`title-box`]}>
        <h2 className={styles.title}>{roomStatus.title}</h2>
        {roomStatus.hostId === localStorage.getItem("id") && <ModifyRoomModal data={data.roomStatus} />}
      </div>
      <div style={!chatIsHide ? { display: "none" } : { display: "block", position: "absolute", right: 10, top: 10 }}>
        <button className={styles.button} onClick={() => setChatIsHide(!chatIsHide)}>
          채팅 On
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles[`test-problem`]}>코딩테스트문제</div>
        <div className={styles["room-info"]}>
          <div className={styles["user-list"]}>
            {userStatus.map((data: any) => (
              <UserCard key={data.userId} data={data} />
            ))}
          </div>
          <div className={styles["room-settings"]}>
            <div>
              <p>난이도 : {roomStatus.problemLevel}</p>
              <p>제출 횟수 : {roomStatus.maxSubmitCount}</p>
              <p>언어 설정 : {roomStatus.language}</p>
            </div>
          </div>
        </div>
        <div className={styles[`chat`]} style={chatIsHide ? { display: "none" } : { display: "block" }}>
          <button className={styles.button} onClick={() => setChatIsHide(!chatIsHide)}>
            채팅 Off
          </button>
          채팅창
        </div>
      </div>
      <div className={styles[`button-container`]}>
        <button className={styles.button} onClick={handleRoomLeave}>
          나가기
        </button>
        <button className={styles.button} style={{ marginLeft: "47%" }} onClick={handleReady}>
          준비 완료
        </button>
      </div>
    </div>
  );
}
