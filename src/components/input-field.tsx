import { UseFormRegisterReturn } from "react-hook-form";
import styles from "styles/input-field.module.css";

export default function InputField({
  label,
  type,
  register,
  defaultValue,
  error,
}: {
  label: string;
  type: string;
  register: UseFormRegisterReturn;
  defaultValue: any;
  error: any;
}) {
  return (
    <div className={styles["input-box"]}>
      <div className={styles.input}>
        <label htmlFor={register.name}>{label}</label>
        <input id={register.name} {...register} defaultValue={defaultValue} type={type} />
      </div>
      <span style={error ? { display: "block" } : { display: "hidden" }} className={styles.error}>
        {error?.message}
      </span>
    </div>
  );
}
