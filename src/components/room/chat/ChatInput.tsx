import React, { useState, useEffect } from 'react';
import { Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room/chat/chat-input.module.css';
import alertStyles from 'styles/alert.module.css';
import useAlert from 'hooks/useAlert';

interface IProps {
  roomId: number;
}

type FormValues = {
  message: string;
};

const ChatInput = (props: IProps) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { publishMessage } = useWebSocketStore();
  const { alertOpen, showAlert } = useAlert(false, 3000);

  const sendMessage = (data: FormValues): void => {
    if (data.message.length > 100) {
      showAlert();
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

  return (
    <div style={{ position: 'relative' }}>
      {alertOpen && (
        <Alert variant="filled" severity="error" className={alertStyles.alert}>
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
