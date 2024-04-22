import axios from "axios";
import ModifyRoomModal from "components/modals/modify-room";
import UserCard from "components/user-card";
import { useEffect, useState } from "react";
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
  const { webSocketClient, publishMessage } = useWebSocketStore();
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
    } catch (error) {
      console.error(error);
    }
  };

  // 준비 버튼 누르면 누른 유저의 정보 소켓으로 전송
  const handleReady = () => {
    const updateUser = userStatus.filter((user) => user.userId === "test")[0];
    updateUser.isReady = !updateUser.isReady;
    console.log(updateUser);
    publishMessage(`/app/room/${data.roomStatus.roomId}/update/user-status`, updateUser);
  };

  // 유저 상태 업데이트하는 함수
  const handleUpdateUserStatus = (updateUser: any) => {
    const updatedUserStatusArray = userStatus.reduce((acc: any, user: any) => {
      if (user.userId === updateUser.userId) {
        // userId가 같은 경우 원하는 객체로 교체하여 새로운 배열 생성
        acc.push(updateUser);
      } else {
        // 그 외의 경우는 기존 객체 그대로 유지하여 새로운 배열 생성
        acc.push(user);
      }
      return acc;
    }, []);
    console.log("업데이트 : ", updatedUserStatusArray);
    setUserStatus(updatedUserStatusArray);
  };

  // 첫 마운트 될 때 방 구독하기, 언마운트 될 때 구독 취소하기
  useEffect(() => {
    if (webSocketClient) {
      const subscription = webSocketClient.subscribe(`/topic/room/${data.roomStatus.roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message:", receivedMessage);
        // 받은 메시지가 유저 상태 객체면 handleUpdateUserStatus 함수 실행
        if (receivedMessage.userStatus) {
          return handleUpdateUserStatus(receivedMessage.userStatus);
        }

        // 받은 메시지가 방 상태 객체면 방 상태 업데이트
        if (receivedMessage.roomStatus) {
          setRoomStatus(receivedMessage.roomStatus);
        }
      });

      console.log(data);

      return () => {
        console.log("언마운트");
        console.log(subscription);
        handleRoomLeave();
        if (subscription) {
          console.log("구독취소");
          subscription.unsubscribe();
        }
      };
    }
  }, []);

  const handleTabRemove = () => {
    console.log(dockLayoutRef.current);
    // dockbox 안의 children 탭 제거
    removeTab(dockLayoutRef.current.state.layout.dockbox.children, `${data.roomStatus.roomId}번방`, dockLayoutRef);

    // floatbox 안의 children 탭 제거
    removeTab(dockLayoutRef.current.state.layout.floatbox.children, `${data.roomStatus.roomId}번방`, dockLayoutRef);
  };

  return (
    <div>
      <div className={styles[`title-box`]}>
        <h2 className={styles.title}>{roomStatus.title}</h2>
        {
          // user-store 완성되면 수정해야함
          roomStatus.hostId === "test" && <ModifyRoomModal data={data.roomStatus} />
        }
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
        <button className={styles.button} onClick={handleTabRemove}>
          나가기
        </button>
        <button className={styles.button} style={{ marginLeft: "47%" }} onClick={handleReady}>
          준비 완료
        </button>
      </div>
    </div>
  );
}
