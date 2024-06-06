import React from 'react';
import MessageItem from './MessageItem';

interface IMessages {
  messageType: string;
  senderId: string;
  message: string;
  sendTime: string;
}

interface IProps {
  messages: IMessages[];
}

const ChatList = React.memo((props: IProps) => {
  return (
    <div>
      {props.messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </div>
  );
});

export default ChatList;
