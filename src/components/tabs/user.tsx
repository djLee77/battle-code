import CircleProgress from "components/circle";
import RecordCard from "components/record-card";
import CustomBtn from "components/ui/button";
import { userData } from "data/user-data";
import { useEffect } from "react";
import styles from "styles/user.module.css";

export default function User() {
  const userTestData = userData;
  useEffect(() => {
    console.log("테스트");
  }, []);
  return (
    <div className={styles[`user-container`]}>
      <div className={styles[`user-info`]}>
        <h2>{userTestData.name}</h2>
        <span>랭킹:{userTestData.rank}위</span>
      </div>
      <div>
        <span>사용 테마 : {userTestData.useTheme}</span>
        <CustomBtn size="small">테마 변경</CustomBtn>
      </div>
      <div className={styles[`record-container`]}>
        <CircleProgress progress={60} size={240} strokeWidth={30} circleColor="#FF5F58" progressColor="#3278FF" />
        <div className={styles[`record-box`]}>
          {userTestData.battleRecordList.map((record, idx) => (
            <RecordCard key={idx} record={record} />
          ))}
        </div>
      </div>
    </div>
  );
}
