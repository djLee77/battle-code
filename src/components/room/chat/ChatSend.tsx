import { useForm } from 'react-hook-form';
import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/room/chat/chat-send.module.css';

interface IProps {
  roomId: number;
}

type FormValues = {
  message: string;
};

const ChatSend = (props: IProps) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { publishMessage } = useWebSocketStore();

  const sendMessage = (data: FormValues): void => {
    console.log(data.message);
    if (data.message) {
      publishMessage(`/app/rooms/${props.roomId}/messages`, {
        senderId: localStorage.getItem('id'),
        message: data.message,
      });
      reset();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(sendMessage)}>
        <input
          className={styles[`input`]}
          id={register.name}
          {...register('message', { required: true })}
          defaultValue=""
          type="text"
          placeholder="메시지 입력"
          onKeyPress={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(sendMessage)();
            }
          }}
        />
      </form>
    </div>
  );
};

export default ChatSend;
