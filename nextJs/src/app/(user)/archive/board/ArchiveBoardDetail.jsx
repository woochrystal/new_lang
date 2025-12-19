/**
 * 아카이브 게시글 상세 컴포넌트 (Drawer 내부에 표시)
 */
'use client';

import { useEffect, useState } from 'react';

// API 클라이언트
import { apiClient } from '@/shared/api';

// UI Components
import { Button, Loading } from '@/shared/component';

// SCSS
import styles from '@/features/example/ui/Example.module.scss';

/**
 * 게시글 상세 컴포넌트
 * @param {Object} props
 * @param {number} props.boardId - 게시글 ID
 * @param {Function} props.onClose - Drawer 닫기 콜백
 */
export default function ArchiveBoardDetail({ boardId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [boardData, setBoardData] = useState(null);
  const [error, setError] = useState(null);

  // API 호출
  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/api/v1/boards/${boardId}`);
      setBoardData(response.data);
    } catch (err) {
      setError('게시글을 불러오는 데 실패했습니다.');
      setBoardData(null);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 데이터 로드
  useEffect(() => {
    if (boardId) {
      void fetchDetail();
    }
  }, [boardId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading message="게시글 로딩 중..." fullscreen={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>오류 발생</h2>
        <p>{error}</p>
        <Button variant="primary" onClick={onClose}>
          닫기
        </Button>
      </div>
    );
  }

  if (!boardData) {
    return (
      <div className={styles.errorContainer}>
        <h2>게시글을 찾을 수 없습니다</h2>
        <p>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
        <Button variant="primary" onClick={onClose}>
          닫기
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.boardDetail}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Button variant="basic" onClick={onClose} className={styles.backButton}>
            ← 목록으로
          </Button>
        </div>
        {/* 아카이브 게시판은 수정/삭제 버튼이 없습니다. */}
      </div>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>{boardData.title}</h1>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.label}>작성자:</span>
            <span className={styles.value}>{boardData.userNm}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>작성일:</span>
            <span className={styles.value}>
              {boardData.regDtm ? new Date(boardData.regDtm).toLocaleDateString() : '-'}
            </span>
          </div>
        </div>
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
        <Button variant="secondary" onClick={onClose} className={styles.buttonLarge}>
          목록으로
        </Button>
      </div>
    </div>
  );
}
