import ListCard from "../components/ui/list-card";
import { Room } from "../types";
import styles from "../styles/room-list.module.css";
import Navigation from "../components/navigation";
import { roomListData } from "../data/room-list-data";
import RoomEntry from "../components/room-entry";

export default function RoomList() {
  const roomList = roomListData; // 테스트 데이터
  return (
    <div>
      <Navigation />
      <div className={styles[`list-container`]}>
        <div className={styles.top}>
          <RoomEntry />
          <div>
            <button>방 새로고침</button>
            <button>방 만들기</button>
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
