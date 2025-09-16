'use client';
import styles from '@/shared/ui/Input/radioCustom.module.scss';

export default function RadioButton({ name, value, checked, onChange, radioTit }) {
  return (
    <label className={`${styles.radioCustom} ${styles.radioButton}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span>{radioTit}</span>
    </label>
  );
}
