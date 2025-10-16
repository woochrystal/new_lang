'use client';

import styles from './ContentLayout.module.scss';

const brand = '기업 맞춤형 IT 솔루션, 펜타웨어';

// 메인 ContentLayout
export default function ContentLayout({ children, ...props }) {
  // 시간 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  const date = year + '.' + month + '.' + day;

  const hour = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();

  // 최종 출력
  const now = `${date} ${hour}:${minutes}:${seconds}`;

  return (
    <div className={styles.container}>
      {/* 고정 헤더 */}
      <div className={styles.header}>
        <div className={styles.topWrap}>
          <p className={styles.title}>{brand}</p>
          <p className={styles.date}>최종접속 : {now}</p>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
