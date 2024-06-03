import useWebSocketStore from 'store/useWebSocketStore';
import styles from 'styles/user-card.module.css';
import { IUserStatus } from 'types/roomType';

interface IProps {
  roomId: number;
  userStatus: IUserStatus[];
  userData: IUserStatus;
}

const UserCard = (props: IProps) => {
  const { publishMessage } = useWebSocketStore();

  const handleLanguageChange = (
    userId: string,
    newLanguage: string,
    userStatus: IUserStatus[],
    roomId: number
  ): void => {
    const updateUser = userStatus.find((user) => user.userId === userId);
    if (updateUser) {
      updateUser.language = newLanguage;
      console.log(newLanguage);
      publishMessage(`/app/room/${roomId}/update/user-status`, updateUser);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles[`dot-box`]}>
        <span
          className={styles.dot}
          style={
            props.userData.isReady
              ? { backgroundColor: 'green' }
              : { backgroundColor: 'yellow' }
          }
        />
        <span className={styles.dot} />
      </div>
      <div className={styles[`user-info`]}>
        <div>
          <span className={styles['var-type-color']}>const</span>{' '}
          <span className={styles['var-name-color']}>name</span> ={' '}
          <span className={styles['var-data-color']}>
            '{props.userData.userId}'
          </span>
          ;
        </div>
        <div>
          <span className={styles['var-type-color']}>const</span>{' '}
          <span className={styles['var-name-color']}>lang</span> ={' '}
          {props.userData.userId === localStorage.getItem('id') ? (
            <select
              className={styles.select}
              value={props.userData.language}
              onChange={(event) =>
                handleLanguageChange(
                  props.userData.userId,
                  event.target.value,
                  props.userStatus,
                  props.roomId
                )
              }
            >
              <option value="java">java</option>
              <option value="python">python</option>
              <option value="javascript">javascript</option>
            </select>
          ) : (
            <span className={styles['var-data-color']}>
              '{props.userData.language}'
            </span>
          )}
          ;
        </div>
        <div>
          <span className={styles['var-type-color']}>let</span>{' '}
          <span className={styles['var-name-color']}>isReady</span> ={' '}
          <span className={styles['var-data-color']}>
            '{props.userData.isReady ? 'true' : 'false'}'
          </span>
          ;
        </div>
      </div>
    </div>
  );
};
export default UserCard;
