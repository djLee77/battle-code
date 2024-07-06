// CustomButton.js
import React from 'react';
import styles from 'styles/room/room-button.module.css';
import { lightenColor } from 'utils/lightenColor';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  children: string;
  bgColor?: string;
}

const RoomCustomButton = React.memo((props: IProps) => {
  const disabled = props.disabled || false;
  const bgColor = props.bgColor || '#313131';

  const buttonStyle = {
    backgroundColor: bgColor,
    ...(disabled && { cursor: 'not-allowed' }),
  };

  return (
    <button
      style={buttonStyle}
      className={`${styles.button} ${
        disabled ? styles['button-disabled'] : ''
      }`}
      onClick={props.onClick}
      disabled={disabled}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = lightenColor(bgColor, 10))
      }
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
    >
      {props.children}
    </button>
  );
});

export default RoomCustomButton;
