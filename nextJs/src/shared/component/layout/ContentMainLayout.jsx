//대시보드에서만 사용!!!
'use client';

import React from 'react';
import styles from './layout.module.scss';
import Header from '../container/Header';

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

// 메인 ContentMainLayout 251126
const ContentMainLayout = ({ children, ...props }) => {
  // 시간 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  const date = year + '.' + month + '.' + day;

  const hour = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');

  // 최종 출력
  const now = `${date} ${hour}:${minutes}:${seconds}`;

  // ContentMainLayout.Header 분리
  const childrenArray = React.Children.toArray(children);
  const layoutHeader = childrenArray.find((child) => child.type === ContentLayoutHeader);
  const otherChildren = childrenArray.filter((child) => child.type !== ContentLayoutHeader);

  return (
    <div className={`${styles.container} mainLayout`}>
      {/* 고정 헤더 1: 브랜드 */}
      <div className={styles.topWrap}>
        <p className={styles.title}>{brand}</p>
        <p className={styles.date}>최종접속 : {now}</p>
      </div>

      {/* 고정 헤더 2: 페이지 헤더 */}
      {layoutHeader}

      {/* 스크롤 영역 */}
      <div className="mainPageWrap pageWrap">{otherChildren}</div>
    </div>
  );
};

// Compound Pattern 구성
ContentMainLayout.Header = ContentLayoutHeader;

export default ContentMainLayout;
