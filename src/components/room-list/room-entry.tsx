import React, { useState } from "react";
import CustomButton from "../ui/button";
import styles from "styles/room-entry.module.css";

export default React.memo(function RoomEntry() {
  const [value, setValue] = useState("");

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 저장
    const validInputValue = e.target.value.replace(/[^0-9]/g, "");
    setValue(validInputValue);
  };
  return (
    <div className={styles[`room-entry-container`]}>
      <input placeholder="방 번호로 입장하기" value={value} onChange={(e) => handleInputValue(e)} />
      <CustomButton type="button" size="small">
        방 입장
      </CustomButton>
    </div>
  );
});
