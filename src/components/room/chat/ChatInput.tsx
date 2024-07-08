import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room/chat/chat-input.module.css';

interface IProps {
  roomId: number;
}

type FormValues = {
  message: string;
};

const ChatInput = (props: IProps) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { publishMessage } = useWebSocketStore();
  const [alertOpen, setAlertOpen] = useState(false);

  const sendMessage = (data: FormValues): void => {
    if (data.message.length > 100) {
      setAlertOpen(true);
      return;
    }
    if (data.message) {
      publishMessage(`/app/rooms/${props.roomId}/messages`, {
        senderId: localStorage.getItem('id'),
        message: data.message,
      });
      reset();
    }
  };

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

  return (
    <div style={{ position: 'relative' }}>
      {alertOpen && (
        <Alert variant="filled" severity="error" className={styles.alert}>
          채팅 입력 제한 수 100자를 넘겼습니다.
        </Alert>
      )}
      <form
        onSubmit={handleSubmit(sendMessage)}
        style={{ position: 'relative' }}
      >
        <input
          className={styles.input}
          {...register('message', { required: true })}
          defaultValue=""
          type="text"
          onKeyPress={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(sendMessage)();
            }
          }}
          placeholder="채팅 입력"
        />
      </form>
    </div>
  );
};

export default ChatInput;
