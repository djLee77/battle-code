import { useState } from "react";
import styles from "styles/room.module.css";

export default function Room() {
  const [chatIsHide, setChatIsHide] = useState<boolean>(false);

  return (
    <div>
      <h2 className={styles.title}>방 제목</h2>
      <div className={styles.container}>
        <div className={styles[`test-problem`]}>코딩테스트문제</div>
        <div className={styles["room-info"]}>
          <div className={styles["user-list"]}>방 유저 목록</div>
          <div className={styles["room-settings"]}>방 설정값</div>
        </div>
        <div className={styles[`chat`]} style={chatIsHide ? { display: "none" } : { display: "flex" }}>
          채팅창
        </div>
      </div>
      <div className={styles[`button-wrapper`]}>
        <button className={styles.button}>버튼 1</button>
        <button className={styles.button}>버튼 2</button>
        <button className={styles.button} onClick={() => setChatIsHide(!chatIsHide)}>
          채팅 숨기기
        </button>
      </div>
    </div>
  );
}
