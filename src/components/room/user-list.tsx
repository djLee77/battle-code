import UserCard from './user-card';
import styles from 'styles/user-list.module.css';
import { IUserStatus } from 'types/room-types';

interface IProps {
  className?: string;
  userStatus: IUserStatus[];
  handleLanguageChange: (userId: string, newLanguage: string) => void;
}

const UserList = ({ userStatus, handleLanguageChange }: IProps) => {
  return (
    <div className={styles['user-list']}>
      {userStatus.map((data) => (
        <UserCard
          key={data.userId}
          data={data}
          handleLanguageChange={handleLanguageChange}
        />
      ))}
    </div>
  );
};

export default UserList;
