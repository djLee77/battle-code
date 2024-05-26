import UserCard from './user-card';
import styles from 'styles/user-list.module.css';
import { IUserStatus } from 'types/room-types';

interface IProps {
  className?: string;
  userStatus: IUserStatus[];
  roomId: number;
  publishMessage: (destination: string, payload: any) => void;
}

const UserList = (props: IProps) => {
  return (
    <div className={styles['user-list']}>
      {props.userStatus.map((userData) => (
        <UserCard
          key={userData.userId}
          roomId={props.roomId}
          userData={userData}
          userStatus={props.userStatus}
          publishMessage={props.publishMessage}
        />
      ))}
    </div>
  );
};

export default UserList;
