// CustomButton.js

import React from 'react';
import styles from 'styles/room-button.module.css';

interface IProps {
  onClick: () => void;
  disabled?: boolean;
  children: string;
}

const RoomCustomButton = ({ onClick, disabled = false, children }: IProps) => {
  return (
    <button
      className={disabled ? styles['button-disabled'] : styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default RoomCustomButton;
