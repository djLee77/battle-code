import LockOpenIcon from '@mui/icons-material/LockOpen';
import styles from 'styles/list-card.module.css';
import { IRoomList } from 'types';
import { addTab } from 'utils/tabs';
import Room from '../tabs/room';
import React from 'react';
import api from 'utils/axios';
import useWebSocketStore from 'store/websocket-store';

interface ListCardProps {
  room: IRoomList;
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
}

export default React.memo(function ListCard({
  room,
  dockLayoutRef,
}: ListCardProps) {
  const { roomSubscribe } = useWebSocketStore();
  const handleEnterRoom = async (roomId: number) => {
    console.log('click');
    try {
      console.log(roomSubscribe);
      if (roomSubscribe.subscription) {
        console.log(roomSubscribe.subscription);
        roomSubscribe.subscription.unsubscribe();
      }
      const response = await api.post(`v1/gameRoom/enter`, {
        userId: localStorage.getItem('id'),
        roomId: roomId,
      });
      console.log(response);
      // 방 생성 완료되면 대기방 탭 열고 모달창 닫기
      addTab(
        `${roomId}번방`,
        <Room data={response.data.data} dockLayoutRef={dockLayoutRef} />,
        dockLayoutRef
      );
    } catch (error: any) {
      console.error('요청 실패:', error.response);
    }
  };

  return (
    <div
      className={!room.isStarted ? styles.wrapper : styles[`wrapper-disabled`]}
      onClick={() => !room.isStarted && handleEnterRoom(room.roomId)}
    >
      <div className={styles[`top-box`]}>
        <h3 className={styles.title}>
          <LockOpenIcon sx={{ marginRight: '12px' }} />
          {`#${room.roomId}. ${room.title}`}
        </h3>
        <div className={styles[`status-box`]}>
          <span>{!room.isStarted ? '대기중' : '게임중'}</span>
          <h4>
            {room.countUsersInRoom} / {room.maxUserCount}
          </h4>
        </div>
      </div>
      <ul className={styles[`option-list`]}>
        <li>{`난이도 : ${room.problemLevel}`}</li>
        <li>{`제한 시간 : ${room.limitTime}`}</li>
        <li>{`제출 제한 : ${room.maxSubmitCount}`}</li>
        <li>{`언어 설정 : ${room.language}`}</li>
      </ul>
    </div>
  );
});
