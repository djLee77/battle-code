import styles from 'styles/user-card.module.css';
import React from 'react';
import { IRoomStatus, IUserStatus } from 'types/room-types';
import { handleLanguageChange } from 'handler/room';

interface IProps {
  data: IRoomStatus;
  userStatus: IUserStatus[];
  userData: IUserStatus;
  publishMessage: (destination: string, payload: any) => void;
}

const UserCard = ({ data, userStatus, userData, publishMessage }: IProps) => {
  return (
    <div className={styles.container}>
      <div className={styles[`dot-box`]}>
        <span
          className={styles.dot}
          style={
            userData.isReady
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
          <span className={styles['var-data-color']}>'{userData.userId}'</span>;
        </div>
        <div>
          <span className={styles['var-type-color']}>const</span>{' '}
          <span className={styles['var-name-color']}>lang</span> ={' '}
          {userData.userId === localStorage.getItem('id') ? (
            <select
              className={styles.select}
              value={userData.language}
              onChange={(event) =>
                handleLanguageChange(
                  userData.userId,
                  event.target.value,
                  userStatus,
                  data.roomStatus.roomId,
                  publishMessage
                )
              }
            >
              <option value="java">java</option>
              <option value="python">python</option>
              <option value="javascript">javascript</option>
            </select>
          ) : (
            <span className={styles['var-data-color']}>
              '{userData.language}'
            </span>
          )}
          ;
        </div>
        <div>
          <span className={styles['var-type-color']}>let</span>{' '}
          <span className={styles['var-name-color']}>isReady</span> ={' '}
          <span className={styles['var-data-color']}>
            '{userData.isReady ? 'true' : 'false'}'
          </span>
          ;
        </div>
      </div>
    </div>
  );
};
export default React.memo(UserCard);
