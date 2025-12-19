'use client';
import Button from '../button/Button';
import { Main } from '../container/Main';
import { Article } from '../container/Article';
import styles from './Error.module.scss';

const Error = ({ error, reset }) => {
  return (
    <Main className={styles.errorContainer}>
      <Article className={styles.errorContent}>
        <h1 className={styles.errorTitle}>오류가 발생했습니다</h1>
        <p className={styles.errorMessage}>잠시 후 다시 시도해 주세요.</p>
        <button onClick={() => reset()} className={styles.errorButton}>
          다시 시도
        </button>
      </Article>
    </Main>
  );
};

export default Error;
