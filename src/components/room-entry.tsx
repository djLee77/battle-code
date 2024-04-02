import { useState } from "react";
import CustomBtn from "./ui/button";
import styles from "styles/room-entry.module.css";

export default function RoomEntry() {
  const [value, setValue] = useState("");

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 저장
    const validInputValue = e.target.value.replace(/[^0-9]/g, "");
    setValue(validInputValue);
  };
  return (
    <div className={styles[`room-entry-container`]}>
      <input placeholder="방 번호로 입장하기" value={value} onChange={(e) => handleInputValue(e)} />
      <CustomBtn size="small" onClick={() => {}}>
        방 입장
      </CustomBtn>
    </div>
  );
}
