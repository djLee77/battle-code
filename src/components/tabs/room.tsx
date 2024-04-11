import styles from "styles/room.module.css";

export default function Room() {
  return (
    <div className={styles.container}>
      <div>코딩테스트문제</div>
      <div>
        <div>방 유저 목록</div>
        <div>방 설정값</div>
      </div>
      <div>채팅창</div>
    </div>
  );
}
