import { useState, useEffect } from 'react';
import { IUserStatus } from 'types/roomType';
import ProgressBarComponent from './ProgressBar';
import styles from 'styles/room.module.css';
import emitter from 'utils/eventEmitter';

interface ITestResults {
  id: string;
  percent: number;
  result: string;
}

interface IProps {
  userStatus: IUserStatus[];
  setIsSuccess: (isSuccess: any) => void;
}

const ScoreBoard = (props: IProps) => {
  const [testResults, setTestResults] = useState<ITestResults[]>([]);

  useEffect(() => {
    props.userStatus.map((user) => {
      setTestResults((prevResult: any) => [
        ...prevResult,
        {
          id: user.userId,
          percent: 0,
          result: 'PASS',
        },
      ]);

      props.setIsSuccess((prevSuccess: any) => [
        ...prevSuccess,
        {
          id: user.userId,
          isSuccess: false,
        },
      ]);
    });
  }, []);

  useEffect(() => {
    const handleMessages = (msg: any) => {
      console.log('인게임 : ', msg);
      //게임 시작
      //테스트 케이스 통과율
      if (msg.judgeResult) {
        const { userId, currentTest, totalTests, result } = msg.judgeResult;
        const percent = (currentTest / totalTests) * 100;
        setTestResults((prevResults) =>
          prevResults.map((item) =>
            item.id === userId
              ? {
                  id: userId,
                  percent: percent,
                  result: result,
                }
              : item
          )
        );
        if (percent === 100 && result === 'PASS') {
          props.setIsSuccess((prev: any) =>
            prev.map((user: any) =>
              user.id === userId ? { id: userId, isSuccess: true } : user
            )
          );
        }
      }
      // 유저 퇴장
      if (msg.leaveUserStatus) {
        const leaveUserStatus = msg.leaveUserStatus;
        console.log('유저 퇴장!');
        setTestResults((prevTestResults: any) =>
          prevTestResults.filter(
            (user: any) => user.id !== leaveUserStatus.userId
          )
        );
      }
    };

    emitter.on('message', handleMessages);

    // Cleanup 함수를 사용하여 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      emitter.off('message', handleMessages);
    };
  }, []);

  return (
    <div className={styles.boards}>
      {testResults.map((item) => (
        <div key={item.id} className={styles['score-board']}>
          <div>{item.id}</div>
          <div className={styles['percent-box']}>
            <div style={{ paddingTop: '4px' }}>
              <ProgressBarComponent
                completed={item.percent}
                roundedValue={Math.round(item.percent)}
                result={item.result}
              />
            </div>
            <div style={{ marginLeft: '5px' }}>
              {Math.round(item.percent)}%
              {item.percent === 0
                ? ''
                : item.result === 'FAIL'
                ? '틀렸습니다'
                : item.result === 'PASS' && item.percent === 100
                ? '맞았습니다'
                : '채점중'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
