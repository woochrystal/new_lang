'use client';
import styles from '@/shared/ui/Input/radioCustom.module.scss';

export default function RadioCircle({ name, value, checked, onChange, radioTit }) {
  return (
    <label className={styles.radioCustom}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className={styles.circle}>
          <rect x="1.5" y="1.5" width="17" height="17" rx="8.5" />
          <rect x="5" y="5" width="10" height="10" rx="5" className={styles.circleOn} />
        </svg>
        {radioTit}
      </span>
    </label>
  );
}
