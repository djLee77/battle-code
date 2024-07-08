import styles from 'styles/room-list/list-card.module.css';
import { IRoomList } from 'types';
import LockIcon from '@mui/icons-material/Lock';
import React from 'react';
import { ReactComponent as LockOpenRightIcon } from '../../assets/icons/lock-open-right.svg';

interface ListCardProps {
  room: IRoomList;
  dockLayoutRef: React.RefObject<any>; // DockLayout 컴포넌트에 대한 RefObject 타입 지정
  setOpenModal: any;
  handleEnterRoom: any;
  setSelectedRoom: any;
}

const ListCard = (props: ListCardProps) => {
  const language =
    props.room.language === 'DEFAULT' ? '상관없음' : props.room.language;

  const handleClickRoom = () => {
    if (props.room.isLocked) {
      props.setOpenModal(true);
      props.setSelectedRoom(props.room);
    } else {
      props.handleEnterRoom(props.room);
    }
  };

  return (
    <div
      className={
        !props.room.isStarted ? styles.wrapper : styles[`wrapper-disabled`]
      }
      onClick={() => !props.room.isStarted && handleClickRoom()}
    >
      <div className={styles[`top-box`]}>
        <h3 className={styles.title}>
          <div style={{ marginRight: '12px' }}>
            {props.room.isLocked ? (
              <LockIcon />
            ) : (
              <LockOpenRightIcon width={21} height={21} fill="white" />
            )}
          </div>
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
        <li>{`제한 시간 : ${props.room.limitTime}분`}</li>
        <li>{`제출 제한 : ${props.room.maxSubmitCount}`}</li>
        <li>{`언어 설정 : ${language}`}</li>
      </ul>
    </div>
  );
};

export default React.memo(ListCard);
