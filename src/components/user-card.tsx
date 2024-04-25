import styles from "styles/user-card.module.css";
import { UserCardInfo } from "./ui/user-card-info";
import React from "react";

const UserCard = ({ data }: any) => (
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
      <UserCardInfo type="let" name="lang" data={data.language} />
      <UserCardInfo type="let" name="isReady" data={data.isReady ? "true" : "false"} />
    </div>
  </div>
);

export default React.memo(UserCard);
