import ListCard from "../ui/list-card";
import { Room } from "../../types";
import styles from "../../styles/room-list.module.css";
import { roomListData } from "../../data/room-list-data";
import RoomEntry from "../room-entry";
import CustomBtn from "../ui/button";
import CreateRoomModal from "../modals/create-room";

export default function RoomList() {
  const roomList = roomListData; // 테스트 데이터
  return (
    <div>
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
