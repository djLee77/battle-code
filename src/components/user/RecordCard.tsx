import styles from 'styles/my-page/record-card.module.css';

interface UsersResult {
  user: string;
  result: string;
}

interface UserTestData {
  matchId: number;
  language: string;
  result: string;
  problemLevel: string;
  elapsedTime: string;
  date: string;
  usersResult: UsersResult[];
}

interface IProps {
  record: UserTestData;
}

const RecordCard = (props: IProps) => {
  const bgColor: any = {
    WIN: '#4157A3',
    DRAW: '#424242',
    LOSE: '#953A3A',
  };

  const resultColor: any = {
    WIN: '#3D7FFF',
    DRAW: '#9C9C9C',
    LOSE: '#FF7070',
  };
  return (
    <div
      className={styles.record}
      style={{ backgroundColor: bgColor[props.record.result] }}
    >
      <div className={styles[`record-result`]}>
        <span>{props.record.date}</span>
        <b style={{ color: resultColor[props.record.result] }}>
          {props.record.result}
        </b>
      </div>
      <div className={styles[`record-user`]}>
        <b>
          {props.record.usersResult.map((user) => (
            <div>{user.user}</div>
          ))}
        </b>
      </div>
      <div className={styles[`record-level`]}>
        <span>난이도:{props.record.problemLevel}</span>
        <span>진행시간:{props.record.elapsedTime}</span>
      </div>
    </div>
  );
};

export default RecordCard;
