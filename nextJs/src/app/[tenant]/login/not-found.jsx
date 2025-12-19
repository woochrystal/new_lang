'use client';
import { A } from '@/shared/component/typography/A';
import { Main } from '@/shared/component/container/Main';
import { Article } from '@/shared/component/container/Article';
import styles from '@/shared/component/errorpage/Error.module.scss';

/**
 * 테넌트별 404 페이지
 * notFound() 함수 호출 시 렌더링됨
 */
const TenantNotFound = () => {
  return (
    <Main className={styles.notFoundContainer}>
      <Article className={styles.notFoundContent}>
        <h1 className={styles.notFoundMainTitle}>404</h1>
        <h2 className={styles.notFoundSubTitle}>페이지를 찾을 수 없습니다</h2>
        <p className={styles.notFoundMessage}>
          요청하신 페이지가 존재하지 않습니다.
          <br className="hidden sm:block" />
          주소를 다시 확인하거나 관리자에게 문의해주세요.
        </p>
        <A href="/" className={styles.notFoundButton}>
          홈으로 돌아가기
        </A>
      </Article>
    </Main>
  );
};

export default TenantNotFound;
