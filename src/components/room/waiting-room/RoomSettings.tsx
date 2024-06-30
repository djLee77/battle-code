import React from 'react';
import styles from 'styles/room-settings.module.css';

interface IProps {
  roomStatus: {
    problemLevel: number;
    maxSubmitCount: number;
    language: string;
    // roomStatus 객체의 타입을 여기에 추가합니다.
  };
}

const RoomSettings = ({ roomStatus }: IProps) => {
  return (
    <div className={styles['room-settings']}>
      <div>
        <p>난이도 : {roomStatus.problemLevel}</p>
        <p>제출 횟수 : {roomStatus.maxSubmitCount}</p>
        <p>언어 설정 : {roomStatus.language}</p>
      </div>
    </div>
  );
};

export default React.memo(RoomSettings);
