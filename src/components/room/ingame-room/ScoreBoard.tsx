import { useState, useEffect } from 'react';
import { IUserStatus } from 'types/roomType';
import ProgressBarComponent from './ProgressBar';
import styles from 'styles/score-board.module.css';
import emitter from 'utils/eventEmitter';

interface ITestResults {
  id: string;
  percent: number;
  result: string;
}

interface IProps {
  userStatus: IUserStatus[];
  setUsersCorrectStatus: (isCorrect: any) => void;
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

      props.setUsersCorrectStatus((prevCorrect: any) => [
        ...prevCorrect,
        {
          id: user.userId,
          isCorrect: false,
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
          props.setUsersCorrectStatus((prev: any) =>
            prev.map((user: any) =>
              user.id === userId ? { id: userId, isCorrect: true } : user
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
          <div className={styles['test-info']}>
            <div className={styles['user-id']}>{item.id}</div>
            <div className={styles.result}>
              {item.percent === 0 ? (
                ''
              ) : item.result === 'FAIL' ? (
                <span style={{ color: '#DD4124' }}>틀렸습니다</span>
              ) : item.result === 'PASS' && item.percent === 100 ? (
                <span>맞았습니다!</span>
              ) : item.result === 'ERROR' ? (
                <span>ERROR</span>
              ) : (
                `${Math.round(item.percent)}%`
              )}
            </div>
          </div>
          <div className={styles['percent-box']}>
            <div style={{ paddingTop: '4px' }}>
              <ProgressBarComponent
                completed={item.percent}
                roundedValue={Math.round(item.percent)}
                result={item.result}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
