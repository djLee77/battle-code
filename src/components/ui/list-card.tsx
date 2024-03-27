import LockOpenIcon from "@mui/icons-material/LockOpen";
import styles from "../../styles/list-card.module.css";
export default function ListCard() {
  return (
    <div className={styles.wrapper}>
      <div className={styles[`top-box`]}>
        <h3 className={styles.title}>
          <LockOpenIcon sx={{ marginRight: "12px" }} />
          #1. 1ㄷ1 뜨실 초보만~
        </h3>
        <div className={styles[`status-box`]}>
          <span>대기중</span>
          <h4>1/2</h4>
        </div>
      </div>
      <ul className={styles[`option-list`]}>
        <li>난이도 : 브론즈1</li>
        <li>제한 시간 : 1시간</li>
        <li>제출 제한 : 5번</li>
        <li>언어 설정 : JAVA</li>
      </ul>
    </div>
  );
}
