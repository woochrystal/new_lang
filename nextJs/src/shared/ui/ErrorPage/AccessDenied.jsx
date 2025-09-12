/**
 * @fileoverview 접근 거부 공용 컴포넌트
 * @description 권한 부족 시 표시되는 제네릭 접근 제한 페이지
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTenantBasePath } from '@/shared/lib/routing';
import styles from './AccessDenied.module.scss';

/**
 * 접근 거부 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.title="접근할 수 없는 페이지입니다"] - 제목
 * @param {string} [props.message] - 상세 메시지
 * @param {boolean} [props.showBackButton=true] - 뒤로가기 버튼 표시 여부
 * @param {boolean} [props.showHomeButton=true] - 홈으로 가기 버튼 표시 여부
 * @param {string} [props.homeUrl] - 홈 URL
 * @param {string} [props.variant="default"] - 스타일 변형 (default, minimal)
 * @returns {React.ReactNode}
 */
export const AccessDenied = ({
  title = '접근할 수 없는 페이지입니다',
  message = '이 페이지에 접근할 권한이 없습니다. 관리자에게 문의하시거나 다른 페이지를 이용해 주세요.',
  showBackButton = true,
  showHomeButton = true,
  homeUrl,
  variant = 'default'
}) => {
  const router = useRouter();

  // 동적 홈 URL 설정
  const dynamicHomeUrl = homeUrl || getTenantBasePath();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace(dynamicHomeUrl);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={styles.minimal}>
        <div className={styles.minimalIcon}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 15v2m0 0v2m0-2h2m-2 0H8m13-9a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className={styles.minimalTitle}>{title}</h3>
        <p className={styles.minimalMessage}>{message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 아이콘 */}
        <div className={styles.iconSection}>
          <div className={styles.iconContainer}>
            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* 제목 */}
        <h1 className={styles.title}>{title}</h1>

        {/* 메시지 */}
        <p className={styles.message}>{message}</p>

        {/* 버튼 */}
        <div className={styles.buttonGroup}>
          {showBackButton && (
            <button onClick={handleGoBack} className={styles.backButton}>
              이전 페이지로
            </button>
          )}

          {showHomeButton && (
            <Link href={dynamicHomeUrl} className={styles.homeButton}>
              홈으로 가기
            </Link>
          )}
        </div>

        {/* 추가 도움말 */}
        <div className={styles.helpSection}>
          <p className={styles.helpText}>
            문제가 지속되면 <strong>관리자</strong>에게 문의해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
};
