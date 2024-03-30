import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CustomBtn from "../ui/button";
import styles from "../../styles/create-room.module.css";
import React, { useState } from "react";
import { langData, levelData, limitTImeData } from "../../data/room-setting-data";

// 모달 창 스타일
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  backgroundColor: "#2D2C2C",
  border: "1px solid #000",
  borderRadius: "24px",
  color: "white",
  boxShadow: 24,
  p: 4,
};

// select option 타입
type Option = {
  value: string;
  name: string;
};

//setState 타입
type SetStateNumberAction = React.Dispatch<React.SetStateAction<number>>;

// input change event 타입
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function CreateRoomModal() {
  const [title, setTitle] = useState("");
  const [pw, setPW] = useState("");
  const [memberCount, setMemberCount] = useState(2);
  const [level, setLevel] = useState("상관없음");
  const [lang, setLang] = useState("상관없음");
  const [submissionCount, setSubmissionCount] = useState(5);
  const [limitTime, setlimitTime] = useState("15분");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const levelSelectList = levelData;
  const langSelectList = langData;
  const limitTimeSelectList = limitTImeData;

  // 숫자 제한 함수
  const handleNumChange = (e: ChangeEvent, set: SetStateNumberAction, max: number, min: number) => {
    let value = parseInt(e.target.value);
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    set(value);
  };

  return (
    <div>
      <CustomBtn onClick={handleOpen}>방 만들기</CustomBtn>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={styles.container}>
            <label htmlFor="title">방 제목 </label>
            <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label htmlFor="password">비밀번호 </label>
            <input type="password" id="password" name="password" value={pw} onChange={(e) => setPW(e.target.value)} />

            <label htmlFor="member_count">인원 수 </label>
            <input
              type="number"
              max="5"
              min="2"
              id="member_count"
              name="member_count"
              value={memberCount}
              onChange={(e) => handleNumChange(e, setMemberCount, 5, 2)}
            />

            <label htmlFor="level">난이도 </label>
            <select id="level" name="level" value={level} onChange={(e) => setLevel(e.target.value)}>
              {levelSelectList.map((item: Option) => (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              ))}
            </select>

            <label htmlFor="lang">언어 설정 </label>
            <select id="level" name="level" value={lang} onChange={(e) => setLang(e.target.value)}>
              {langSelectList.map((item: Option) => (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              ))}
            </select>

            <label htmlFor="submisson_count">제출 횟수 </label>
            <input
              type="number"
              id="submisson_count"
              name="submisson_count"
              value={submissionCount}
              onChange={(e) => handleNumChange(e, setSubmissionCount, 10, 1)}
            />

            <label htmlFor="limit_time">제한 시간 </label>
            <select id="level" name="level" value={limitTime} onChange={(e) => setlimitTime(e.target.value)}>
              {limitTimeSelectList.map((item: Option) => (
                <option value={item.value} key={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles[`btn-group`]}>
            <CustomBtn size="small">생성</CustomBtn>
            <CustomBtn size="small" onClick={handleClose}>
              취소
            </CustomBtn>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
