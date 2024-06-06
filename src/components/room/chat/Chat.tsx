import React, { useState } from 'react';
import styles from 'styles/room/room.module.css';
import ChatList from './ChatList';

interface IProps {
  isRightSideHide: boolean;
  setIsRightSideHide: (isRightSideHide: boolean) => void;
}

const Chat = React.memo((props: IProps) => {
  const [messages, setMessages] = useState([]);

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
        <ChatList messages={messages} />
      </div>
    </>
  );
});

export default Chat;
