//wrapper 상관 없이 단독 사용 가능

import React from 'react';
import styles from './pageTit.module.scss';

/**
 * 페이지 타이틀 컴포넌트
 * @param {Object} props
 * @param {string} props.title - 페이지 제목
 * @param {string} [props.description] - 페이지 설명
 * @param {'h1'|'h2'|'h3'} [props.level='h2'] - 제목 레벨
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 */
export const PageTit = ({ title, description, className = '', ref, ...rest }) => {
  const containerClasses = [styles.pageTit, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      {/* 각 화면 페이지 명 */ title && <h2 className={styles.pageTit}>{title}</h2>}
      {/* 페이지 기능 설명 */ description && <p className={styles.pageDesc}>{description}</p>}
    </div>
  );
};

export default PageTit;
