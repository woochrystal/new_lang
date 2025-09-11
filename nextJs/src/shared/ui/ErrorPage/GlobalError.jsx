'use client';
import styles from './GlobalError.module.scss';

export default function GlobalError({ error, reset }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>시스템 오류</h1>
        <p className={styles.message}>예기치 않은 오류가 발생했습니다.</p>
        <button onClick={() => reset()} className={styles.button}>
          다시 시도
        </button>
      </div>
    </div>
  );
}
