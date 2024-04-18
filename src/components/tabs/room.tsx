import { useState } from "react";
import styles from "styles/room.module.css";

interface IProps {
  roomId: number;
}

export default function Room({ roomId }: IProps) {
  const [chatIsHide, setChatIsHide] = useState<boolean>(false);
  console.log(roomId);
  return (
    <div>
      <h2 className={styles.title}>방 제목</h2>
      <div style={!chatIsHide ? { display: "none" } : { display: "block", position: "absolute", right: 10, top: 10 }}>
        <button className={styles.button} onClick={() => setChatIsHide(!chatIsHide)}>
          채팅 On
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles[`test-problem`]}>코딩테스트문제</div>
        <div className={styles["room-info"]}>
          <div className={styles["user-list"]}>방 유저 목록</div>
          <div className={styles["room-settings"]}>방 설정값</div>
        </div>
        <div className={styles[`chat`]} style={chatIsHide ? { display: "none" } : { display: "block" }}>
          <button className={styles.button} onClick={() => setChatIsHide(!chatIsHide)}>
            채팅 Off
          </button>
          채팅창
        </div>
      </div>
      <div className={styles[`button-container`]}>
        <button className={styles.button}>나가기</button>
        <button className={styles.button} style={{ marginLeft: "47%" }}>
          준비 완료
        </button>
      </div>
    </div>
  );
}
