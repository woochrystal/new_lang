'use client';
import Link from 'next/link';
import styles from './NotFound.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>404</h1>
        <h2 className={styles.subTitle}>페이지를 찾을 수 없습니다</h2>
        <p className={styles.message}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <Link href="/" className={styles.button}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
