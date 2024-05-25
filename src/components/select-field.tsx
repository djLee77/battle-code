import { UseFormRegisterReturn } from 'react-hook-form';
import styles from 'styles/select-field.module.css';

// select option 타입
type Option = {
  value: string | number;
  name: string;
};

export default function SelectField({
  label,
  register,
  options,
}: {
  label: string;
  register: UseFormRegisterReturn;
  options: Option[];
}) {
  return (
    <div className={styles['select-box']}>
      <div className={styles.select}>
        <label htmlFor={register.name}>{label} </label>
        <select id={register.name} {...register}>
          {options.map((item: Option) => (
            <option value={item.value} key={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
