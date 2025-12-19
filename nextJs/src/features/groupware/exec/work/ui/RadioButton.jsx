'use client';
import styles from '@/shared/ui/Input/radioCustom.module.scss';

export default function RadioButton({ value, onChange, disabled }) {
  const name = 'radio periodType';

  const radioValChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={styles.radioBox}>
      <label className={`${styles.radioCustom} ${styles.radioButton}`}>
        <input
          type="radio"
          name={name}
          value={'1M'}
          checked={value === '1M'}
          onChange={() => radioValChange('1M')}
          disabled={disabled}
        />
        <span className={styles.radioIndicator}>
          <span>{'1개월'}</span>
        </span>
      </label>
      <label className={`${styles.radioCustom} ${styles.radioButton}`}>
        <input type="radio" name={name} value={'3M'} checked={value === '3M'} onChange={() => radioValChange('3M')} />
        <span className={styles.radioIndicator}>
          <span>{'3개월'}</span>
        </span>
      </label>
      <label className={`${styles.radioCustom} ${styles.radioButton}`}>
        <input type="radio" name={name} value={'6M'} checked={value === '6M'} onChange={() => radioValChange('6M')} />
        <span className={styles.radioIndicator}>
          <span>{'6개월'}</span>
        </span>
      </label>
      <label className={`${styles.radioCustom} ${styles.radioButton}`}>
        <input type="radio" name={name} value={'1Y'} checked={value === '1Y'} onChange={() => radioValChange('1Y')} />
        <span className={styles.radioIndicator}>
          <span>{'1년'}</span>
        </span>
      </label>
    </div>
  );
}
