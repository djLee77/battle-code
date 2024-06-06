import React, { useState } from 'react';

import styles from 'styles/room/room.module.css';
import ChatList from './ChatList';

const Chat = React.memo(() => {
  const [isHide, setIsHide] = useState<boolean>(false);
  const [messages, setMessages] = useState([]);

  return (
    <>
      {!isHide ? (
        <div className={styles.rightSide}>
          <div className={styles.rightBody}>
            <div
              className={styles[`chat`]}
              style={isHide ? { display: 'none' } : { display: 'block' }}
            >
              <p style={{ cursor: 'pointer' }}>
                <span
                  onClick={() => setIsHide(true)}
                  role="img"
                  aria-label="arrow-open"
                >
                  ▶
                </span>
              </p>
              <ChatList messages={messages} />
            </div>
          </div>
          <div className={styles.rightFooter}>입력창</div>
        </div>
      ) : (
        <div className={styles.hideRight}>
          <p style={{ cursor: 'pointer' }}>
            <span
              onClick={() => setIsHide(false)}
              role="img"
              aria-label="arrow-open"
            >
              ◀
            </span>
          </p>
        </div>
      )}
    </>
  );
});

export default Chat;
