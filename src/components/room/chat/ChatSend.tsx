import { useForm } from 'react-hook-form';
import useWebSocketStore from 'store/useWebSocketStore';

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
          id={register.name}
          {...register('message', { required: true })}
          defaultValue=""
          type="text"
          placeholder="Type your message here..."
          onKeyPress={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(sendMessage)();
            }
          }}
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatSend;
