import { levelData } from 'data/roomSettingData';
import React from 'react';
import styles from 'styles/room/waiting-room/room-settings.module.css';

interface IProps {
  roomStatus: {
    problemLevel: string;
    maxSubmitCount: number;
    language: string;
    limitTime: number;
    // roomStatus 객체의 타입을 여기에 추가합니다.
  };
}

const RoomSettings = ({ roomStatus }: IProps) => {
  const language =
    roomStatus.language === 'DEFAULT' ? '상관없음' : roomStatus.language;
  console.log(roomStatus);
  return (
    <div className={styles['room-settings']}>
      <div>
        <p>난이도 : {roomStatus.problemLevel}</p>
        <p>제출 횟수 : {roomStatus.maxSubmitCount}</p>
        <p>언어 설정 : {language}</p>
        <p>제한 시간 : {roomStatus.limitTime}분</p>
      </div>
    </div>
  );
};

export default React.memo(RoomSettings);
