import { lightenColor } from 'utils/lightenColor';
import styles from '../../styles/button.module.css';

interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  type: 'button' | 'submit' | 'reset';
  bgColor?: string;
  children: string;
  onClick?: () => void;
}

const CustomButton = (props: ButtonProps) => {
  // 기본값 할당
  const size = props.size || 'small';
  const type = props.type || 'button';
  const buttonClassName = `${styles.btn} ${styles[size]}`;
  const bgColor = props.bgColor || '#4a4b4c';

  const buttonStyle = {
    backgroundColor: bgColor,
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      className={buttonClassName}
      onClick={props.onClick}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = lightenColor(bgColor, 10))
      }
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
    >
      {props.children}
    </button>
  );
};

export default CustomButton;
