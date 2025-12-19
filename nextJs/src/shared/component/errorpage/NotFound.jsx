'use client';
import { A } from '../typography/A';
import { Main } from '../container/Main';
import { Article } from '../container/Article';
import styles from './Error.module.scss';

const NotFound = () => {
  return (
    <Main className={styles.notFoundContainer}>
      <Article className={styles.notFoundContent}>
        <h1 className={styles.notFoundMainTitle}>404</h1>
        <h2 className={styles.notFoundSubTitle}>페이지를 찾을 수 없습니다</h2>
        <p className={styles.notFoundMessage}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <A href="/" className={styles.notFoundButton}>
          홈으로 돌아가기
        </A>
      </Article>
    </Main>
  );
};

export default NotFound;
