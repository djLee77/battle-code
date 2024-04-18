import ListCard from "components/list-card";
import { IRoom } from "types";
import styles from "styles/room-list.module.css";
import { roomListData } from "data/room-list-data";
import RoomEntry from "components/room-entry";
import CustomButton from "components/ui/button";
import CreateRoomModal from "components/modals/create-room";
import { useEffect, useState } from "react";

interface RoomListProps {
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default function RoomList({ dockLayoutRef }: RoomListProps) {
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

  return (
    <div className={styles[`list-container`]}>
      <div className={styles.top}>
        <RoomEntry />
        <div className={styles[`btn-group`]}>
          <CustomButton type="button" size="small" onClick={() => {}}>
            방 새로고침
          </CustomButton>
          <CreateRoomModal dockLayoutRef={dockLayoutRef} />
        </div>
      </div>
      <div className={styles.list} style={{ height: viewportHeight * 0.7 }}>
        {roomList.map((room: IRoom) => (
          <ListCard key={room.id} room={room} dockLayoutRef={dockLayoutRef} />
        ))}
      </div>
    </div>
  );
}
