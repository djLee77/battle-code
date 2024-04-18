import LockOpenIcon from "@mui/icons-material/LockOpen";
import styles from "styles/list-card.module.css";
import { IRoom } from "types";
import { addTab } from "utils/tabs";
import Room from "./tabs/room";
import React from "react";

interface ListCardProps {
  room: IRoom;
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default React.memo(function ListCard({ room, dockLayoutRef }: ListCardProps) {
  const onClickRoom = () => {
    console.log("click");
    addTab(`${room.id}번방`, <Room roomId={room.id} dockLayoutRef={dockLayoutRef} />, dockLayoutRef);
  };

  return (
    <div
      className={room.isWait ? styles.wrapper : styles[`wrapper-disabled`]}
      onClick={() => room.isWait && onClickRoom()}
    >
      <div className={styles[`top-box`]}>
        <h3 className={styles.title}>
          <LockOpenIcon sx={{ marginRight: "12px" }} />
          {`#${room.id}. ${room.title}`}
        </h3>
        <div className={styles[`status-box`]}>
          <span>{room.isWait ? "대기중" : "게임중"}</span>
          <h4>{room.members}</h4>
        </div>
      </div>
      <ul className={styles[`option-list`]}>
        <li>{`난이도 : ${room.settings.difficulty}`}</li>
        <li>{`제한 시간 : ${room.settings.timeLimit}`}</li>
        <li>{`제출 제한 : ${room.settings.numOfSubmissions}`}</li>
        <li>{`언어 설정 : ${room.settings.lang}`}</li>
      </ul>
    </div>
  );
});
