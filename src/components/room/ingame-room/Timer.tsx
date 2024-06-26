import React, { useEffect, useState } from 'react';
import styles from 'styles/room/room.module.css';

interface IProps {
  handleGameEnd: () => void;
  limitTime: number;
}

const Timer = React.memo((props: IProps) => {
  const [timeLeft, setTimeLeft] = useState(props.limitTime * 60);

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
    }, 1000);
  }, []);

  return (
    <div>
      <div className={styles.timerBox}>
        <div>{Math.floor(timeLeft / 60)} &nbsp;: </div>
        <div>&nbsp; {timeLeft % 60}</div>
      </div>
    </div>
  );
});

export default Timer;
