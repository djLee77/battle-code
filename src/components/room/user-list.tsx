import UserCard from './user-card';
import styles from 'styles/user-list.module.css';
import { IRoomStatus, IUserStatus } from 'types/room-types';

interface IProps {
  userStatus: IUserStatus[];
  data: IRoomStatus;
  publishMessage: (destination: string, payload: any) => void;
}

const UserList = ({ userStatus, data, publishMessage }: IProps) => {
  return (
    <div className={styles['user-list']}>
      {userStatus.map((userData) => (
        <UserCard
          key={userData.userId}
          data={data}
          userData={userData}
          userStatus={userStatus}
          publishMessage={publishMessage}
        />
      ))}
    </div>
  );
};

export default UserList;
