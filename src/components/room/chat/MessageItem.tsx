import React from 'react';

interface IMessage {
  messageType: string;
  senderId: string;
  message: string;
  sendTime: string;
}

interface IProps {
  message: IMessage;
}

const MessageItem = React.memo((props: IProps) => {
  const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          color: stringToColor(props.message.senderId),
          marginRight: '12px',
        }}
      >
        {props.message.senderId}
      </div>
      {props.message.message}
    </div>
  );
});

export default MessageItem;
