import styles from '../../styles/button.module.css';

interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  type: 'button' | 'submit' | 'reset';
  children: string;
  onClick?: () => void;
}

const CustomButton = (props: ButtonProps) => {
  // 기본값 할당
  const size = props.size || 'small';
  const type = props.type || 'button';
  const buttonClassName = `${styles.btn} ${styles[size]}`;

  return (
    <button type={type} className={buttonClassName} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default CustomButton;
