import React, { useEffect, useState } from "react";
import CustomButton from "../ui/button";
import styles from "styles/room-entry.module.css";
import useWebSocketStore from "store/websocket-store";

export default React.memo(function RoomEntry() {
  const [value, setValue] = useState("");
  const { isConnected, publishMessage, subscribe } = useWebSocketStore();

  // 메시지 발행 예시
  const handleSendMessage = () => {
    const destination = "/app/default/room"; // 메시지를 발행할 대상 destination 설정
    const messageBody = { roomId: null, senderId: "test", message: "야이 짱구야" }; // 발행할 메시지 내용
    publishMessage(destination, messageBody);
  };

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
});
