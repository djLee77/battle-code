import React from 'react';
import UserCard from './UserCard';
import styles from 'styles/room/waiting-room/user-list.module.css';
import { IUserStatus } from 'types/roomType';

interface IProps {
  userStatus: IUserStatus[];
  roomId: number;
}

const UserList = (props: IProps) => {
  console.log(props.userStatus);
  return (
    <div className={styles['user-list']}>
      {props.userStatus?.map((userData) => (
        <UserCard
          key={userData.userId}
          roomId={props.roomId}
          userData={userData}
          userStatus={props.userStatus}
        />
      ))}
    </div>
  );
};

export default UserList;
