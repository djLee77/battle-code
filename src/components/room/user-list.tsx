import UserCard from './user-card';
import styles from 'styles/user-list.module.css';
import { IRoomStatus, IUserStatus } from 'types/room-types';

interface IProps {
  userStatus: IUserStatus[];
  data: IRoomStatus;
  publishMessage: (destination: string, payload: any) => void;
}

const UserList = (props: IProps) => {
  return (
    <div className={styles['user-list']}>
      {props.userStatus.map((userData) => (
        <UserCard
          key={userData.userId}
          data={props.data}
          userData={userData}
          userStatus={props.userStatus}
          publishMessage={props.publishMessage}
        />
      ))}
    </div>
  );
};

export default UserList;
