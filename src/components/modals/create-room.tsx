import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CustomButton from "../ui/button";
import styles from "../../styles/create-room.module.css";
import React, { useState } from "react";
import { langData, levelData, limitTImeData } from "../../data/room-setting-data";
import { useForm } from "react-hook-form";
import InputField from "components/input-field";
import SelectField from "components/select-field";
import axios from "axios";
import { getAccessToken } from "utils/cookie";
import { addTab } from "utils/tabs";
import Room from "components/tabs/room";
import useWebSocketStore from "store/websocket-store";

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

type FormValues = {
  title: string;
  pw: string;
  memberCount: number;
  level: string;
  lang: string;
  submissionCount: number;
  limitTime: number;
};

interface IProps {
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default function CreateRoomModal({ dockLayoutRef }: IProps) {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { roomSubscribe } = useWebSocketStore();

  const levelSelectList = levelData;
  const langSelectList = langData;
  const limitTimeSelectList = limitTImeData;

  // 방 생성 함수
  const handleCreateRoom = async (data: any) => {
    try {
      console.log(roomSubscribe);
      if (roomSubscribe.subscription) {
        console.log(roomSubscribe.subscription);
        roomSubscribe.subscription.unsubscribe();
      }
      const accessToken = getAccessToken();
      const response = await axios.post(
        `${serverUrl}v1/gameRoom`,
        {
          hostId: localStorage.getItem("id"),
          title: data.title,
          password: data.pw || null,
          language: data.lang,
          problemLevel: Number(data.level),
          maxUserCount: Number(data.memberCount),
          maxSubmitCount: Number(data.submissionCount),
          limitTime: Number(data.limitTime),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      const roomId = response.data.data.roomStatus.roomId;
      // 방 생성 완료되면 대기방 탭 열고 모달창 닫기
      addTab(`${roomId}번방`, <Room data={response.data.data} dockLayoutRef={dockLayoutRef} />, dockLayoutRef);
      handleClose();
    } catch (error: any) {
      console.error("요청 실패:", error);
    }
  };

  return (
    <div>
      <CustomButton type="button" onClick={handleOpen}>
        방 만들기
      </CustomButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(handleCreateRoom)}>
            <div className={styles.container}>
              <InputField
                label="방 제목"
                type="text"
                register={register("title", {
                  required: "방 제목을 입력해주세요",
                  maxLength: { value: 10, message: "방 제목은 10글자 이하여야합니다." },
                })}
                defaultValue=""
                error={errors.title}
              />
              <InputField
                label="비밀번호"
                type="password"
                register={register("pw")}
                defaultValue=""
                error={errors.pw}
              />

              <InputField
                label="인원 수"
                type="number"
                register={register("memberCount", {
                  required: "인원수는 필수 입력 항목입니다.",
                  min: { value: 2, message: "인원수는 최소 2명입니다." },
                  max: { value: 4, message: "인원수는 최대 4명입니다." },
                })}
                defaultValue={2}
                error={errors.memberCount}
              />

              <SelectField label="난이도" register={register("level")} options={levelSelectList} />
              <SelectField label="언어 설정" register={register("lang")} options={langSelectList} />

              <InputField
                label="제출 횟수"
                type="number"
                register={register("submissionCount", {
                  required: "제출 횟수는 필수 입력 항목입니다.",
                  min: { value: 1, message: "제출 횟수는 최소 1 이어야 합니다." },
                  max: { value: 10, message: "제출 횟수는 최대 10 이어야 합니다." },
                })}
                defaultValue={5}
                error={errors.submissionCount}
              />
              <SelectField label="제한 시간" register={register("limitTime")} options={limitTimeSelectList} />
            </div>
            <div className={styles[`btn-group`]}>
              <CustomButton type="submit">생성</CustomButton>
              <CustomButton size="small" type="button" onClick={handleClose}>
                취소
              </CustomButton>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
