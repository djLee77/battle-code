import LockOpenIcon from '@mui/icons-material/LockOpen';
import styles from 'styles/list-card.module.css';
import { IRoomList } from 'types';
import { addTab } from 'utils/tabs';
import React, { useState } from 'react';
import api from 'utils/axios';
import useWebSocketStore from 'store/useWebSocketStore';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import RoomCopy from 'tabs/Room';

interface ListCardProps {
  room: IRoomList;
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

const ListCard = (props: ListCardProps) => {
  const [password, setPassword] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { roomSubscribe } = useWebSocketStore();

  const handleEnterRoom = async () => {
    if (props.room.isLocked) setOpenModal(false);
    try {
      console.log(roomSubscribe);
      if (roomSubscribe.subscription) {
        console.log(roomSubscribe.subscription);
        roomSubscribe.subscription.unsubscribe();
      }
      const response = await api.post(`v1/room/enter`, {
        userId: localStorage.getItem('id'),
        roomId: props.room.roomId,
        password: password,
      });
      console.log(response);
      // 방 생성 완료되면 대기방 탭 열고 모달창 닫기
      addTab(
        `${props.room.roomId}번방`,
        <RoomCopy
          data={response.data.data}
          dockLayoutRef={props.dockLayoutRef}
        />,
        props.dockLayoutRef
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('요청 실패:', error.message); // Error 인스턴스라면 message 속성을 사용
      } else {
        console.error('알 수 없는 에러:', error);
      }
    }
  };

  const handleClickRoom = () => {
    if (props.room.isLocked) {
      setOpenModal(true);
    } else {
      handleEnterRoom();
    }
  };

  return (
    <>
      <div
        className={
          !props.room.isStarted ? styles.wrapper : styles[`wrapper-disabled`]
        }
        onClick={() => !props.room.isStarted && handleClickRoom()}
      >
        <div className={styles[`top-box`]}>
          <h3 className={styles.title}>
            {props.room.isLocked ? (
              <LockIcon sx={{ marginRight: '12px' }} />
            ) : (
              <LockOpenIcon sx={{ marginRight: '12px' }} />
            )}
            {`#${props.room.roomId}. ${props.room.title}`}
          </h3>
          <div className={styles[`status-box`]}>
            <span>{!props.room.isStarted ? '대기중' : '게임중'}</span>
            <h4>
              {props.room.countUsersInRoom} / {props.room.maxUserCount}
            </h4>
          </div>
        </div>
        <ul className={styles[`option-list`]}>
          <li>{`난이도 : ${props.room.problemLevel}`}</li>
          <li>{`제한 시간 : ${props.room.limitTime}`}</li>
          <li>{`제출 제한 : ${props.room.maxSubmitCount}`}</li>
          <li>{`언어 설정 : ${props.room.language}`}</li>
        </ul>
      </div>
      <PasswordModal
        password={password}
        setPassword={setPassword}
        open={openModal}
        setOpen={setOpenModal}
        handleEnterRoom={handleEnterRoom}
      />
    </>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  backgroundColor: '#2D2C2C',
  border: '1px solid #000',
  borderRadius: '24px',
  color: 'white',
  boxShadow: 24,
  p: 4,
};

const PasswordModal = (props: any) => {
  const handleClose = () => props.setOpen(false);

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h4>비밀번호 입력</h4>
          <input
            type="password"
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
          />
          <div>
            <RoomCustomButton onClick={props.handleEnterRoom}>
              입장
            </RoomCustomButton>
            <RoomCustomButton onClick={handleClose}>취소</RoomCustomButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default React.memo(ListCard);
