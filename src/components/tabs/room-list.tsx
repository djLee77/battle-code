import ListCard from 'components/room-list/list-card';
import { IRoomList } from 'types';
import styles from 'styles/room-list.module.css';
import RoomEntry from 'components/room-list/room-entry';
import CustomButton from 'components/ui/button';
import CreateRoomModal from 'components/room-list/create-room';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken } from 'utils/cookie';
import { useQuery } from 'react-query';

interface RoomListProps {
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

const serverUrl = process.env.REACT_APP_SERVER_URL;

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
    return response.data.data;
    // setRoomList(response.data.data);
  } catch (error) {
    console.error(error);
  }
};

export default function RoomList({ dockLayoutRef }: RoomListProps) {
  // const [roomList, setRoomList] = useState([])
  const {
    data: roomList,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery('roomList', getGameRoomList, {
    staleTime: 3000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred!</div>;
  }

  // useEffect(() => {
  //   getGameRoomList;
  // }, []);

  console.log(isLoading, isFetching);

  return (
    <div className={styles[`list-container`]}>
      <div className={styles.top}>
        <RoomEntry />
        <div className={styles[`btn-group`]}>
          <CustomButton type="button" size="small" onClick={refetch}>
            방 새로고침
          </CustomButton>
          <CreateRoomModal dockLayoutRef={dockLayoutRef} />
        </div>
      </div>
      <div className={styles.list}>
        {!roomList.length ? (
          <p>대기방이 존재하지 않습니다.</p>
        ) : (
          roomList.map((room: IRoomList) => (
            <ListCard
              key={room.roomId}
              room={room}
              dockLayoutRef={dockLayoutRef}
            />
          ))
        )}
      </div>
    </div>
  );
}
