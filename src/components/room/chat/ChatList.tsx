import React, { useEffect, useRef } from 'react';
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
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [props.messages]);

  return (
    <div>
      {props.messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      <div ref={messageEndRef}></div>
    </div>
  );
});

export default ChatList;
