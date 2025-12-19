'use client';

import { useEffect, useState, useMemo } from 'react';

import { inquiryApi } from '../script/api';
import { Inquiry } from '../script/entity';
import { useAuth } from '@/shared/auth';
import { Loading, Button, Editor, Select } from '@/shared/component';
import { formatDate } from '../script/utils';
import { useAlertStore } from '@/shared/store/alertStore';
import { FileTr } from '@/features/aprv';
import tableStyles from '@/shared/ui/Table/table.module.scss';

import styles from './Inquiry.module.scss';

const InquiryDetail = ({ inquiryId, onBack, onUpdate, isAdminView = false }) => {
  const { user } = useAuth();
  const { showSuccess, showError, showConfirm } = useAlertStore();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [inqStatus, setInqStatus] = useState('CMPL'); // 문의 상태 (PROC, CMPL)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSysAdmin = user?.usrRole === 'SYSADM';

  const fetchInquiryDetail = async () => {
    setLoading(true);
    const result = await inquiryApi.getMyInquiryById(inquiryId);
    if (result && result.data) {
      const fetchedInquiry = Inquiry.fromApi(result.data);
      setInquiry(fetchedInquiry);
      setAnswer(fetchedInquiry.answer || '');
      if (fetchedInquiry.status === 'COMPLETED') {
        setInqStatus('CMPL');
      } else if (fetchedInquiry.status === 'IN_PROGRESS') {
        setInqStatus('PROC');
      } else {
        // 답변이 없는 경우 기본적으로 '확인중'으로 설정
        setInqStatus('PROC');
      }
    } else {
      showError('문의 상세 정보를 불러오는데 실패했습니다.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inquiryId) {
      void fetchInquiryDetail();
    }
  }, [inquiryId]);

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) {
      showError('답변 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    const result = await inquiryApi.answerInquiry(inquiryId, { inqId: inquiryId, ansCtt: answer, inqSt: inqStatus });
    setIsSubmitting(false);

    if (result) {
      showSuccess('답변이 등록되었습니다.');
      if (onUpdate) onUpdate();
      await fetchInquiryDetail();
    } else {
      showError('답변 저장에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    const success = await inquiryApi.deleteInquiry(inquiryId);
    if (success) {
      const { showSuccess } = useAlertStore.getState();
      showSuccess('문의가 성공적으로 삭제되었습니다.');
      if (onBack) onBack();
      if (onUpdate) onUpdate();
    } else {
      showError('문의 삭제에 실패했습니다.');
    }
  };

  const confirmDelete = () => {
    showConfirm({
      title: '문의 삭제',
      message: '정말로 이 문의를 삭제하시겠습니까?',
      onConfirm: handleDelete,
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소'
    });
  };

  const fileState = useMemo(() => {
    if (!inquiry) {
      return { fileId: null, existing: [], new: [], deletedIds: [] };
    }
    return {
      fileId: inquiry.fileId,
      existing: inquiry.fileList || [],
      new: [],
      deletedIds: []
    };
  }, [inquiry]);

  const statusOptions = [
    { value: 'CMPL', label: '처리완료' },
    { value: 'PROC', label: '확인중' }
  ];

  const getStatusDisplay = (status) => {
    if (status === 'COMPLETED') return '처리완료';
    if (status === 'IN_PROGRESS') return '확인중';
    return '답변대기';
  };

  const getStatusClassName = (status) => {
    if (status === 'COMPLETED') return styles.completed;
    if (status === 'IN_PROGRESS') return styles.inProgress;
    return styles.pending;
  };

  if (loading) {
    return <Loading message="문의 상세 정보를 불러오는 중..." />;
  }

  if (!inquiry) {
    return (
      <div className="styles.errorContainer">
        <h2>문의를 찾을 수 없습니다</h2>
        <p>요청하신 문의가 존재하지 않거나 삭제되었습니다.</p>
        <Button variant="primary" onClick={onBack}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.inquiryDetail}>
      <div className={styles.header}>
        <Button variant="basic" onClick={onBack} className={styles.backButton}>
          ← 목록으로
        </Button>
        {isSysAdmin && (
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            삭제
          </Button>
        )}
      </div>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>{inquiry.title}</h1>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.label}>작성자:</span>
            <span className={styles.value}>{inquiry.author}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>작성일:</span>
            <span className={styles.value}>{formatDate(inquiry.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>상태:</span>
            <span className={`${styles.value} ${getStatusClassName(inquiry.status)}`}>
              {getStatusDisplay(inquiry.status)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.separator}></div>

      {fileState.existing.length > 0 && (
        <div className={'hasItem03'}>
          <div className={`${tableStyles.postInfoBox} postInfoBox`}>
            <table className={tableStyles.table}>
              <tbody>
                <FileTr id="inquiry-files-readonly" label="첨부파일" fileState={fileState} readonly={true} />
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.contentBody}>
          <p className={styles.paragraph}>{inquiry.content}</p>
        </div>
      </div>

      <div className={styles.answerSection}>
        <h2 className={styles.answerTitle}>답변</h2>
        {inquiry.answer ? (
          <div className="flex flex-col gap-4">
            <p className={styles.paragraph}>{inquiry.answer}</p>
          </div>
        ) : isAdminView ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={styles.label}>문의 상태:</span>
              <Select options={statusOptions} value={inqStatus} onChange={setInqStatus} className="w-40" />
            </div>
            <Editor
              content={answer}
              onChange={(newContent) => setAnswer(newContent)}
              placeholder="답변을 입력하세요..."
            />
            <Button variant="primary" onClick={handleAnswerSubmit} disabled={isSubmitting} className="self-end">
              {isSubmitting ? '저장 중...' : '답변 저장'}
            </Button>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">아직 답변이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default InquiryDetail;
