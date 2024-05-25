import styles from '../../styles/button.module.css';

interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  type: 'button' | 'submit' | 'reset';
  children: string;
  onClick?: () => void;
}

const CustomButton = ({
  size = 'small',
  type = 'button',
  children,
  onClick,
}: ButtonProps) => {
  const buttonClassName = `${styles.btn} ${styles[size]}`;

  return (
    <button type={type} className={buttonClassName} onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomButton;
