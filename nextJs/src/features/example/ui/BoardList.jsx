'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/shared/ui/Button/Button';
import { EnhancedErrorHandler } from '../script/errorHandler';
import { sampleApi } from '../script/sampleApi';
import { formatDate } from '../script/utils';
import { LoggerFactory } from '@/shared/lib/logger';
import { createDynamicPath } from '@/shared/lib/routing';

import styles from './BoardList.module.scss';

const logger = LoggerFactory.getLogger('BoardList');

// ============================================================================
// API Methods
// ============================================================================

const deleteHandler = (onRefresh, setAlertConfig) => async (boardId) => {
  try {
    await sampleApi.delete(boardId);
    onRefresh();
  } catch (error) {
    const errorInfo = EnhancedErrorHandler.handleApiError(error);
    setAlertConfig({
      isOpen: true,
      title: errorInfo.title,
      message: errorInfo.message,
      variant: 'error'
    });
  }
};

// ============================================================================
// Event Handlers
// ============================================================================

const rowClickHandler = (onBoardSelect) => (row) => {
  if (onBoardSelect) {
    onBoardSelect(row);
  }
};

const pageChangeHandler = (onPageChange) => (newPage) => {
  onPageChange(newPage);
};

const confirmDeleteHandler = (handleDelete) => (boardId, event) => {
  event.stopPropagation();
  if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    handleDelete(boardId);
  }
};

const alertHandler = (setAlertConfig) => () => {
  setAlertConfig((prev) => ({ ...prev, isOpen: false }));
};

// ============================================================================
// Component
// ============================================================================

/**
 * 게시판 목록 컴포넌트
 * @param {Function} props.onBoardSelect - 게시글 선택 콜백
 * @param {boolean} props.showActions - 액션 버튼 표시 여부
 * @param {Object} props.boardData - 게시판 데이터
 * @param {boolean} props.loading - 로딩 상태
 * @param {Function} props.onPageChange - 페이지 변경 콜백
 * @param {Function} props.onRefresh - 목록 새로고침 콜백
 */
export function BoardList({ onBoardSelect, showActions = true, boardData, loading, onPageChange, onRefresh }) {
  const router = useRouter();
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', variant: 'error' });

  const handleDelete = deleteHandler(onRefresh, setAlertConfig);
  const handleRowClick = rowClickHandler(onBoardSelect);
  const handlePageChange = pageChangeHandler(onPageChange);
  const confirmDelete = confirmDeleteHandler(handleDelete);
  const closeAlert = alertHandler(setAlertConfig);

  const columns = [
    { key: 'rowNumber', label: '번호' },
    { key: 'title', label: '제목' },
    { key: 'createdAt', label: '작성일' },
    ...(showActions ? [{ key: 'actions', label: '작업' }] : [])
  ];

  const tableData = boardData.list.map((item) => ({
    id: item.id,
    rowNumber: item.rowNumber,
    title: item.title,
    createdAt: formatDate(item.createdAt),
    originalItem: item
  }));

  return (
    <div className={styles.boardList}>
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}>로딩 중...</div>
        </div>
      )}

      {!loading && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} onClick={() => handleRowClick(row.originalItem)} className={styles.tableRow}>
                  <td>{row.rowNumber}</td>
                  <td>{row.title}</td>
                  <td>{row.createdAt}</td>
                  {showActions && (
                    <td>
                      <div className={styles.actionButtons}>
                        <Button
                          variant="secondary"
                          label="수정"
                          className={styles.buttonSmall}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(createDynamicPath(`/example/edit?id=${row.id}`));
                          }}
                        />
                        <Button
                          variant="secondary"
                          label="삭제"
                          className={`${styles.buttonDanger} ${styles.buttonSmall}`}
                          onClick={(e) => confirmDelete(row.id, e)}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {tableData.length === 0 && <div className={styles.emptyMessage}>게시글이 없습니다.</div>}
        </div>
      )}

      {!loading && boardData.pagination && boardData.pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: boardData.pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={boardData.pagination.currentPage === page ? 'primary' : 'secondary'}
              label={String(page)}
              className={styles.buttonSmall}
              onClick={() => handlePageChange(page)}
            />
          ))}
        </div>
      )}

      {alertConfig.isOpen && (
        <div className={styles.alertOverlay} onClick={closeAlert}>
          <div className={`${styles.alert} ${styles.alertError}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.alertHeader}>
              <h3 className={styles.alertTitle}>{alertConfig.title}</h3>
              <Button variant="basic" label="×" className={styles.alertClose} onClick={closeAlert} />
            </div>
            <div className={styles.alertBody}>
              <p>{alertConfig.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardList;
