import ListCard from "../components/ui/list-card";
import { Room } from "../types";
import styles from "../styles/room-list.module.css";
import Navigation from "../components/navigation";
import { roomListData } from "../data/room-list-data";
import RoomEntry from "../components/room-entry";
import CustomBtn from "../components/ui/button";
import CreateRoomModal from "../components/modals/create-room";

export default function RoomList() {
  const roomList = roomListData; // 테스트 데이터
  return (
    <div>
      <Navigation />
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
        <div className={styles.list}>
          {roomList.map((room: Room) => (
            <ListCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}
