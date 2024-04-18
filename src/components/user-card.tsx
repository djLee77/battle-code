import styles from "styles/user-card.module.css";
import { UserCardInfo } from "./ui/user-card-info";

export const UserCard = ({ data }: any) => {
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
        <UserCardInfo type="const" name="name" data={data.name} />
        <UserCardInfo type="let" name="lang" data={data.lang} />
        <UserCardInfo type="let" name="isReady" data={data.isReady ? "true" : "false"} />
      </div>
    </div>
  );
};
