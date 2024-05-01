import styles from "styles/record-card.module.css";
import CustomButton from "components/ui/button";

interface RecordProps {
  record: {
    otherUser: string;
    date: string;
    result: string;
    level: string;
    playTime: string;
  };
}

export default function RecordCard({ record }: RecordProps) {
  const bgColor: any = {
    "Perfect Win": "#4157A3",
    Win: "#4157A3",
    Draw: "#424242",
    Lose: "#953A3A",
  };

  const resultColor: any = {
    "Perfect Win": "#4EFFDF",
    Win: "#3D7FFF",
    Draw: "#9C9C9C",
    Lose: "#FF7070",
  };
  return (
    <div className={styles.record} style={{ backgroundColor: bgColor[record.result] }}>
      <div className={styles[`record-result`]}>
        <b style={{ color: resultColor[record.result] }}>{record.result}</b>
        <span>{record.date}</span>
      </div>
      <div className={styles[`record-user`]}>
        <b>vs {record.otherUser}</b>
      </div>
      <div className={styles[`record-level`]}>
        <div>
          <span>난이도:{record.level}</span>
          <span>제출시간:{record.playTime}</span>
        </div>
        <CustomButton type="button" size="small">
          코드 확인
        </CustomButton>
      </div>
    </div>
  );
}
