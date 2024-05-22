import CircleProgress from 'components/user/circle';
import RecordCard from 'components/user/record-card';
import CustomButton from 'components/ui/button';
import { userData } from 'data/user-data';
import { useEffect, useMemo, useState } from 'react';
import styles from 'styles/user.module.css';

interface BattleRecord {
  otherUser: string;
  date: string;
  result: string; // 가능한 결과
  level: string;
  playTime: string;
}

interface UserTestData {
  name: string;
  rank: number;
  useTheme: string;
  battleRecordList: BattleRecord[];
}

const User = () => {
  const [userTestData, setUserTestData] = useState<UserTestData>({
    name: '',
    rank: 0,
    useTheme: '',
    battleRecordList: [],
  });

  useEffect(() => {
    setUserTestData(userData);
    console.log('첫마운트');
  }, []);

  const { winCount, drawCount, lossCount } = useMemo(() => {
    let wins = 0,
      draws = 0,
      losses = 0;

    for (const record of userTestData.battleRecordList) {
      switch (record.result) {
        case 'Perfect Win':
        case 'Win':
          wins++;
          break;
        case 'Draw':
          draws++;
          break;
        case 'Lose':
          losses++;
          break;
        default:
          break;
      }
    }

    return { winCount: wins, drawCount: draws, lossCount: losses };
  }, [userTestData]);

  return (
    <div className={styles[`user-container`]}>
      <div className={styles[`user-info`]}>
        <h2>{userTestData.name}</h2>
        <span>랭킹:{userTestData.rank}위</span>
      </div>
      <div>
        <span>사용 테마 : {userTestData.useTheme}</span>
        <CustomButton type="button" size="small">
          테마 변경
        </CustomButton>
      </div>
      <div className={styles[`record-container`]}>
        <div className={styles[`circle-box`]}>
          <h4>
            {userTestData.battleRecordList.length}전 {winCount}승 {drawCount}무{' '}
            {lossCount}패
          </h4>
          <CircleProgress
            progress={(winCount / userTestData.battleRecordList.length) * 100}
            size={300}
            strokeWidth={40}
            circleColor="#FF5F58"
            progressColor="#3278FF"
          />
        </div>
        <div className={styles[`record-box`]}>
          {userTestData.battleRecordList.map((record: any, idx: number) => (
            <RecordCard key={idx} record={record} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default User;
