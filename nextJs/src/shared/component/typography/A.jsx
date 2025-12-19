'use client';

import Link from 'next/link';
import styles from './typography.module.scss';

/**
 * 링크 컴포넌트 (Next.js Link 래핑)
 *
 * 내부 링크는 Next.js Link로, 외부 링크는 <a> 태그로 처리합니다.
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'text'} [props.variant='primary'] - 링크 스타일
 * @param {boolean} [props.underline=true] - 밑줄 표시
 * @param {string} props.href - 링크 주소 (필수)
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 링크 텍스트
 * @param {Object} props...rest - HTML <a> 네이티브 속성
 *
 * @example
 * // 기본 내부 링크 (Next.js Link 사용)
 * <A href="/boards">게시판</A>
 *
 * @example
 * // 스타일 변형
 * <A href="/help" variant="secondary">보조 링크</A>
 *
 * @example
 * // 밑줄 없음
 * <A href="/info" underline={false}>정보</A>
 *
 * @example
 * // 외부 링크 (target="_blank"면 <a> 태그 사용)
 * <A href="https://example.com" target="_blank" rel="noopener noreferrer">
 *   외부 링크
 * </A>
 */
export const A = ({ variant = 'primary', underline = true, href, className = '', target, ...rest }) => {
  const linkClasses = [styles.link, styles[variant], !underline && styles.noUnderline, className]
    .filter(Boolean)
    .join(' ');

  // 외부 링크 또는 특수 target 처리
  const isExternal = href?.startsWith('http') || href?.startsWith('//');
  const hasSpecialTarget = target === '_blank' || target === '_self' || target === '_parent' || target === '_top';

  if (isExternal || hasSpecialTarget) {
    return <a href={href} target={target} className={linkClasses} {...rest} />;
  }

  // 내부 링크: Next.js Link 사용
  return <Link href={href} className={linkClasses} {...rest} />;
};
