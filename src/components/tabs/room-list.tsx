import ListCard from "components/list-card";
import { IRoomList } from "types";
import styles from "styles/room-list.module.css";
import RoomEntry from "components/room-entry";
import CustomButton from "components/ui/button";
import CreateRoomModal from "components/modals/create-room";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "utils/cookie";

interface RoomListProps {
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default function RoomList({ dockLayoutRef }: RoomListProps) {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const [roomList, setRoomList] = useState([]);

  // 대기방 목록 불러오는 함수
  const getGameRoomList = async () => {
    const accessToken = getAccessToken();
    try {
      const response = await axios.get(`${serverUrl}v1/gameRoomList`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      response.data.data.shift(); // default 방 제거
      setRoomList(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGameRoomList();
  }, []);

  return (
    <div className={styles[`list-container`]}>
      <div className={styles.top}>
        <RoomEntry />
        <div className={styles[`btn-group`]}>
          <CustomButton type="button" size="small" onClick={getGameRoomList}>
            방 새로고침
          </CustomButton>
          <CreateRoomModal dockLayoutRef={dockLayoutRef} />
        </div>
      </div>
      <div className={styles.list}>
        {roomList.length === 0 ? (
          <p>대기방이 존재하지 않습니다.</p>
        ) : (
          roomList.map((room: IRoomList) => <ListCard key={room.roomId} room={room} dockLayoutRef={dockLayoutRef} />)
        )}
      </div>
    </div>
  );
}
