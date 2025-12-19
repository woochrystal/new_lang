'use client';

import { useEffect, useState, useMemo } from 'react';

import { Button } from '@/shared/component';
import { boardApi } from '@/features/board';
import { formatDate } from '../script/utils';
import { Board } from '../script/entity';
import { useAlertStore } from '@/shared/store/alertStore';
import { FileTr } from '@/features/aprv'; // FileTr 컴포넌트 import 추가
import { useAuth } from '@/shared/auth';

import styles from './Board.module.scss';
import tableStyles from '@/shared/ui/Table/table.module.scss';

/**
 * 게시글 상세 컴포넌트
 */
const BoardDetail = function ({ boardId, onBack, onEdit, onDelete }) {
  // onEdit, onDelete prop 추가
  const { showError, showConfirm } = useAlertStore(); // showConfirm 추가
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [boardData, setBoardData] = useState(null);
  // const [showAllFiles, setShowAllFiles] = useState(false); // 파일 전체 리스트 표시 여부 제거

  const fetchDetail = async function () {
    setLoading(true);
    const result = await boardApi.get(boardId);
    if (result) {
      setBoardData(Board.fromApi(result));
    } else {
      setBoardData(null);
      showError('게시글을 찾을 수 없습니다.');
    }
    setLoading(false);
  };

  const handleBack = function () {
    if (onBack) {
      onBack();
    }
  };

  const handleEdit = function () {
    if (onEdit && boardData?.id) {
      onEdit(boardData.id);
    }
  };

  const handleDelete = function () {
    if (onDelete && boardData?.id) {
      showConfirm({
        title: '게시글 삭제',
        message: `"${boardData.title}"을(를) 정말로 삭제하시겠습니까?`,
        onConfirm: async () => {
          const success = await boardApi.delete(boardData.id);
          if (success) {
            onDelete(); // 삭제 성공 시 상위 컴포넌트에 알림
          } else {
            showError('게시글 삭제에 실패했습니다.');
          }
        }
      });
    }
  };

  useEffect(
    function () {
      if (boardId) {
        void fetchDetail();
      }
    },
    [boardId]
  );

  // fileState를 boardData로부터 생성
  const fileState = useMemo(() => {
    if (!boardData) {
      return { fileId: null, existing: [], new: [], deletedIds: [] };
    }
    return {
      fileId: boardData.fileId,
      existing: boardData.fileList || [],
      new: [],
      deletedIds: []
    };
  }, [boardData]);

  // 수정 및 삭제 권한 확인
  const canModifyOrDelete = useMemo(() => {
    if (!boardData || !user) return false;
    const isOwner = boardData.regId === user.usrId;
    const isAdmin = user.usrRole === 'SYSADM' || user.usrRole === 'ADM';
    return isOwner || isAdmin;
  }, [boardData, user]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>로딩 중...</div>
      </div>
    );
  }

  if (!boardData) {
    return (
      <div className={styles.errorContainer}>
        <h2>게시글을 찾을 수 없습니다</h2>
        <p>요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
        <Button variant="primary" onClick={handleBack}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.noticeDetail}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Button variant="basic" onClick={handleBack} className={styles.backButton}>
            ← 목록으로
          </Button>
        </div>
        {canModifyOrDelete && (
          <div className="flex gap-2">
            {' '}
            {/* 수정/삭제 버튼 그룹 */}
            <Button variant="secondary" onClick={handleEdit}>
              수정
            </Button>
            <Button variant="negative" onClick={handleDelete}>
              삭제
            </Button>
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
          <div className={styles.metaItem}>
            <span className={styles.label}>작성자:</span>
            <span className={styles.value}>{boardData.author}</span>
          </div>
        </div>
      </div>

      <div className={styles.separator}></div>

      {/* 첨부파일 영역 */}
      {fileState.existing.length > 0 && (
        <div className={'hasItem03'}>
          <div className={`${tableStyles.postInfoBox} postInfoBox`}>
            <table className={tableStyles.table}>
              <tbody>
                <FileTr
                  id="board-files-readonly"
                  label="첨부파일"
                  fileState={fileState}
                  readonly={true} // 읽기 전용으로 설정
                />
              </tbody>
            </table>
          </div>
        </div>
      )}

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
        <Button variant="secondary" onClick={handleBack} className={styles.buttonLarge}>
          목록으로
        </Button>
      </div>
    </div>
  );
};

export default BoardDetail;
