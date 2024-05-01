import styles from "styles/user-card-info.module.css";

interface IProps {
  type: string;
  name: string;
  data: string;
}

export const UserCardInfo = ({ type, name, data }: IProps) => {
  return (
    <div>
      <span className={styles["var-type-color"]}>{type}</span> <span className={styles["var-name-color"]}>{name}</span>{" "}
      = <span className={styles["var-data-color"]}>'{data}'</span>;
    </div>
  );
};
