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
      <p style={{ cursor: 'pointer' }}>
        <span
          onClick={() => setChatIsHide(true)}
          role="img"
          aria-label="arrow-open"
        >
          ▶
        </span>
      </p>
    </div>
  );
};

export default Chat;
