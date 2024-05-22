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

const ListCard = (props: ListCardProps) => {
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
        <Room data={response.data.data} dockLayoutRef={props.dockLayoutRef} />,
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

  return (
    <div
      className={
        !props.room.isStarted ? styles.wrapper : styles[`wrapper-disabled`]
      }
      onClick={() =>
        !props.room.isStarted && handleEnterRoom(props.room.roomId)
      }
    >
      <div className={styles[`top-box`]}>
        <h3 className={styles.title}>
          <LockOpenIcon sx={{ marginRight: '12px' }} />
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
  );
};

export default React.memo(ListCard);
