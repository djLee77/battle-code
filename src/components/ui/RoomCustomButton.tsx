// CustomButton.js
import styles from 'styles/room-button.module.css';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  children: string;
}

const RoomCustomButton = (props: IProps) => {
  const disabled = props.disabled || false;

  return (
    <button
      className={disabled ? styles['button-disabled'] : styles.button}
      onClick={props.onClick}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
};

export default RoomCustomButton;