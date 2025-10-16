'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/shared/ui/Button/Button';
import { EnhancedErrorHandler } from '../script/errorHandler';
import { sampleApi } from '../script/sampleApi';
import { formatDate } from '../script/utils';
import { createDynamicPath } from '@/shared/lib/routing';
import { LoggerFactory } from '@/shared/lib/logger';

import styles from './BoardDetail.module.scss';

const logger = LoggerFactory.getLogger('BoardDetail');

// ============================================================================
// API Methods
// ============================================================================

const deleteHandler =
  ({ boardId, initialBoardData, onBack, router, setAlertConfig }) =>
  async () => {
    if (!window.confirm(`"${initialBoardData?.title || '이 게시글'}"을 정말로 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await sampleApi.delete(boardId);
      if (onBack) {
        onBack();
      } else {
        router.push(createDynamicPath('/example'));
      }
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

const navigationHandlers = ({ router, onBack, boardId }) => ({
  handleBack: () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  },
  handleEdit: () => {
    router.push(createDynamicPath(`/example/edit?id=${boardId}`));
  }
});

const alertHandler = (setAlertConfig) => () => {
  setAlertConfig((prev) => ({ ...prev, isOpen: false }));
};

// ============================================================================
// Component
// ============================================================================

/**
 * 게시글 상세 컴포넌트
 * @param {number} props.boardId - 게시글 ID
 * @param {Object} props.initialBoardData - 초기 게시글 데이터
 * @param {boolean} props.loading - 로딩 상태
 * @param {Function} props.onBack - 뒤로가기 콜백
 * @param {boolean} props.showActions - 액션 버튼 표시 여부
 */
export function BoardDetail({ boardId, onBack, showActions = true, initialBoardData, loading }) {
  const router = useRouter();
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'error'
  });

  const handleDelete = deleteHandler({ boardId, initialBoardData, onBack, router, setAlertConfig });
  const { handleBack, handleEdit } = navigationHandlers({ router, onBack, boardId });
  const closeAlert = alertHandler(setAlertConfig);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>로딩 중...</div>
      </div>
    );
  }

  if (!initialBoardData) {
    return (
      <div className={styles.errorContainer}>
        <h2>게시글을 찾을 수 없습니다</h2>
        <p>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
        <Button variant="primary" label="목록으로 돌아가기" onClick={() => router.back()} />
      </div>
    );
  }

  const boardData = initialBoardData;

  return (
    <div className={styles.boardDetail}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Button variant="basic" label="← 목록으로" onClick={handleBack} className={styles.backButton} />
        </div>

        {showActions && (
          <div className={styles.actions}>
            <Button variant="secondary" label="수정" onClick={handleEdit} />
            <Button variant="secondary" label="삭제" onClick={handleDelete} className={styles.buttonDanger} />
          </div>
        )}
      </div>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>{boardData.title}</h1>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.label}>작성일:</span>
            <span className={styles.value}>{formatDate(boardData.createdAt)}</span>
          </div>
          {boardData.updatedAt !== boardData.createdAt && (
            <div className={styles.metaItem}>
              <span className={styles.label}>수정일:</span>
              <span className={styles.value}>{formatDate(boardData.updatedAt)}</span>
            </div>
          )}
        </div>

        {boardData.tags && boardData.tags.length > 0 && (
          <div className={styles.tags}>
            {boardData.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.separator}></div>

      <div className={styles.content}>
        <div className={styles.contentBody}>
          {boardData.content.split('\n').map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ) : (
              <br key={index} />
            )
          )}
        </div>
      </div>

      <div className={styles.bottomActions}>
        <Button variant="secondary" label="목록으로" onClick={handleBack} className={styles.buttonLarge} />
      </div>

      {alertConfig.isOpen && (
        <div className={styles.alertOverlay} onClick={closeAlert}>
          <div className={`${styles.alert} ${styles.alertError}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.alertHeader}>
              <h3 className={styles.alertTitle}>{alertConfig.title}</h3>
              <Button variant="basic" label="×" onClick={closeAlert} className={styles.alertClose} />
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

export default BoardDetail;
