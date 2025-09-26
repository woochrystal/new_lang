import React from 'react';
import styles from './Loading.module.scss';

/**
 * 로딩 스피너 컴포넌트
 * @param {Object} props
 * @param {string} [props.message='로딩 중...'] - 로딩 메시지
 * @param {'small'|'medium'|'large'} [props.size='medium'] - 스피너 크기
 * @param {boolean} [props.fullscreen=true] - 전체 화면 오버레이 모드
 * @param {boolean} [props.overlay=true] - 배경 오버레이 표시 (fullscreen일 때만)
 * @param {string} [props.color] - 커스텀 스피너 색상
 * @param {boolean} [props.hideMessage=false] - 메시지 숨김
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 */
export const Loading = ({
  message = '로딩 중...',
  size = 'medium',
  fullscreen = true,
  overlay = true,
  color,
  hideMessage = false,
  className = '',
  ref,
  ...rest
}) => {
  const containerClass = fullscreen
    ? `${styles.loadingContainer} ${overlay ? styles.withOverlay : ''}`
    : styles.loadingInline;

  const spinnerClass = `${styles.spinner} ${styles[`spinner--${size}`]}`;

  const containerClasses = [containerClass, className].filter(Boolean).join(' ');

  const spinnerStyle = color ? { borderTopColor: color } : {};

  return (
    <div ref={ref} className={containerClasses} {...rest}>
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

export default Loading;
