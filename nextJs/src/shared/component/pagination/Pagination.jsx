'use client';

// ============================================================================
// Imports
// ============================================================================
import { useMemo } from 'react';

import styles from './pagination.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * 페이지네이션 컴포넌트
 *
 * 페이지 네비게이션을 제공합니다
 *
 * @param {Object} props
 * @param {number} props.currentPage - 현재 페이지 (1부터 시작)
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {Function} props.onPageChange - 페이지 변경 콜백 (page) => void
 * @param {number} [props.pageSize=10] - 한 번에 표시할 페이지 수
 * @param {boolean} [props.showFirstLast=true] - 첫/마지막 버튼 표시 여부
 * @param {string} [props.className] - 추가 CSS 클래스
 *
 * @example
 * // 기본 페이지네이션
 * const [page, setPage] = useState(1);
 * <Pagination
 *   currentPage={page}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 *
 * @example
 * // 20개 페이지씩 표시
 * <Pagination
 *   currentPage={page}
 *   totalPages={100}
 *   onPageChange={(page) => setPage(page)}
 *   pageSize={20}
 * />
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  showFirstLast = true,
  className = '',
  ...rest
}) => {
  // ==========================================================================
  // Validation (입력값 검증)
  // ==========================================================================

  if (totalPages < 1 || currentPage < 1 || currentPage > totalPages) {
    console.warn('Pagination: invalid props', { currentPage, totalPages });
    return null;
  }

  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  // 표시할 페이지 번호 배열
  const pageNumbers = useMemo(() => {
    const pages = [];
    const half = Math.floor(pageSize / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + pageSize - 1);

    // 끝에서부터 시작 조정
    if (end - start + 1 < pageSize) {
      start = Math.max(1, end - pageSize + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, pageSize]);

  const paginationClasses = [styles.paginationCustom, className].filter(Boolean).join(' ');

  // ==========================================================================
  // Methods (메서드)
  // ==========================================================================

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const handleKeyDown = (e, page) => {
    // Enter/Space: 페이지 이동
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePageChange(page);
    }
    // ArrowLeft: 이전 페이지
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePageChange(currentPage - 1);
    }
    // ArrowRight: 다음 페이지
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handlePageChange(currentPage + 1);
    }
    // Home: 첫 페이지
    else if (e.key === 'Home') {
      e.preventDefault();
      handlePageChange(1);
    }
    // End: 마지막 페이지
    else if (e.key === 'End') {
      e.preventDefault();
      handlePageChange(totalPages);
    }
  };

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <div className={paginationClasses} {...rest}>
      <ul>
        {/* 첫 페이지 버튼 */}
        {showFirstLast && (
          <li>
            <button
              className={styles.svgButton}
              onClick={() => handlePageChange(1)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              disabled={currentPage === 1}
              aria-label="첫 페이지"
              title="첫 페이지"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6.3999 12.2666L2.13324 7.99993L6.3999 3.73327"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.8662 12.2666L9.59954 7.99993L13.8662 3.73327"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </li>
        )}

        {/* 이전 페이지 버튼 */}
        <li>
          <button
            className={styles.svgButton}
            onClick={() => handlePageChange(currentPage - 1)}
            onKeyDown={(e) => handleKeyDown(e, currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
            title="이전 페이지"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4L6 8L10 12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>

        {/* 페이지 번호 */}
        {pageNumbers.map((num) => (
          <li key={num}>
            <button
              onClick={() => handlePageChange(num)}
              onKeyDown={(e) => handleKeyDown(e, num)}
              disabled={num === currentPage}
              className={num === currentPage ? styles.on : ''}
              aria-current={num === currentPage ? 'page' : undefined}
              aria-label={`페이지 ${num}`}
            >
              {num}
            </button>
          </li>
        ))}

        {/* 다음 페이지 버튼 */}
        <li>
          <button
            className={styles.svgButton}
            onClick={() => handlePageChange(currentPage + 1)}
            onKeyDown={(e) => handleKeyDown(e, currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
            title="다음 페이지"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>

        {/* 마지막 페이지 버튼 */}
        {showFirstLast && (
          <li>
            <button
              className={styles.svgButton}
              onClick={() => handlePageChange(totalPages)}
              onKeyDown={(e) => handleKeyDown(e, totalPages)}
              disabled={currentPage === totalPages}
              aria-label="마지막 페이지"
              title="마지막 페이지"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M9.6001 12.2666L13.8668 7.99993L9.6001 3.73327"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.13379 12.2666L6.40046 7.99993L2.13379 3.73327"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
