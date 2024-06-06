import React, { useCallback, useEffect, useState } from 'react';
import styles from 'styles/room/room.module.css';
import ChatList from './ChatList';

interface IMessages {
  messageType: string;
  senderId: string;
  message: string;
  sendTime: string;
}

interface IProps {
  isRightSideHide: boolean;
  setIsRightSideHide: (isRightSideHide: boolean) => void;
  messages: IMessages[];
  roomId: number;
}

const Chat = React.memo((props: IProps) => {
  return (
    <>
      <div
        className={styles[`chat`]}
        style={
          props.isRightSideHide ? { display: 'none' } : { display: 'block' }
        }
      >
        <p style={{ cursor: 'pointer' }}>
          <span
            onClick={() => props.setIsRightSideHide(true)}
            role="img"
            aria-label="arrow-open"
          >
            ▶
          </span>
        </p>
        <ChatList messages={props.messages} />
      </div>
    </>
  );
});

export default Chat;
