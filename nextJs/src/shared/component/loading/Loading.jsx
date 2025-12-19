'use client';

// ============================================================================
// Imports
// ============================================================================
import { Suspense, useState, useEffect } from 'react';

import { useOverlayStore } from '@/shared/store';
import styles from './loading.module.scss';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MESSAGE = '로딩 중...';
const DEFAULT_SIZE = 'medium';

// ============================================================================
// Internal Component (스피너만 렌더링)
// ============================================================================

/**
 * 내부 헬퍼
 */
const LoadingSpinner = ({
  message = DEFAULT_MESSAGE,
  size = DEFAULT_SIZE,
  fullscreen = true,
  overlay = true,
  color,
  hideMessage = false,
  delay = 0,
  className = '',
  ref,
  ...rest
}) => {
  // ==========================================================================
  // State
  // ==========================================================================

  const [showSpinner, setShowSpinner] = useState(delay === 0);
  const loadingZIndex = useOverlayStore((state) => state.getLoadingZIndex());

  // ==========================================================================
  // Effects
  // ==========================================================================

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShowSpinner(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  // ==========================================================================
  // Early Return
  // ==========================================================================

  if (!showSpinner) return null;

  // ==========================================================================
  // Class Names
  // ==========================================================================

  const containerClass = fullscreen
    ? [styles.loadingContainer, overlay && styles.withOverlay, className].filter(Boolean).join(' ')
    : [styles.loadingInline, className].filter(Boolean).join(' ');

  const spinnerClass = `${styles.spinner} ${styles[`spinner--${size}`]}`;

  const spinnerStyle = color ? { borderTopColor: color } : {};

  // overlay=true일 때 동적 z-index 적용
  const containerStyle = overlay && fullscreen ? { zIndex: loadingZIndex } : {};

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div ref={ref} className={containerClass} style={containerStyle} {...rest}>
      <div className={styles.loadingContent}>
        <div className={spinnerClass} style={spinnerStyle} aria-label="로딩 중" role="status" />
        {!hideMessage && message && (
          <p className={styles.loadingMessage} aria-live="polite">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component (Compound Pattern)
// ============================================================================

/**
 * 통합 로딩 컴포넌트
 *
 * ## 두 가지 모드:
 *
 * ### 1. 순수 스피너 (children 없음)
 * 스피너를 독립적으로 렌더링합니다. 데이터 로딩 상태를 직접 관리할 때 사용합니다.
 *
 * ### 2. Suspense 래핑 (children 있음)
 * Suspense로 비동기 컴포넌트를 감싸고, 로딩 중 폴백으로 스피너를 표시합니다.
 * 서버 컴포넌트, 비동기 데이터와 통합할 때 사용합니다.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Suspense로 감쌀 컴포넌트 (있으면 Suspense 모드)
 * @param {string} [props.message='로딩 중...'] - 로딩 메시지
 * @param {'small'|'medium'|'large'} [props.size='medium'] - 스피너 크기
 * @param {boolean} [props.fullscreen=true] - 전체 화면 오버레이 모드
 * @param {boolean} [props.overlay=true] - 배경 오버레이 표시 (fullscreen일 때만)
 * @param {string} [props.color] - 커스텀 스피너 색상
 * @param {boolean} [props.hideMessage=false] - 메시지 숨김
 * @param {number} [props.delay=0] - 스피너 표시 지연 시간(ms). 짧은 로딩 깜빡임 방지
 * @param {React.ReactNode} [props.fallback] - 커스텀 폴백 (Suspense 모드에서만 사용, 없으면 스피너 사용)
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref (순수 스피너 모드)
 * @param {Object} [rest] - HTML 네이티브 속성 (aria-*, data-* 등)
 *
 * @example
 * // 순수 스피너
 * <Loading message="데이터 로딩 중..." />
 *
 * @example
 * // 인라인 모드
 * <Loading fullscreen={false} message="테이블 로딩 중..." />
 *
 * @example
 * // 지연 표시 (300ms 후 스피너 표시)
 * <Loading delay={300} message="잠시만 기다려주세요..." />
 *
 * @example
 * // Suspense 래핑 (비동기 컴포넌트)
 * <Loading message="사용자 정보 로딩 중..." delay={200}>
 *   <UserProfile userId={123} />
 * </Loading>
 *
 * @example
 * // 커스텀 폴백
 * <Loading fallback={<CustomLoadingUI />}>
 *   <DataTable data={asyncData} />
 * </Loading>
 */
export const Loading = ({
  children,
  message = DEFAULT_MESSAGE,
  size = DEFAULT_SIZE,
  fullscreen = true,
  overlay = true,
  color,
  hideMessage = false,
  delay = 100,
  fallback,
  className = '',
  ref,
  ...rest
}) => {
  // ==========================================================================
  // Mode Detection & Render
  // ==========================================================================

  // children이 있으면 Suspense 모드
  if (children) {
    const defaultFallback = (
      <LoadingSpinner
        message={message}
        size={size}
        fullscreen={fullscreen}
        overlay={overlay}
        color={color}
        hideMessage={hideMessage}
        delay={delay}
        className={className}
      />
    );

    return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
  }

  // children이 없으면 순수 스피너 모드
  return (
    <LoadingSpinner
      message={message}
      size={size}
      fullscreen={fullscreen}
      overlay={overlay}
      color={color}
      hideMessage={hideMessage}
      delay={delay}
      className={className}
      ref={ref}
      {...rest}
    />
  );
};
