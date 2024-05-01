import styles from "styles/user-card.module.css";
import { UserCardInfo } from "./user-card-info";
import React from "react";
import { IUserStatus } from "types/room-types";

interface IProps {
  data: IUserStatus;
  handleLanguageChange: any;
}

const UserCard = ({ data, handleLanguageChange }: IProps) => {
  return (
    <div className={styles.container}>
      <div className={styles[`dot-box`]}>
        <span
          className={styles.dot}
          style={data.isReady ? { backgroundColor: "green" } : { backgroundColor: "yellow" }}
        />
        <span className={styles.dot} />
      </div>
      <div className={styles[`user-info`]}>
        <UserCardInfo type="const" name="name" data={data.userId} />
        <div>
          <span className={styles["var-type-color"]}>const</span> <span className={styles["var-name-color"]}>lang</span>{" "}
          ={" "}
          {data.userId === localStorage.getItem("id") ? (
            <select value={data.language} onChange={(event) => handleLanguageChange(data.userId, event.target.value)}>
              <option value="java">java</option>
              <option value="python">python</option>
              <option value="javascript">javascript</option>
            </select>
          ) : (
            <span className={styles["var-data-color"]}>'{data.language}'</span>
          )}
          ;
        </div>
        <UserCardInfo type="let" name="isReady" data={data.isReady ? "true" : "false"} />
      </div>
    </div>
  );
};
export default React.memo(UserCard);
