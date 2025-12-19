'use client';

import React, { useEffect, useState } from 'react';
import styles from './layout.module.scss';
import Header from '../container/Header';
import { useAuthStore } from '@/shared/store';

const brand = '기업 맞춤형 IT 솔루션, 펜타웨어';

// ContentLayout.Header - 페이지 헤더
const ContentLayoutHeader = ({ title = '', subtitle = '', children, className = '', ...props }) => {
  return (
    <Header className={`${styles.header} ${className}`} {...props}>
      <div className={styles.headerContent}>
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className={styles.headerChildren}>{children}</div>}
    </Header>
  );
};

// 메인 ContentLayout
const ContentLayout = ({ children, ...props }) => {
  const [now, setNow] = useState('');
  const user = useAuthStore((state) => state.user);
  const shouldShowLastAccess = !!user;

  useEffect(() => {
    if (!shouldShowLastAccess) return;

    // 시간 가져오기
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const date = `${year}.${month}.${day}`;

    const hour = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');

    setNow(`${date} ${hour}:${minutes}:${seconds}`);
  }, [shouldShowLastAccess]);

  // ContentLayout.Header 분리
  const childrenArray = React.Children.toArray(children);
  const layoutHeader = childrenArray.find((child) => child.type === ContentLayoutHeader);
  const otherChildren = childrenArray.filter((child) => child.type !== ContentLayoutHeader);

  return (
    <div className={styles.container}>
      {/* 고정 헤더 1: 브랜드 */}
      <div className={styles.topWrap}>
        <p className={styles.title}>{brand}</p>
        {shouldShowLastAccess && (
          <p className={styles.date} suppressHydrationWarning>
            최종접속 : {now}
          </p>
        )}
      </div>

      {/* 고정 헤더 2: 페이지 헤더 */}
      {layoutHeader}

      {/* 스크롤 영역 */}
      <div className={styles.content}>{otherChildren}</div>
    </div>
  );
};

// Compound Pattern 구성
ContentLayout.Header = ContentLayoutHeader;

export default ContentLayout;
