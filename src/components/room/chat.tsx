import RoomCustomButton from 'components/ui/RoomCustomButton';
import styles from 'styles/chat.module.css';

interface IProps {
  chatIsHide: boolean;
  setChatIsHide: (chatIsHide: boolean) => void;
}

const Chat = ({ chatIsHide, setChatIsHide }: IProps) => {
  return (
    <div
      className={styles[`chat`]}
      style={chatIsHide ? { display: 'none' } : { display: 'block' }}
    >
      <RoomCustomButton onClick={() => setChatIsHide(!chatIsHide)}>
        {chatIsHide ? '채팅 On' : '채팅 Off'}
      </RoomCustomButton>
      채팅창
    </div>
  );
};

export default Chat;
