import styles from "../../styles/button.module.css";

interface ButtonProps {
  size?: "small" | "medium" | "large";
  children: string;
  backgroundColor?: string;
  onClick?: () => void;
}

const CustomBtn = ({ size = "small", children, onClick }: ButtonProps) => {
  const buttonClassName = `${styles.btn} ${styles[size]}`;

  return (
    <button className={buttonClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomBtn;
