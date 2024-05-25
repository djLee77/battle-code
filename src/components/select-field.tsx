import { UseFormRegisterReturn } from 'react-hook-form';
import styles from 'styles/select-field.module.css';

interface IProps {
  label: string;
  register: UseFormRegisterReturn;
  options: Option[];
}

// select option 타입
type Option = {
  value: string | number;
  name: string;
};

const SelectField = (props: IProps) => {
  return (
    <div className={styles['select-box']}>
      <div className={styles.select}>
        <label htmlFor={props.register.name}>{props.label} </label>
        <select id={props.register.name} {...props.register}>
          {props.options.map((item: Option) => (
            <option value={item.value} key={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
