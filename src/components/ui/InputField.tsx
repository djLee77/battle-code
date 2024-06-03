import { UseFormRegisterReturn } from 'react-hook-form';
import styles from 'styles/input-field.module.css';

interface IProps {
  label: string;
  type: string;
  register: UseFormRegisterReturn;
  defaultValue: any;
  error: any;
}

const InputField = (props: IProps) => {
  return (
    <div className={styles['input-box']}>
      <div className={styles.input}>
        <label htmlFor={props.register.name}>{props.label}</label>
        <input
          id={props.register.name}
          {...props.register}
          defaultValue={props.defaultValue}
          type={props.type}
        />
      </div>
      <span
        style={props.error ? { display: 'block' } : { display: 'hidden' }}
        className={styles.error}
      >
        {props.error?.message}
      </span>
    </div>
  );
};

export default InputField;
