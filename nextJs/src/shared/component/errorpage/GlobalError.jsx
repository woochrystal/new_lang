'use client';
import { Main } from '../container/Main';
import { Article } from '../container/Article';
import styles from './Error.module.scss';

const GlobalError = ({ error, reset }) => {
  return (
    <html lang="ko">
      <body>
        <Main className={styles.globalErrorContainer}>
          <Article className={styles.globalErrorContent}>
            <h1 className={styles.globalErrorTitle}>시스템 오류</h1>
            <p className={styles.globalErrorMessage}>예기치 않은 오류가 발생했습니다.</p>
            <button onClick={() => reset()} className={styles.globalErrorButton}>
              다시 시도
            </button>
          </Article>
        </Main>
      </body>
    </html>
  );
};

export default GlobalError;
