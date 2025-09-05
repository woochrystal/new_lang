'use client';
import styles from './Error.module.scss';

export default function Error({ error, reset }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>오류가 발생했습니다</h1>
        <p className={styles.message}>잠시 후 다시 시도해 주세요.</p>
        <button onClick={() => reset()} className={styles.button}>
          다시 시도
        </button>
      </div>
    </div>
  );
}
