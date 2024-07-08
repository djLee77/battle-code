import React from 'react';
import styles from 'styles/room/chat/chat.module.css';
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
        className={props.isRightSideHide ? styles[`chat-hide`] : styles.chat}
      >
        <button
          className={styles[`hide-button`]}
          onClick={() => props.setIsRightSideHide(true)}
          role="img"
          aria-label="arrow-open"
        >
          ▶
        </button>
        <div
          style={{
            paddingLeft: '10px',
            paddingRight: '10px',
            marginTop: '32px',
          }}
        >
          <ChatList messages={props.messages} />
        </div>
      </div>
    </>
  );
});

export default Chat;
