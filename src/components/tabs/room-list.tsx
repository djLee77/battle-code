import ListCard from "components/list-card";
import { Room } from "types";
import styles from "styles/room-list.module.css";
import { roomListData } from "data/room-list-data";
import RoomEntry from "components/room-entry";
import CustomBtn from "components/ui/button";
import CreateRoomModal from "components/modals/create-room";
import { useEffect, useState } from "react";

export default function RoomList() {
  const roomList = roomListData; // 테스트 데이터
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log(viewportHeight);

  return (
    <div className={styles[`list-container`]}>
      <div className={styles.top}>
        <RoomEntry />
        <div className={styles[`btn-group`]}>
          <CustomBtn size="small" onClick={() => {}}>
            방 새로고침
          </CustomBtn>
          <CreateRoomModal />
        </div>
      </div>
      <div className={styles.list} style={{ height: viewportHeight * 0.7 }}>
        {roomList.map((room: Room) => (
          <ListCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
