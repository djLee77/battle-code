import { useEffect, useState } from "react";
import CustomButton from "./ui/button";
import styles from "styles/room-entry.module.css";
import useWebSocketStore from "store/websocketStore";

export default function RoomEntry() {
  const [value, setValue] = useState("");
  const { isConnected, publishMessage, subscribe } = useWebSocketStore();

  // 메시지 발행 예시
  const handleSendMessage = () => {
    const destination = "/app/public/room"; // 메시지를 발행할 대상 destination 설정
    const messageBody = "하이"; // 발행할 메시지 내용
    publishMessage(destination, messageBody);
  };

  const handleIncomingMessage = (message: any) => {
    console.log("새 메시지 수신:", message.body);
    // 수신한 메시지 처리 로직 작성
  };

  useEffect(() => {
    // 채널 구독
    if (isConnected) {
      subscribe(`/topic/chat`, handleIncomingMessage);
    }

    return () => {
      // 컴포넌트 언마운트 시 구독 해제 로직 작성 (필요 시)
    };
  }, [isConnected]);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 저장
    const validInputValue = e.target.value.replace(/[^0-9]/g, "");
    setValue(validInputValue);
  };
  return (
    <div className={styles[`room-entry-container`]}>
      <input placeholder="방 번호로 입장하기" value={value} onChange={(e) => handleInputValue(e)} />
      <CustomButton type="button" size="small" onClick={handleSendMessage}>
        방 입장
      </CustomButton>
    </div>
  );
}
