'use client';

// ============================================================================
// Imports
// ============================================================================
import { forwardRef } from 'react';

import styles from './title.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * 페이지 제목 컴포넌트
 *
 * 페이지 상단에 표시되는 제목과 설명을 렌더링합니다
 *
 * @param {Object} props
 * @param {string} props.title - 페이지 제목
 * @param {string} [props.description] - 페이지 설명/부제목
 * @param {'h1'|'h2'|'h3'} [props.level='h2'] - 제목 레벨 (시맨틱 HTML)
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 * @param {Object} [rest] - HTML 네이티브 속성 (aria-*, data-* 등) - 기타 HTML 속성
 *
 * @example
 * // 기본 제목
 * <Title
 *   title="게시판 관리"
 *   description="게시물을 조회하고 관리합니다"
 * />
 *
 * @example
 * // h1 레벨 제목
 * <Title
 *   level="h1"
 *   title="메인 페이지"
 *   description="애플리케이션 메인 페이지입니다"
 * />
 */
const Title = forwardRef(({ title, description, level = 'h2', className = '', ...rest }, ref) => {
  const containerClasses = [styles.pageTit, className].filter(Boolean).join(' ');

  const HeadingLevel = level;

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      {/* 페이지 제목 */}
      {title && <HeadingLevel className={styles.pageMainTit}>{title}</HeadingLevel>}

      {/* 페이지 설명 */}
      {description && <p className={styles.pageDesc}>{description}</p>}
    </div>
  );
});

Title.displayName = 'Title';

export default Title;
