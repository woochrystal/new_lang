'use client';

import { useEffect, useState, useMemo } from 'react';

import { Button } from '@/shared/component';
import { noticeApi } from '@/features/notice';
import { formatDate } from '../script/utils';
import { Notice } from '../script/entity';
import { useAlertStore } from '@/shared/store/alertStore';
import { FileTr } from '@/features/aprv';
import { useAuth } from '@/shared/auth';

import styles from './Notice.module.scss';
import tableStyles from '@/shared/ui/Table/table.module.scss';

/**
 * 공지사항 상세 컴포넌트
 */
const NoticeDetail = function ({ noticeId, onBack, onEdit, onDelete }) {
  const { showError, showConfirm } = useAlertStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [noticeData, setNoticeData] = useState(null);

  const fetchDetail = async function () {
    setLoading(true);
    const result = await noticeApi.get(noticeId);
    if (result) {
      setNoticeData(Notice.fromApi(result));
    } else {
      setNoticeData(null);
      showError('공지사항을 찾을 수 없습니다.');
    }
    setLoading(false);
  };

  const handleBack = function () {
    if (onBack) {
      onBack();
    }
  };

  const handleEdit = function () {
    if (onEdit && noticeData?.id) {
      onEdit(noticeData.id);
    }
  };

  const handleDelete = function () {
    if (onDelete && noticeData?.id) {
      showConfirm({
        title: '공지사항 삭제',
        message: `"${noticeData.title}"을(를) 정말로 삭제하시겠습니까?`,
        onConfirm: async () => {
          const success = await noticeApi.delete(noticeData.id);
          if (success) {
            onDelete();
          } else {
            showError('공지사항 삭제에 실패했습니다.');
          }
        }
      });
    }
  };

  useEffect(
    function () {
      if (noticeId) {
        void fetchDetail();
      }
    },
    [noticeId]
  );

  const fileState = useMemo(() => {
    if (!noticeData) {
      return { fileId: null, existing: [], new: [], deletedIds: [] };
    }
    return {
      fileId: noticeData.fileId,
      existing: noticeData.fileList || [],
      new: [],
      deletedIds: []
    };
  }, [noticeData]);

  const canModifyOrDelete = useMemo(() => {
    if (!noticeData || !user) return false;
    const isOwner = noticeData.regId === user.usrId;
    const isAdmin = user.usrRole === 'SYSADM' || user.usrRole === 'ADM';
    return isOwner || isAdmin;
  }, [noticeData, user]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>로딩 중...</div>
      </div>
    );
  }

  if (!noticeData) {
    return (
      <div className={styles.errorContainer}>
        <h2>공지사항을 찾을 수 없습니다</h2>
        <p>요청하신 공지사항이 존재하지 않거나 삭제되었습니다.</p>
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
        {onEdit && onDelete && canModifyOrDelete && (
          <div className="flex gap-2">
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
        <h1 className={styles.title}>{noticeData.title}</h1>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.label}>작성일:</span>
            <span className={styles.value}>{formatDate(noticeData.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>작성자:</span>
            <span className={styles.value}>{noticeData.author}</span>
          </div>
        </div>
      </div>

      <div className={styles.separator}></div>

      {fileState.existing.length > 0 && (
        <div className={'hasItem03'}>
          <div className={`${tableStyles.postInfoBox} postInfoBox`}>
            <table className={tableStyles.table}>
              <tbody>
                <FileTr id="notice-files-readonly" label="첨부파일" fileState={fileState} readonly={true} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.contentBody}>
          {noticeData.content.split('\n').map((paragraph, index) =>
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

export default NoticeDetail;
