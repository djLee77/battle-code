import React, { useEffect, useState } from 'react';
import styles from 'styles/room.module.css';

interface IProps {
  handleGameEnd: () => void;
}

const Timer = React.memo((props: IProps) => {
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          props.handleGameEnd();
          return 0;
        }
        return prevTime - 1;
      });
      console.log(timeLeft);
    }, 1000);
  }, []);

  return (
    <div>
      <div className={styles.timerBox}>
        <div>{Math.floor(timeLeft / 60)} : </div>
        <div>{timeLeft % 60}</div>
      </div>
    </div>
  );
});

export default Timer;
