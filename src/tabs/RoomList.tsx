import React, { useEffect, useState } from 'react';
import ListCard from 'components/room-list/ListCard';
import { IRoomList } from 'types';
import styles from 'styles/room-list/room-list.module.css';
import SearchRoom from 'components/room-list/SearchRoom';
import CustomButton from 'components/ui/CustomButton';
import CreateRoomModal from 'components/room-list/CreateRoomModal';
import api from 'utils/axios';
import DockLayout from 'rc-dock';
import useWebSocketStore from 'store/useWebSocketStore';
import Room from './Room';
import { addTab } from 'utils/tabs';
import PasswordModal from 'components/room-list/PasswordModal';
import alertStyles from 'styles/alert.module.css';
import { Alert } from '@mui/material';
import useAlert from 'hooks/useAlert';

interface RoomListProps {
  dockLayoutRef: React.RefObject<DockLayout>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

const RoomList = ({ dockLayoutRef }: RoomListProps) => {
  const [roomList, setRoomList] = useState<IRoomList[]>([]);
  const [filteredRoomList, setFilteredRoomList] = useState<IRoomList[]>([]);
  const [password, setPassword] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<IRoomList>();
  const { alertOpen, showAlert } = useAlert(false, 3000);
  const { unsubscribe } = useWebSocketStore();

  useEffect(() => {
    getGameRoomList();
  }, []);

  useEffect(() => {
    const filteredRooms = roomList.filter((room) =>
      room.roomId.toString().includes(searchValue)
    );
    setFilteredRoomList(filteredRooms);
  }, [searchValue, roomList]);

  // 대기방 목록 불러오는 함수
  const getGameRoomList = async () => {
    try {
      const response = await api.get(`v1/roomLists`);
      console.log(response);
      const rooms = response.data.data.slice(1); // Remove default room
      setRoomList(rooms);
      setFilteredRoomList(rooms);
    } catch (error) {
      console.error('Failed to fetch room list:', error);
    }
  };

  const handleEnterRoom = async (room: any) => {
    if (room.isLocked) setOpenModal(false);
    try {
      const response = await api.post(`v1/rooms/${room.roomId}/enter`, {
        userId: localStorage.getItem('id'),
        roomId: room.roomId,
        password: password,
      });
      console.log(response);
      if (response.status === 200) {
        unsubscribe('room');
        // 방 생성 완료되면 대기방 탭 열고 모달창 닫기
        addTab(
          `${room.roomId}번방`,
          <Room data={response.data.data} dockLayoutRef={dockLayoutRef} />,
          dockLayoutRef
        );
      }
    } catch (error) {
      showAlert();
      getGameRoomList();
      console.error('Failed to enter room:', error);
    }
  };

  return (
    <>
      {alertOpen && (
        <Alert
          variant="filled"
          severity="error"
          className={alertStyles[`alert-top`]}
        >
          방 입장에 실패했습니다.
        </Alert>
      )}{' '}
      <div className={styles[`list-container`]}>
        <div className={styles.top}>
          <SearchRoom value={searchValue} onChange={setSearchValue} />
          <div className={styles[`btn-group`]}>
            <CustomButton type="button" size="small" onClick={getGameRoomList}>
              방 새로고침
            </CustomButton>
            <CreateRoomModal dockLayoutRef={dockLayoutRef} />
          </div>
        </div>
        <div className={styles.list}>
          {!filteredRoomList.length ? (
            <p>대기방이 존재하지 않습니다.</p>
          ) : (
            filteredRoomList.map((room: IRoomList) => (
              <ListCard
                key={room.roomId}
                room={room}
                dockLayoutRef={dockLayoutRef}
                setOpenModal={setOpenModal}
                handleEnterRoom={handleEnterRoom}
                setSelectedRoom={setSelectedRoom}
              />
            ))
          )}
        </div>
      </div>
      <PasswordModal
        password={password}
        setPassword={setPassword}
        open={openModal}
        setOpen={setOpenModal}
        handleEnterRoom={handleEnterRoom}
        selectedRoom={selectedRoom}
      />
    </>
  );
};

export default RoomList;
