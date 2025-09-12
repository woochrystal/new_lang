/**
 * @fileoverview Loading 컴포넌트
 * @description 로딩 스피너
 */

import styles from './Loading.module.scss';

/**
 * 로딩 스피너 컴포넌트
 * @param {Object} props
 * @param {string} [props.message='로딩 중...'] - 로딩 메시지
 * @param {string} [props.size='medium'] - 스피너 크기 (small, medium, large)
 * @param {boolean} [props.fullscreen=true] - 전체 화면 모드 여부
 */
export const Loading = ({ message = '로딩 중...', size = 'medium', fullscreen = true }) => {
  const containerClass = fullscreen ? styles.loadingContainer : styles.loadingInline;

  const spinnerClass = `${styles.spinner} ${styles[`spinner--${size}`]}`;

  return (
    <div className={containerClass}>
      <div className={styles.loadingContent}>
        <div className={spinnerClass} />
        <p className={styles.loadingMessage}>{message}</p>
      </div>
    </div>
  );
};

export default Loading;
